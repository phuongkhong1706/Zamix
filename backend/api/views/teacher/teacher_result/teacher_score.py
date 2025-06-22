from django.db.models import Avg
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from api.models import Exam, Test, Result, StudentReviewTest, UserInformation

class TeacherExamScoreView(APIView):
    """
    Trả về danh sách exams, results và reviews dạng JSON
    """
    def get(self, request):
        try:
            # 1. Lấy danh sách exams
            exams = Exam.objects.all().select_related('user')
            exams_data = []
            for exam in exams:
                # Tìm teacher_id
                teacher_id = exam.user_id
                
                # Total tests trong kỳ thi
                tests = Test.objects.filter(exam=exam)
                test_ids = tests.values_list('test_id', flat=True)

                # Total students tham gia kỳ thi
                total_students = Result.objects.filter(test__exam=exam).values('user').distinct().count()

                # Total students hoàn thành (status = completed: giả sử status=0 nghĩa là đã nộp bài)
                completed_students = Result.objects.filter(
                    test__exam=exam, status=0
                ).values('user').distinct().count()

                # Average score
                avg_score = Result.objects.filter(
                    test__exam=exam
                ).aggregate(avg_score=Avg('total_score'))['avg_score'] or 0.0

                exams_data.append({
                    "exam_id": exam.pk,
                    "name": exam.name,
                    "grade": str(exam.grade),
                    "type": exam.type,
                    "start_time": exam.time_start,
                    "end_time": exam.time_end,
                    "teacher_id": teacher_id,
                    "total_students": total_students,
                    "completed_students": completed_students,
                    "avg_score": round(avg_score, 2),
                })

            # 2. Lấy danh sách results
            results = Result.objects.select_related('user', 'test', 'test__exam')
            results_data = []
            for result in results:
                # Lấy UserInformation
                user_info = UserInformation.objects.filter(id=result.user_id).first()
                results_data.append({
                    "result_id": result.pk,
                    "student_id": result.user_id,
                    "test_id": result.test_id,
                    "exam_id": result.test.exam_id,
                    "start_time": result.start_time,
                    "end_time": result.end_time,
                    "total_score": result.total_score,
                    "status": "completed" if result.status == 0 else "inprogress",
                    "student_name": user_info.full_name if user_info else "",
                    "student_code": user_info.id if user_info else ""
                })

            # 3. Lấy danh sách reviews
            reviews = StudentReviewTest.objects.select_related('test', 'student')
            reviews_data = []
            for review in reviews:
                user_info = UserInformation.objects.filter(id=review.student_id).first()
                reviews_data.append({
                    "test_id": review.test_id,
                    "student_id": review.student_id,
                    "exam_id": review.test.exam_id,
                    "student_name": user_info.full_name if user_info else "",
                    "student_code": user_info.id if user_info else "",
                    "created_at": review.created_at,
                    "score": review.score,
                    "reason": review.reason,
                    "status": "pending"
                })
            
            return Response(
                {"exams": exams_data, "results": results_data, "reviews": reviews_data},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {"message": "❌ Lỗi hệ thống.", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
