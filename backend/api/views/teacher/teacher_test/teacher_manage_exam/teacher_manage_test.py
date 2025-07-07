from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from api.models import Test
from api.serializers import TestSerializer


class TeacherManageTestView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, exam_id):
        grade_param = request.query_params.get("grade")
        level_param = request.query_params.get("level")
        shift_param = request.query_params.get("shift_id")

        # Lọc theo exam_id và type trước
        tests = Test.objects.filter(exam_id=exam_id, type="Thi chính thức")

        if grade_param:
            tests = tests.filter(shift__exam__grade=grade_param)

        if level_param:
            tests = tests.filter(level=level_param)

        if shift_param:
            try:
                shift_id = int(shift_param)
                tests = tests.filter(shift_id=shift_id)
            except ValueError:
                return Response({'error': f'Invalid shift_id: {shift_param}'}, status=400)

        serialized = TestSerializer(tests, many=True)
        return Response(serialized.data)