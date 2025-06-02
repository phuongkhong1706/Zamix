# api/views/teacher/questions.py

import traceback
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from api.models import Question, Test
from api.serializers import QuestionSerializer
from api.views.auth.authhelper import get_authenticated_user


class TeacherManageQuestionView(APIView):
    def post(self, request):
        try:
            print("📝 POST tạo câu hỏi mới")

            # Xác thực người dùng
            user, error_response = get_authenticated_user(request)
            if error_response:
                print("❌ Lỗi xác thực token:", error_response.content.decode())
                return error_response

            data = request.data
            print("📥 Dữ liệu đầu vào:", data)

            required_fields = ['test', 'content']
            for field in required_fields:
                if field not in data:
                    return Response(
                        {"message": f"Thiếu trường bắt buộc: {field}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Kiểm tra test tồn tại và thuộc quyền của user
            test = get_object_or_404(Test, test_id=data['test'])
            if test.user.id != user.id:
                return Response(
                    {"message": "Bạn không có quyền thêm câu hỏi vào đề thi này."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Tạo câu hỏi
            question = Question.objects.create(
                test=test,
                content=data['content'],
                type=data.get('type', 'single'),
                score=data.get('score', 1.0),
                level=data.get('level', 1),
                is_gened_by_model=data.get('is_gened_by_model', False),
                created_by_question=data.get('created_by_question', False)
            )

            serialized = QuestionSerializer(question)
            print("✅ Tạo câu hỏi thành công:", serialized.data)
            return Response(serialized.data, status=status.HTTP_201_CREATED)

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

            # Xác thực người dùng
            user, error_response = get_authenticated_user(request)
            if error_response:
                print("❌ Lỗi xác thực token:", error_response.content.decode())
                return error_response

            data = request.data
            print("📥 Dữ liệu đầu vào:", data)

            # Lấy câu hỏi cần cập nhật
            question = get_object_or_404(Question, id=question_id)

            # Kiểm tra quyền người dùng
            if question.test.user.id != user.id:
                return Response(
                    {"message": "Bạn không có quyền cập nhật câu hỏi này."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Cập nhật các trường (nếu có)
            question.content = data.get('content', question.content)
            question.type = data.get('type', question.type)
            question.score = data.get('score', question.score)
            question.level = data.get('level', question.level)
            question.is_gened_by_model = data.get('is_gened_by_model', question.is_gened_by_model)
            question.created_by_question = data.get('created_by_question', question.created_by_question)
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