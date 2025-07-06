from django.urls import path
from api.views.forgotpw import forgotpassword_view


urlpatterns = [
    path('forgotpw/', forgotpassword_view, name='forgotpw'),
]