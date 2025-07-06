from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...models import Exam
from ...serializers import ExamQuestionSerializer, ExamsSerializer
from rest_framework import status, permissions


class StudentDoExamView(APIView):
    permission_classes = [permissions.AllowAny]  # ✅ Cho phép truy cập tự do

    def get(self, request):
        student_id = request.query_params.get("student_id")

        if not student_id:
            return Response({"error": "Thiếu student_id"}, status=status.HTTP_400_BAD_REQUEST)

        exams = Exam.objects.filter(
            is_approve=1,
            examparticipation__student_id=student_id
        ).distinct()

        if exams.exists():
            serializer = ExamsSerializer(exams, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Không có kỳ thi nào phù hợp"}, status=status.HTTP_200_OK)



class StudentDoExamDetailView(APIView):
    def get(self, request, exam_id):
        try:
            exam = Exam.objects.get(id=exam_id)
            questions = exam.questions.all()
            serializer = ExamQuestionSerializer(questions, many=True)
            
            return Response({
                "exam_title": exam.name,
                "exam_id": exam.id,
                "duration": 3600,
                "questions": serializer.data
            }, status=status.HTTP_200_OK)
        except Exam.DoesNotExist:
            return Response({"message": "Kỳ thi không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

