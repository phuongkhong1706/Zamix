import json
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.conf import settings
from django.db import transaction, connection
from api.models import UserInformation

VALID_PROVINCES = {"", "Hà Nội", "TP Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Nam Định"}
UPLOAD_DIR = os.path.join(settings.MEDIA_ROOT, "avatars")

@csrf_exempt
def signup_view(request):
    if request.method == "POST":
        try:
            if not request.content_type.startswith("multipart/form-data"):
                return JsonResponse({"error": "Invalid Content-Type"}, status=400)
            
            data = request.POST
            avatar_file = request.FILES.get("avatar")

            required_fields = ["full_name", "password", "email", "birth_date", "gender", "user_type"]
            for field in required_fields:
                if field not in data:
                    return JsonResponse({"error": f"Thiếu trường bắt buộc: {field}"}, status=400)
            
            address = data["address"].strip()
            if address not in VALID_PROVINCES:
                return JsonResponse({"error": "Địa chỉ không hợp lệ. Vui lòng chọn từ danh sách."}, status=400)

            with transaction.atomic():
                # Kiểm tra nếu bảng trống thì reset AUTO_INCREMENT về 1
                if User.objects.count() == 0:
                    with connection.cursor() as cursor:
                        cursor.execute("ALTER TABLE auth_user AUTO_INCREMENT = 1;")
                        cursor.execute("ALTER TABLE user_info AUTO_INCREMENT = 1;")

                # Tạo user trong auth_user (Django quản lý auth)
                if User.objects.filter(username=data["email"]).exists():
                    return JsonResponse({"error": "Email đã tồn tại."}, status=400)

                auth_user = User.objects.create_user(
                    username=data["email"],
                    email=data["email"],
                    password=data["password"]
                )

                # Tạo user trong user_info (chỉ lưu thông tin phụ)
                user_info = UserInformation.objects.create(
                    id=auth_user.id,  # Đảm bảo ID trùng với auth_user
                    full_name=data["full_name"],
                    phone=data.get("phone"),
                    birth_date=data["birth_date"],
                    gender=data["gender"],
                    user_type=data["user_type"],
                    address=address,
                )

                # Lưu avatar nếu có
                avatar_url = None
                if avatar_file:
                    if not os.path.exists(UPLOAD_DIR):
                        os.makedirs(UPLOAD_DIR)
                    
                    file_extension = avatar_file.name.split('.')[-1]
                    avatar_filename = f"{auth_user.id}.{file_extension}"
                    file_path = os.path.join(UPLOAD_DIR, avatar_filename)

                    with open(file_path, 'wb') as destination:
                        for chunk in avatar_file.chunks():
                            destination.write(chunk)

                    avatar_url = f"/media/avatars/{avatar_filename}"
                    user_info.avatar = avatar_url
                    user_info.save()

                return JsonResponse({"message": "Đăng ký thành công!", "user_id": auth_user.id, "avatar": avatar_url}, status=201)

        except Exception as e:
            return
