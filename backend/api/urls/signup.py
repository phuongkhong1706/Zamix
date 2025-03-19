from django.urls import path
from api.views.signup import signup_view


urlpatterns = [
    path('signup/', signup_view, name='signup'),
]