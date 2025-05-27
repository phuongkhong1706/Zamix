import traceback
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from api.models import Exam
from api.serializers import ExamsSerializer
from django.utils import timezone
from api.views.auth.authhelper import get_authenticated_user
from django.shortcuts import get_object_or_404



class TeacherDetailExamView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        try:
            print(f"🔍 GET yêu cầu chi tiết kỳ thi ID = {id}")

            user, error_response = get_authenticated_user(request)
            if error_response:
                print("❌ Lỗi xác thực token:", error_response.content.decode())
                return error_response

            exam = get_object_or_404(Exam, id=id)

            if exam.user.id != user.id:
                # Trả về message theo key 'message' để frontend dễ xử lý
                return Response(
                    {"message": "Bạn không có quyền truy cập kỳ thi này."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            serialized = ExamsSerializer(exam)
            print("✅ Trả về dữ liệu kỳ thi:", serialized.data)
            return Response(serialized.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("❌ Lỗi bất ngờ trong GET:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )   
    def post(self, request):
        try:
            print("=== Bắt đầu xử lý POST ===")
            print("Headers:", dict(request.headers))
            print("Data:", request.data)

            user, error_response = get_authenticated_user(request)
            if error_response:
                print("Lỗi xác thực token:", error_response.content.decode())
                return error_response

            print("User xác thực thành công:", user, type(user))

            data = request.data.copy()

            required_fields = ["name", "grade", "type", "time_start", "time_end"]
            for field in required_fields:
                if field not in data:
                    return Response({"error": f"Missing field: {field}"}, status=status.HTTP_400_BAD_REQUEST)

            time_start = data.get("time_start")
            time_end = data.get("time_end")

            print("Raw time_start:", time_start)
            print("Raw time_end:", time_end)

            start_dt = Exam._meta.get_field("time_start").to_python(time_start)
            end_dt = Exam._meta.get_field("time_end").to_python(time_end)

            if timezone.is_naive(start_dt):
                start_dt = timezone.make_aware(start_dt)
            if timezone.is_naive(end_dt):
                end_dt = timezone.make_aware(end_dt)

            current = timezone.now()

            if start_dt <= current <= end_dt:
                exam_status = "Đang diễn ra"
            elif current < start_dt:
                exam_status = "Chưa diễn ra"
            else:
                exam_status = "Đã kết thúc"

            exam = Exam.objects.create(
                name=data["name"],
                grade=int(data["grade"]),
                type=data["type"],
                time_start=start_dt,
                time_end=end_dt,
                status=exam_status,
                user=user
            )

            serialized = ExamsSerializer(exam)
            print("Tạo exam thành công:", serialized.data)
            return Response(serialized.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("❌ Lỗi bất ngờ xảy ra trong post:")
            import traceback
            traceback.print_exc()
            return Response({"error": "Internal Server Error", "detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, id):
        try:
            print(f"=== Bắt đầu xử lý PUT kỳ thi ID = {id} ===")

            user, error_response = get_authenticated_user(request)
            if error_response:
                print("Lỗi xác thực token:", error_response.content.decode())
                return error_response

            exam = get_object_or_404(Exam, id=id)

            # Kiểm tra quyền: chỉ owner mới được update
            if exam.user.id != user.id:
                return Response(
                    {"message": "Bạn không có quyền cập nhật kỳ thi này."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            data = request.data.copy()

            # Các trường có thể cập nhật
            updatable_fields = ["name", "grade", "type", "time_start", "time_end"]

            for field in updatable_fields:
                if field in data:
                    value = data[field]

                    # Bỏ qua nếu giá trị None
                    if value is None:
                        continue

                    if field in ["time_start", "time_end"]:
                        # Chuyển datetime string thành đối tượng datetime có timezone
                        dt = Exam._meta.get_field(field).to_python(value)
                        if timezone.is_naive(dt):
                            dt = timezone.make_aware(dt)
                        setattr(exam, field, dt)
                    elif field == "grade":
                        try:
                            setattr(exam, field, int(value))
                        except (ValueError, TypeError):
                            return Response(
                                {"message": f"Trường {field} phải là số nguyên hợp lệ."},
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                    else:
                        setattr(exam, field, value)

            # Tính lại trạng thái kỳ thi
            current = timezone.now()
            if exam.time_start <= current <= exam.time_end:
                exam.status = "Đang diễn ra"
            elif current < exam.time_start:
                exam.status = "Chưa diễn ra"
            else:
                exam.status = "Đã kết thúc"

            exam.save()

            serialized = ExamsSerializer(exam)
            print("Cập nhật kỳ thi thành công:", serialized.data)
            return Response(serialized.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("❌ Lỗi bất ngờ trong PUT:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
    def delete(self, request, id):
        try:
            user, error_response = get_authenticated_user(request)
            if error_response:
                return error_response
            
            exam = get_object_or_404(Exam, id=id)

            # Kiểm tra quyền: chỉ owner mới được xóa
            if exam.user.id != user.id:
                return Response(
                    {"message": "Bạn không có quyền xóa kỳ thi này."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            exam.delete()

            return Response(
                {"message": "Xóa kỳ thi thành công."},
                status=status.HTTP_204_NO_CONTENT,
            )
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )