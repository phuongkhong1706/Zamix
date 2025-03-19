from django.urls import path
from api.views.admin.home import HomeView
from api.views.admin.do_exam import DoExamView


urlpatterns = [
    path('home/', HomeView.as_view(), name='admin_home'),
    path('do_exam/', DoExamView.as_view(), name='admin_do_exam'),
]
