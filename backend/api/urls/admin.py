from django.urls import path
from api.views.admin.home import HomeView
from api.views.admin.do_exam import DoExamView
from api.views.admin.admin_user import AdminUserListView
from api.views.admin.admin_manage_exam import AdminManageExamView
from api.views.admin.admin_add_student_to_exam import AdminAddStudentsToExamView

urlpatterns = [
    path('admin/home/', HomeView.as_view(), name='admin_home'),
    path('admin/do_exam/', DoExamView.as_view(), name='admin_do_exam'),
    path('admin/admin_user/', AdminUserListView.as_view(), name='admin_user_list'),
    path('admin/admin_user/<int:pk>/', AdminUserListView.as_view()),
    path('admin/admin_manage_exam/', AdminManageExamView.as_view(), name='admin_manage_exam'),
    path('admin/admin_add_student_to_exam/', AdminAddStudentsToExamView.as_view(), name='admin_add_students_to_exam'),
]
