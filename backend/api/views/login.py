from django.contrib.auth import authenticate
from django.contrib.auth.models import User  # Bảng auth_user
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from api.models import UserInformation  # Bảng user_info

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "Vui lòng nhập đầy đủ thông tin!"}, status=status.HTTP_400_BAD_REQUEST)

    # Xác thực user trong bảng auth_user
    user = authenticate(username=email, password=password)
    if not user:
        return Response({"error": "Sai tài khoản hoặc mật khẩu!"}, status=status.HTTP_401_UNAUTHORIZED)

    # Tìm user_info theo user.id
    try:
        user_info = UserInformation.objects.get(id=user.id)
    except UserInformation.DoesNotExist:
        return Response({"error": "Không tìm thấy thông tin người dùng!"}, status=status.HTTP_404_NOT_FOUND)

    # Xác định role từ user_type
    role = {
        "sinh viên": "student",
        "giảng viên": "teacher",
        "admin": "admin"
    }.get(user_info.user_type.lower(), "user")  # Mặc định là 'user'

    return Response({
        "message": "Đăng nhập thành công!",
        "role": role,
        "email": user.email,
        "full_name": user_info.full_name,
        "birth_date": user_info.birth_date,
        "gender": user_info.gender,
        "address": user_info.address,
        "avatar": user_info.avatar,
        "phone": user_info.phone,
    }, status=status.HTTP_200_OK)
