from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from api.models import Question, Test, User, Topic
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

            image_file = request.FILES.get('image', None)
            if image_file:
                print(f"📷 File ảnh nhận được: {image_file.name}, Size: {image_file.size} bytes")

            # ✅ Các trường bắt buộc
            required_fields = ['content', 'user']
            for field in required_fields:
                if field not in data or not data[field]:
                    return Response(
                        {"message": f"Thiếu trường bắt buộc: {field}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # ✅ Lấy user tạo câu hỏi
            user_obj = get_object_or_404(User, id=data['user'])

            # ✅ Lấy test nếu có, không bắt buộc
            test = None
            test_id = data.get('test')
            if test_id:
                try:
                    test = Test.objects.get(test_id=test_id)
                    if test.user.id != user_from_token.id:
                        return Response(
                            {"message": "Bạn không có quyền thêm câu hỏi vào đề thi này."},
                            status=status.HTTP_403_FORBIDDEN
                        )
                except Test.DoesNotExist:
                    return Response(
                        {"message": f"Test ID {test_id} không tồn tại."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # ✅ Boolean fields
            is_gened_by_model = str(data.get('is_gened_by_model', '')).lower() in ['true', '1', 'yes']
            created_by_question = str(data.get('created_by_question', '')).lower() in ['true', '1', 'yes']

            # ✅ Lấy topic nếu có
            topic = None
            if 'topic' in data and data['topic']:
                try:
                    topic = Topic.objects.get(topic_id=data['topic'])
                except Topic.DoesNotExist:
                    return Response({"message": "Chủ đề không tồn tại."}, status=status.HTTP_400_BAD_REQUEST)

            # ✅ Check trùng nội dung
            existing_question = Question.objects.filter(
                content=data['content'].strip(),
                test=test
            ).first()
            if existing_question:
                print(f"⚠️ Câu hỏi đã tồn tại (question_id={existing_question.question_id}), không tạo mới")
                serialized = QuestionSerializer(existing_question)
                return Response(serialized.data, status=status.HTTP_200_OK)

            # ✅ Tạo câu hỏi
            question = Question.objects.create(
                test=test,
                content=data['content'],
                type=data.get('type', 'single'),
                score=float(data.get('score', 1.0)),
                level=int(data.get('level', 1)),
                is_gened_by_model=is_gened_by_model,
                created_by_question=created_by_question,
                user=user_obj,
                topic=topic,
                image=image_file
            )

            serialized = QuestionSerializer(question)
            print("✅ Tạo câu hỏi thành công:", serialized.data)

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
            question = get_object_or_404(Question, question_id=question_id)

            # Nếu có test thì kiểm tra quyền sở hữu
            test_obj = getattr(question, 'test', None)
            if test_obj and test_obj.user.id != user_from_token.id:
                return Response(
                    {"message": "Bạn không có quyền cập nhật câu hỏi này."},
                    status=status.HTTP_403_FORBIDDEN
                )


            # Nếu client gửi file image mới
            image_file = request.FILES.get('image', None)
            if image_file:
                print(f"📷 Ảnh mới nhận được: {image_file.name}, Size: {image_file.size} bytes")
                question.image = image_file

            # Cập nhật các trường cơ bản
            question.content = data.get('content', question.content)
            question.type = data.get('type', question.type)
            question.score = float(data.get('score', question.score))
            question.level = int(data.get('level', question.level))

            # Boolean có thể là string nên xử lý
            def to_bool(val, default=False):
                if isinstance(val, bool):
                    return val
                if isinstance(val, str):
                    return val.lower() in ['1', 'true', 'yes']
                return default

            question.is_gened_by_model = to_bool(data.get('is_gened_by_model'), question.is_gened_by_model)
            question.created_by_question = to_bool(data.get('created_by_question'), question.created_by_question)

            # Cập nhật test nếu gửi test mới
            if 'test' in data:
                test_id = data['test']
                if test_id:
                    try:
                        test = Test.objects.get(test_id=test_id)
                        if test.user.id != user_from_token.id:
                            return Response({"message": "Bạn không có quyền gán câu hỏi vào đề này."}, status=status.HTTP_403_FORBIDDEN)
                        question.test = test
                    except Test.DoesNotExist:
                        return Response({"message": "Không tìm thấy đề thi."}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    question.test = None

            # Cập nhật user nếu được gửi
            if 'user' in data:
                try:
                    user_obj = User.objects.get(id=data['user'])
                    question.user = user_obj
                except User.DoesNotExist:
                    return Response({"message": "Người dùng không tồn tại."}, status=status.HTTP_400_BAD_REQUEST)

            # Cập nhật topic
            if 'topic' in data:
                if data['topic']:
                    try:
                        topic = Topic.objects.get(topic_id=data['topic'])
                        question.topic = topic
                    except Topic.DoesNotExist:
                        return Response({"message": "Chủ đề không tồn tại."}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    question.topic = None

            question.save()

            serialized = QuestionSerializer(question)
            print("✅ Cập nhật câu hỏi thành công:", serialized.data)

            if question.image:
                print(f"📷 Ảnh sau khi lưu: {question.image.url}")

            return Response(serialized.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("❌ Lỗi bất ngờ khi cập nhật câu hỏi:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


    def delete(self, request, question_id):
        try:
            print(f"🗑️ DELETE câu hỏi {question_id}")

            user_from_token, error_response = get_authenticated_user(request)
            if error_response:
                print("❌ Lỗi xác thực token:", error_response.content.decode())
                return error_response

            # Lấy câu hỏi
            question = get_object_or_404(Question, question_id=question_id)

            # Kiểm tra quyền
            if question.test.user.id != user_from_token.id:
                return Response(
                    {"message": "Bạn không có quyền xóa câu hỏi này."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # ✅ Xóa các đáp án liên quan (có thể không cần vì on_delete=CASCADE đã xử lý)
            deleted_answers_count = question.answers.all().delete()[0]
            print(f"🧹 Đã xóa {deleted_answers_count} đáp án liên quan")

            # ✅ Xóa câu hỏi
            question.delete()

            return Response(
                {"message": "🗑️ Xóa câu hỏi và các đáp án liên quan thành công!"},
                status=status.HTTP_204_NO_CONTENT
            )

        except Exception as e:
            print("❌ Lỗi bất ngờ khi xóa câu hỏi:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )