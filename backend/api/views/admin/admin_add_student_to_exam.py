from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth.models import User
from api.models import Exam, ExamParticipation

class AdminAddStudentsToExamView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        exam_id = request.data.get("exam_id")
        student_ids = request.data.get("student_ids", [])

        if not exam_id or not isinstance(student_ids, list):
            return Response(
                {"error": "Thiếu exam_id hoặc student_ids không hợp lệ."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({"error": "Kỳ thi không tồn tại."}, status=status.HTTP_404_NOT_FOUND)

        added = []
        skipped = []

        for student_id in student_ids:
            try:
                student = User.objects.get(id=student_id)

                # Kiểm tra đã tồn tại chưa
                if not ExamParticipation.objects.filter(student=student, exam=exam).exists():
                    ExamParticipation.objects.create(student=student, exam=exam)
                    added.append(student_id)
                else:
                    skipped.append(student_id)

            except User.DoesNotExist:
                skipped.append(student_id)

        return Response({
            "message": f"Đã thêm {len(added)} học sinh.",
            "added": added,
            "skipped": skipped
        }, status=status.HTTP_201_CREATED)
