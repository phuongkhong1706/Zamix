from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from api.models import UserInformation
from django.utils.dateparse import parse_date
from rest_framework import status

class AdminUserListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.all()
        user_infos = UserInformation.objects.all()

        # Tạo dict để tra nhanh theo ID
        info_map = {info.id: info for info in user_infos}

        result = []

        for user in users:
            info = info_map.get(user.id)
            if not info:
                continue  # Bỏ qua nếu không có info khớp ID

            user_data = {
                "id": user.id,
                "username": user.username,
                "full_name": info.full_name,
                "email": user.email,
                "phone_number": info.phone,
                "user_type": info.user_type,
                "status": "active" if user.is_active else "inactive",
                "gender": "M" if info.gender == "Nam" else "F",
                "dob": info.birth_date.strftime("%Y-%m-%d") if info.birth_date else None,
                "national_id": "",  # nếu cần thì thêm vào model UserInformation
                "address": info.address,
                "created_at": user.date_joined.strftime("%Y-%m-%d"),
            }

            if info.user_type == "student":
                user_data.update({
                    "student_code": f"SV{user.id:03d}",
                    "grade": "12A1"  # giả lập
                })
            elif info.user_type == "teacher":
                user_data.update({
                    "teacher_code": f"GV{user.id:03d}",
                    "degree": "Thạc sĩ",
                    "position": "Giáo viên chủ nhiệm"
                })

            result.append(user_data)

        return Response(result)


    def post(self, request):
        data = request.data

        # Tạo user
        user = User.objects.create_user(
            username=data.get("username"),
            email=data.get("email"),
            password="123456"  # mặc định hoặc random
        )
        user.is_active = data.get("status", "active") == "active"
        user.save()

        # Tạo info
        info = UserInformation.objects.create(
            id=user.id,
            full_name=data.get("full_name", ""),
            phone=data.get("phone_number", ""),
            user_type=data.get("user_type", ""),
            gender="Nam" if data.get("gender") == "M" else "Nữ",
            birth_date=parse_date(data.get("dob")),
            address=data.get("address", "")
        )

        return Response({"message": "Tạo tài khoản thành công", "id": user.id}, status=status.HTTP_201_CREATED)

    def put(self, request, pk):
        data = request.data

        try:
            user = User.objects.get(id=pk)
            user.username = data.get("username", user.username)
            user.email = data.get("email", user.email)
            user.is_active = data.get("status", "active") == "active"
            user.save()
        except User.DoesNotExist:
            return Response({"error": "Không tìm thấy người dùng"}, status=404)

        try:
            info, _ = UserInformation.objects.get_or_create(id=pk)
            info.full_name = data.get("full_name", info.full_name)
            info.phone = data.get("phone_number", info.phone)
            info.user_type = data.get("user_type", info.user_type)
            info.gender = "Nam" if data.get("gender") == "M" else "Nữ"
            info.birth_date = parse_date(data.get("dob")) if data.get("dob") else info.birth_date
            info.address = data.get("address", info.address)
            info.save()
        except Exception as e:
            return Response({"error": str(e)}, status=400)

        return Response({"message": "Cập nhật thành công"})
    
    def delete(self, request, pk):
        try:
            # Xóa thông tin người dùng trong UserInformation (nếu có)
            info = UserInformation.objects.filter(id=pk)
            if info.exists():
                info.delete()

            # Xóa user trong bảng User
            user = User.objects.get(id=pk)
            user.delete()

            return Response({"message": "Xóa người dùng thành công"}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"error": "Không tìm thấy người dùng"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
