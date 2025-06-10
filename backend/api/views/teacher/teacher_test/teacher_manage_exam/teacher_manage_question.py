from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from api.models import Question, Test, User
from api.serializers import QuestionSerializer
from api.views.auth.authhelper import get_authenticated_user
import traceback


class TeacherManageQuestionView(APIView):
    def post(self, request):
        try:
            print("📝 POST tạo câu hỏi mới")

            user_from_token, error_response = get_authenticated_user(request)
            if error_response:
                print("❌ Lỗi xác thực token:", error_response.content.decode())
                return error_response

            data = request.data
            print("📥 Dữ liệu đầu vào:", data)
            
            # ✅ Kiểm tra có file image không
            image_file = request.FILES.get('image', None)
            if image_file:
                print(f"📷 File ảnh nhận được: {image_file.name}, Size: {image_file.size} bytes")

            required_fields = ['test', 'content', 'user']
            for field in required_fields:
                if field not in data:
                    return Response(
                        {"message": f"Thiếu trường bắt buộc: {field}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Kiểm tra test có tồn tại và thuộc quyền sở hữu
            test = get_object_or_404(Test, test_id=data['test'])
            if test.user.id != user_from_token.id:
                return Response(
                    {"message": "Bạn không có quyền thêm câu hỏi vào đề thi này."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Lấy đối tượng user từ ID gửi lên
            user_obj = get_object_or_404(User, id=data['user'])

            # ✅ Xử lý boolean fields từ FormData
            is_gened_by_model = data.get('is_gened_by_model', False)
            created_by_question = data.get('created_by_question', False)
            
            # Convert string boolean values từ FormData thành Python boolean
            if isinstance(is_gened_by_model, str):
                is_gened_by_model = is_gened_by_model.lower() in ['true', '1', 'yes']
            if isinstance(created_by_question, str):
                created_by_question = created_by_question.lower() in ['true', '1', 'yes']

            # ✅ Tạo câu hỏi với image
            question = Question.objects.create(
                test=test,
                content=data['content'],
                type=data.get('type', 'single'),
                score=float(data.get('score', 1.0)),  # Đảm bảo score là float
                level=int(data.get('level', 1)),      # Đảm bảo level là int
                is_gened_by_model=is_gened_by_model,
                created_by_question=created_by_question,
                user=user_obj,
                image=image_file  # ✅ Thêm image vào câu hỏi
            )

            serialized = QuestionSerializer(question)
            print("✅ Tạo câu hỏi thành công:", serialized.data)
            
            # ✅ Log thông tin image nếu có
            if question.image:
                print(f"📷 Ảnh đã được lưu: {question.image.url}")
            
            return Response(serialized.data, status=status.HTTP_201_CREATED)

        except ValueError as ve:
            print(f"❌ Lỗi chuyển đổi dữ liệu: {ve}")
            return Response(
                {"message": "Dữ liệu không hợp lệ", "detail": str(ve)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print("❌ Lỗi bất ngờ khi tạo câu hỏi:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request, question_id):
        try:
            print("✏️ PUT cập nhật câu hỏi")

            user_from_token, error_response = get_authenticated_user(request)
            if error_response:
                print("❌ Lỗi xác thực token:", error_response.content.decode())
                return error_response

            data = request.data
            print("📥 Dữ liệu đầu vào:", data)

            # Lấy câu hỏi
            question = get_object_or_404(Question, id=question_id)

            # Kiểm tra quyền chỉnh sửa
            if question.test.user.id != user_from_token.id:
                return Response(
                    {"message": "Bạn không có quyền cập nhật câu hỏi này."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Cập nhật trường
            question.content = data.get('content', question.content)
            question.type = data.get('type', question.type)
            question.score = data.get('score', question.score)
            question.level = data.get('level', question.level)
            question.is_gened_by_model = data.get('is_gened_by_model', question.is_gened_by_model)
            question.created_by_question = data.get('created_by_question', question.created_by_question)

            # Nếu có trường `user` được gửi lên thì cập nhật
            if 'user' in data:
                user_obj = get_object_or_404(User, id=data['user'])
                question.user = user_obj

            question.save()

            serialized = QuestionSerializer(question)
            print("✅ Cập nhật câu hỏi thành công:", serialized.data)
            return Response(serialized.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("❌ Lỗi bất ngờ khi cập nhật câu hỏi:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
