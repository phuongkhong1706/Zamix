from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.dateformat import format as django_format_date
from django.contrib.auth.models import User

from api.models import UserInformation, Result, Test, Exam, StudentReviewTest

class StudentExamRemarkView(APIView):
    """
    Lấy thông tin mặc định để fill form phúc tra.
    - user_id lấy từ query params
    - trả thông tin student + exam + result
    """
    def get(self, request, test_id):
        try:
            user_id = request.query_params.get('user_id')
            if not user_id:
                return Response(
                    {"message": "❌ Thiếu user_id trong query params."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # User information
            user_info = get_object_or_404(UserInformation, id=user_id)

            # Kết quả bài thi
            result = get_object_or_404(Result, user_id=user_id, test__test_id=test_id)

            # Bài thi và kỳ thi
            test = result.test
            exam = test.exam

            data = {
                "studentInfo": {
                    "fullName": user_info.full_name,
                    "className": f"Lớp {exam.grade if exam else ''}",
                    "dob": django_format_date(user_info.birth_date, "Y-m-d") if user_info.birth_date else "",
                },
                "examInfo": {
                    "title": test.name,
                    "type": test.type,
                    "timeStart": django_format_date(exam.time_start, "Y-m-d") if exam else "",
                    "timeEnd": django_format_date(exam.time_end, "Y-m-d") if exam else "",
                    "duration": test.duration_minutes,
                    "score": result.total_score,
                },
                "remarkReasonDefault": "thắc mắc"
            }
            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            import traceback; traceback.print_exc()
            return Response(
                {"message": "❌ Lỗi hệ thống.", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request, test_id):
        try:
            user_id = request.data.get('user_id')
            reason = request.data.get('remarkReason', 'thắc mắc')
            score = request.data.get('currentScore')

            if not user_id:
                return Response({"message": "❌ Thiếu user_id"}, status=status.HTTP_400_BAD_REQUEST)

            if not reason:
                return Response({"message": "❌ Thiếu lý do phúc tra"}, status=status.HTTP_400_BAD_REQUEST)

            # Fetch user and test
            user = get_object_or_404(User, id=user_id)
            test = get_object_or_404(Test, test_id=test_id)

            # Check duplicate
            if StudentReviewTest.objects.filter(student=user, test=test).exists():
                return Response({"message": "❌ Bạn đã gửi phúc tra cho bài thi này trước đó"}, status=status.HTTP_400_BAD_REQUEST)

            # Get teacher (người tạo đề thi)
            teacher = test.user

            # Save review request
            review = StudentReviewTest.objects.create(
                student=user,
                test=test,
                score=score,
                reason=reason,
                teacher=teacher
            )

            return Response(
                {
                    "message": "✅ Gửi phúc tra thành công",
                    "data": {
                        "id": review.id,
                        "reason": review.reason,
                        "score": review.score,
                        "submitted_at": review.created_at,
                    }
                },
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            import traceback; traceback.print_exc()
            return Response(
                {"message": "❌ Lỗi hệ thống.", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )