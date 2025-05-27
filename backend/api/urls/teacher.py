from django.urls import path
from api.views.teacher.home import TeacherHomeView
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_manage_exam import TeacherManageExamView
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_detail_exam import TeacherDetailExamView
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_manage_test import TeacherManageTestView

urlpatterns = [
    path('teacher/home/', TeacherHomeView.as_view(), name='teacher_home'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_exam/', TeacherManageExamView.as_view(), name='teacher_manage_exam'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_detail_exam/', TeacherDetailExamView.as_view(), name='teacher_detail_exam'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_detail_exam/<int:id>/', TeacherDetailExamView.as_view(), name='teacher_detail_exam_id'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_test/', TeacherManageTestView.as_view(), name='teacher_manage_test'),
]
