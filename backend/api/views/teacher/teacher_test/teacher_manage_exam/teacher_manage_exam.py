from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from api.models import Exam
from api.serializers import ExamsSerializer


class TeacherManageExamView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        grade_param = request.query_params.get("grade")
        exam_type = request.query_params.get("type")
        status_param = request.query_params.get("status")

        # Chỉ lấy các kỳ thi đã được duyệt (is_approve = 1)
        exams = Exam.objects.filter(is_approve=1)

        if grade_param:
            try:
                grade_value = int(grade_param)
                exams = exams.filter(grade=grade_value)
            except ValueError:
                return Response({'error': f'Invalid grade value: {grade_param}'}, status=400)

        if exam_type:
            exams = exams.filter(type=exam_type)

        if status_param:
            exams = exams.filter(status=status_param)

        serialized = ExamsSerializer(exams, many=True)
        return Response(serialized.data)


