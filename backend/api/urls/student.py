from django.urls import path
from api.views.student.home import StudentHomeView
from api.views.student.do_exam import StudentDoExamView
from api.views.student.do_exam import StudentDoExamDetailView
from api.views.student.student_test.student_detail_test import StudentDetailTestView
from api.views.student.student_test.student_do_exam import StudentDoTestView
from api.views.student.student_practice.student_manage_practice import StudentPracticeExamView
from api.views.student.student_result.student_score import StudentExamScoresView
from api.views.student.student_result.student_review_exam import StudentExamReviewView
from api.views.student.student_result.student_remark_exam import StudentExamRemarkView
urlpatterns = [
    path('student/home/', StudentHomeView.as_view(), name='student_home'),
    path('student/do_exam/', StudentDoExamView.as_view(), name='student_do_exam'),
    path('student/do_exam/exams/<int:exam_id>/', StudentDoExamDetailView.as_view(), name='student_do_exam_detail'),  # THÊM DÒNG NÀY
    path('student/student_test/student_detail_test/<int:id>/', StudentDetailTestView.as_view(), name='student_detail_test_id'),
    path('student/student_test/student_detail_test/', StudentDetailTestView.as_view(), name='student_detail_test'),
    path('student/student_test/student_do_exam/', StudentDoTestView.as_view(), name='student_do_test'),
    path('student/student_practice/student_manage_practice/', StudentPracticeExamView.as_view(), name='student_practice_exam'),
    path('student/student_result/student_score/', StudentExamScoresView.as_view(), name='student_exam_scores'),
    path('student/student_result/student_review_exam/<int:test_id>/', StudentExamReviewView.as_view(), name='student_exam_review'),
    path('student/student_result/student_remark_exam/<int:test_id>/', StudentExamRemarkView.as_view(), name='student_exam_remark'),
]
