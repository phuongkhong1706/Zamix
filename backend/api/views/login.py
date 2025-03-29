from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from api.models import UserInformation
from django.conf import settings

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "Vui lòng nhập đầy đủ thông tin!"}, status=status.HTTP_400_BAD_REQUEST)

    # Kiểm tra tài khoản và mật khẩu
    user = authenticate(email=email, password=password)
    if not user:
        print("DEBUG: Sai tài khoản hoặc mật khẩu!")
        return Response({"error": "Sai tài khoản hoặc mật khẩu!"}, status=status.HTTP_401_UNAUTHORIZED)

    # Kiểm tra user có trong UserInformation không
    try:
        user_info = UserInformation.objects.get(user=user)
    except UserInformation.DoesNotExist:
        print(f"DEBUG: Không tìm thấy thông tin user {email} trong UserInformation")
        return Response({"error": "Không tìm thấy thông tin user!"}, status=status.HTTP_404_NOT_FOUND)

    # Xác định role theo user_type
    user_type = user_info.user_type.lower()
    if user_type == "sinh viên":
        role = "student"
    elif user_type == "giảng viên":
        role = "teacher"
    elif user_type == "admin":
        role = "admin"
    else:
        role = "user"  # Mặc định nếu không thuộc các loại trên

    # Debug log
    print(f"DEBUG: Đăng nhập thành công! User {email}, Role: {role}")

    # Trả về thông tin đầy đủ
    return Response({
        "message": "Đăng nhập thành công!",
        "role": role,
        "email": user.email,
    }, status=status.HTTP_200_OK)
