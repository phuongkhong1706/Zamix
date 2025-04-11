from django.urls import path
from api.views.student.home import StudentHomeView
from api.views.student.do_exam import StudentDoExamView
from api.views.student.do_exam import StudentDoExamDetailView


urlpatterns = [
    path('student/home/', StudentHomeView.as_view(), name='student_home'),
    path('student/do_exam/', StudentDoExamView.as_view(), name='student_do_exam'),
    path('student/do_exam/exams/<int:exam_id>/', StudentDoExamDetailView.as_view(), name='student_do_exam_detail'),  # THÊM DÒNG NÀY
]
