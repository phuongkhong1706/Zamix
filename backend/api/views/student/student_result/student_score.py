import traceback
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from api.models import Result, Test
from api.views.auth.authhelper import get_authenticated_user

class StudentExamScoresView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            # Xác thực học sinh
            user, error_response = get_authenticated_user(request)
            if error_response:
                return error_response

            results = Result.objects.filter(user=user).select_related('test__exam', 'test__shift')
            exam_scores = []
            for result in results:
                test = result.test
                exam = test.exam
                shift = test.shift

                exam_scores.append(
                    {
                        "id": result.result_id,
                        "test_id": test.test_id,  # ✅ Thêm test_id
                        "examTitle": exam.name if exam else test.name,
                        "semester": exam.type if exam else "",
                        "examDate": exam.time_start.strftime("%Y-%m-%d") if exam else "",
                        "slot": str(shift.shift_id) if shift else "",
                        "score": result.total_score,
                        "grade": str(exam.grade) if exam else "",
                    }
                )

            return Response(
                {"examScores": exam_scores},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            traceback.print_exc()
            return Response(
                {"message": "❌ Lỗi hệ thống.", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

