from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import UserInformation

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "Vui lòng nhập đầy đủ thông tin!"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=email, password=password)
    if not user:
        return Response({"error": "Sai tài khoản hoặc mật khẩu!"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        user_info = UserInformation.objects.get(id=user.id)
    except UserInformation.DoesNotExist:
        return Response({"error": "Không tìm thấy thông tin người dùng!"}, status=status.HTTP_404_NOT_FOUND)

    role = {
        "học sinh": "student",
        "giáo viên": "teacher",
        "admin": "admin"
    }.get(user_info.user_type.lower(), "user")

    # Tạo token JWT
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    return Response({
        "message": "Đăng nhập thành công!",
        "role": role,
        "user_id": user.id,
        "email": user.email,
        "full_name": user_info.full_name,
        "birth_date": user_info.birth_date,
        "gender": user_info.gender,
        "address": user_info.address,
        "avatar": user_info.avatar.url if user_info.avatar else None,
        "phone": user_info.phone,
        "token": access_token,
        "refresh_token": str(refresh)
    }, status=status.HTTP_200_OK)
