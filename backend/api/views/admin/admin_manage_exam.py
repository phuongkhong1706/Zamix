from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from api.models import Exam
from api.serializers import ExamsSerializerAdmin
from rest_framework import status

class AdminManageExamView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        grade_param = request.query_params.get("grade")
        exam_type = request.query_params.get("type")
        status_param = request.query_params.get("status")

        # Admin có thể thấy tất cả các kỳ thi (không lọc is_approve)
        exams = Exam.objects.all()

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

        serialized = ExamsSerializerAdmin(exams, many=True)
        return Response(serialized.data)

    def put(self, request):
        exam_id = request.data.get("exam_id")
        if not exam_id:
            return Response({"error": "Thiếu exam_id"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({"error": "Không tìm thấy kỳ thi"}, status=status.HTTP_404_NOT_FOUND)

        exam.is_approve = True
        exam.save()

        return Response({"message": "Kỳ thi đã được duyệt thành công!"}, status=status.HTTP_200_OK)
    

    def delete(self, request):
        exam_id = request.data.get("exam_id")
        if not exam_id:
            return Response({"error": "Thiếu exam_id"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            exam = Exam.objects.get(id=exam_id)
            exam.delete()
            return Response({"message": "Đã xóa kỳ thi thành công"}, status=status.HTTP_200_OK)
        except Exam.DoesNotExist:
            return Response({"error": "Kỳ thi không tồn tại"}, status=status.HTTP_404_NOT_FOUND)