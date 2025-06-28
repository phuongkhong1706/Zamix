from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from api.views.teacher.home import TeacherHomeView
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_manage_exam import TeacherManageExamView
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_detail_exam import TeacherDetailExamView
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_manage_test import TeacherManageTestView
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_detail_test import TeacherDetailTestView
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_manage_topic_exam import TeacherManageTopicExam
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_manage_question import TeacherManageQuestionView
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_manage_question_remove_img import TeacherRemoveQuestionImageView
from api.views.teacher.teacher_test.teacher_manage_exam.teacher_manage_answer import TeacherManageAnswerView
from api.views.teacher.teacher_document.teacher_manage_document import TeacherManageDocumentView
from api.views.teacher.teacher_document.teacher_detail_document import TeacherDetailDocumentView
from api.views.teacher.teacher_result.teacher_score import TeacherExamScoreView
from api.views.teacher.teacher_result.teacher_remark_exam import TeacherRemarkExamView
urlpatterns = [
    path('teacher/home/', TeacherHomeView.as_view(), name='teacher_home'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_exam/', TeacherManageExamView.as_view(), name='teacher_manage_exam'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_detail_exam/', TeacherDetailExamView.as_view(), name='teacher_detail_exam'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_detail_exam/<int:id>/', TeacherDetailExamView.as_view(), name='teacher_detail_exam_id'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_test/', TeacherManageTestView.as_view(), name='teacher_manage_test'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_test/<int:exam_id>/', TeacherManageTestView.as_view(), name='teacher_manage_test_id'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_detail_test/', TeacherDetailTestView.as_view(), name='teacher_detail_test'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_detail_test/<int:id>/', TeacherDetailTestView.as_view(), name='teacher_detail_test_id'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_topic_exam/', TeacherManageTopicExam.as_view(), name='teacher_manage_topic_exam'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_question/', TeacherManageQuestionView.as_view(), name='teacher_manage_question'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_question/<int:question_id>/', TeacherManageQuestionView.as_view(), name='teacher_manage_question'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_question/<int:question_id>/remove_image/', TeacherRemoveQuestionImageView.as_view(), name="remove_question_image"),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_answer/', TeacherManageAnswerView.as_view(), name='teacher_manage_answer'),
    path('teacher/teacher_test/teacher_manage_exam/teacher_manage_answer/<int:answer_id>/', TeacherManageAnswerView.as_view(), name='teacher_manage_answer'),
    path('teacher/teacher_document/teacher_detail_document/', TeacherDetailDocumentView.as_view(), name='teacher_detail_document'),
    path('teacher/teacher_document/teacher_detail_document/<int:id>/', TeacherDetailDocumentView.as_view(), name='teacher_detail_document_id'),
    path('teacher/teacher_document/teacher_manage_document/', TeacherManageDocumentView.as_view(), name='teacher_manage_document'),
    path('teacher/teacher_result/teacher_score/', TeacherExamScoreView.as_view(), name='teacher_exam_score'),
    path('teacher/teacher_result/teacher_remark_exam/<int:test_id>/<int:student_id>/', TeacherRemarkExamView.as_view()),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)