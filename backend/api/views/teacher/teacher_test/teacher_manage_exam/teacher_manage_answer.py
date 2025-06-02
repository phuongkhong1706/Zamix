# api/views/teacher/answers.py

import traceback
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from api.models import Answer, Question
from api.serializers import AnswerSerializer
from api.views.auth.authhelper import get_authenticated_user


class TeacherManageAnswerView(APIView):
    def post(self, request):
        try:
            print("📝 POST tạo đáp án mới")

            user, error_response = get_authenticated_user(request)
            if error_response:
                print("❌ Lỗi xác thực token:", error_response.content.decode())
                return error_response

            data = request.data
            print("📥 Dữ liệu đầu vào:", data)

            required_fields = ['question', 'content', 'is_correct']
            for field in required_fields:
                if field not in data:
                    return Response(
                        {"message": f"Thiếu trường bắt buộc: {field}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            question = get_object_or_404(Question, question_id=data['question'])

            if question.test.user.id != user.id:
                return Response(
                    {"message": "Bạn không có quyền thêm đáp án cho câu hỏi này."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            answer = Answer.objects.create(
                question=question,
                content=data['content'],
                is_correct=data['is_correct']
            )

            serialized = AnswerSerializer(answer)
            print("✅ Tạo đáp án thành công:", serialized.data)
            return Response(serialized.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("❌ Lỗi bất ngờ khi tạo đáp án:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request, answer_id):
            try:
                print("✏️ PUT cập nhật đáp án")

                user, error_response = get_authenticated_user(request)
                if error_response:
                    print("❌ Lỗi xác thực token:", error_response.content.decode())
                    return error_response

                data = request.data
                print("📥 Dữ liệu đầu vào:", data)

                answer = get_object_or_404(Answer,answers=answer_id)

                if answer.question.test.user.id != user.id:
                    return Response(
                        {"message": "Bạn không có quyền cập nhật đáp án này."},
                        status=status.HTTP_403_FORBIDDEN,
                    )

                # Cập nhật các trường nếu có
                answer.content = data.get('content', answer.content)
                answer.is_correct = data.get('is_correct', answer.is_correct)
                answer.save()

                serialized = AnswerSerializer(answer)
                print("✅ Cập nhật đáp án thành công:", serialized.data)
                return Response(serialized.data, status=status.HTTP_200_OK)

            except Exception as e:
                print("❌ Lỗi bất ngờ khi cập nhật đáp án:")
                traceback.print_exc()
                return Response(
                    {"message": "Internal Server Error", "detail": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )