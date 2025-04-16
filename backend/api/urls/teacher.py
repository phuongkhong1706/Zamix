from django.urls import path
from api.views.teacher.home import TeacherHomeView

urlpatterns = [
    path('teacher/home/', TeacherHomeView.as_view(), name='teacher_home'),
]
