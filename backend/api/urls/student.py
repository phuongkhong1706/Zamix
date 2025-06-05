from django.urls import path
from api.views.student.home import StudentHomeView
from api.views.student.do_exam import StudentDoExamView
from api.views.student.do_exam import StudentDoExamDetailView
from api.views.student.student_test.student_detail_test import StudentDetailTestView
from api.views.student.student_test.student_do_exam import StudentDoTestView
urlpatterns = [
    path('student/home/', StudentHomeView.as_view(), name='student_home'),
    path('student/do_exam/', StudentDoExamView.as_view(), name='student_do_exam'),
    path('student/do_exam/exams/<int:exam_id>/', StudentDoExamDetailView.as_view(), name='student_do_exam_detail'),  # THÊM DÒNG NÀY
    path('student/student_test/student_detail_test/<int:id>/', StudentDetailTestView.as_view(), name='student_detail_test_id'),
    path('student/student_test/student_detail_test/', StudentDetailTestView.as_view(), name='student_detail_test'),
    path('student/student_test/student_do_exam/', StudentDoTestView.as_view(), name='student_do_test'),
]
