from django.urls import path
from api.views.teacher.home import TeacherHomeView
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_manage_exam import TeacherManageExamView
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_detail_exam import TeacherDetailExamView
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_manage_test import TeacherManageTestView
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_detail_test import TeacherDetailTestView
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_manage_topic_exam import TeacherManageTopicExam
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_manage_question import TeacherManageQuestionView
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_manage_answer import TeacherManageAnswerView
urlpatterns = [
    path('teacher/home/', TeacherHomeView.as_view(), name='teacher_home'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_exam/', TeacherManageExamView.as_view(), name='teacher_manage_exam'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_detail_exam/', TeacherDetailExamView.as_view(), name='teacher_detail_exam'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_detail_exam/<int:id>/', TeacherDetailExamView.as_view(), name='teacher_detail_exam_id'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_test/', TeacherManageTestView.as_view(), name='teacher_manage_test'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_detail_test/', TeacherDetailTestView.as_view(), name='teacher_detail_test'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_detail_test/<int:id>/', TeacherDetailTestView.as_view(), name='teacher_detail_test_id'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_topic_exam/', TeacherManageTopicExam.as_view(), name='teacher_manage_topic_exam'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_question/', TeacherManageQuestionView.as_view(), name='teacher_manage_question'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_question/<int:question_id>', TeacherManageQuestionView.as_view(), name='teacher_manage_question'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_answer/', TeacherManageAnswerView.as_view(), name='teacher_manage_answer'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_answer/<int:answer_id>', TeacherManageAnswerView.as_view(), name='teacher_manage_answer'),
]
