from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ...models import Exam
from ...serializers import ExamQuestionSerializer, ExamSerializer

class StudentDoExamView(APIView):
    def get(self, request):
        exams = Exam.objects.all()
        if exams.exists():
            serializer = ExamSerializer(exams, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Không có kỳ thi nào"}, status=status.HTTP_200_OK)

class StudentDoExamDetailView(APIView):
    def get(self, request, exam_id):
        try:
            exam = Exam.objects.get(id=exam_id)
            questions = exam.questions.all()
            serializer = ExamQuestionSerializer(questions, many=True)
            
            return Response({
                "exam_title": exam.title,
                "exam_id": exam.id,
                "duration": exam.duration,
                "questions": serializer.data
            }, status=status.HTTP_200_OK)
        except Exam.DoesNotExist:
            return Response({"message": "Kỳ thi không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

