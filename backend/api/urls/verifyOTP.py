from django.urls import path
from api.views.verifyOTP import verify_otp

urlpatterns = [
    path('verify_otp/', verify_otp, name='verify_otp'),
]