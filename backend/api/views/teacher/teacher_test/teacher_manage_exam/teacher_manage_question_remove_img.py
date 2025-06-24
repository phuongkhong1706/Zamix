# views/teacher_remove_question_image.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.core.files.storage import default_storage
from api.models import Question
from api.views.auth.authhelper import get_authenticated_user
import traceback

class TeacherRemoveQuestionImageView(APIView):
    def delete(self, request, question_id):
        try:
            print(f"🧽 DELETE ảnh câu hỏi ID = {question_id}")

            user_from_token, error_response = get_authenticated_user(request)
            if error_response:
                return error_response

            question = get_object_or_404(Question, question_id=question_id)

            if question.test.user.id != user_from_token.id:
                return Response(
                    {"message": "Bạn không có quyền xóa ảnh câu hỏi này."},
                    status=status.HTTP_403_FORBIDDEN
                )

            if not question.image:
                return Response({"message": "Câu hỏi không có ảnh để xoá."}, status=status.HTTP_400_BAD_REQUEST)

            # Xoá file ảnh
            if default_storage.exists(question.image.name):
                default_storage.delete(question.image.name)
                print(f"🗑️ Đã xoá file ảnh: {question.image.name}")

            question.image = None
            question.save()

            return Response({"message": "✅ Ảnh đã được xoá khỏi câu hỏi."}, status=status.HTTP_200_OK)

        except Exception as e:
            print("❌ Lỗi khi xoá ảnh câu hỏi:")
            traceback.print_exc()
            return Response(
                {"message": "Lỗi nội bộ khi xoá ảnh", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
