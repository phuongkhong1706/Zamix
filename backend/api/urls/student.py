from django.urls import path
from api.views.student.home import HomeView
from api.views.student.do_exam import DoExamView


urlpatterns = [
    path('student/home/', HomeView.as_view(), name='student_home'),
    path('student/do_exam/', DoExamView.as_view(), name='student_do_exam'),
]
