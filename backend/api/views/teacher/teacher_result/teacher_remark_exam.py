from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from api.models import TeacherReviewTest, Test, User, Result
from django.db import IntegrityError


class TeacherRemarkExamView(APIView):
    def post(self, request, test_id, student_id):
        try:
            reason = request.data.get('remarkReason', '').strip()
            score = request.data.get('currentScore')

            if not reason:
                return Response({"message": "❌ Thiếu lý do phúc tra"}, status=status.HTTP_400_BAD_REQUEST)
            if score is None:
                return Response({"message": "❌ Thiếu điểm cập nhật"}, status=status.HTTP_400_BAD_REQUEST)

            # Lấy test, student, teacher
            test = get_object_or_404(Test, test_id=test_id)
            student = get_object_or_404(User, id=student_id)
            teacher = test.user

            # Kiểm tra đã phúc tra chưa
            if TeacherReviewTest.objects.filter(test=test, student=student).exists():
                return Response({"message": "❌ Bài thi này đã được phúc tra trước đó."},
                                status=status.HTTP_400_BAD_REQUEST)

            # Tạo bản ghi phúc tra
            review = TeacherReviewTest.objects.create(
                test=test,
                teacher=teacher,
                student=student,
                score=score,
                reason=reason
            )

            # ✅ Cập nhật remarks trong Result
            result = Result.objects.filter(user=student, test=test).first()
            if result:
                result.remarks = str(score)  # cập nhật remarks bằng điểm mới
                result.save()

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

        except IntegrityError:
            return Response({"message": "❌ Bài thi này đã được phúc tra (trùng unique_together)"},
                            status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback; traceback.print_exc()
            return Response(
                {"message": "❌ Lỗi hệ thống.", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
