import traceback
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404

from api.models import Test
from api.serializers import TestSerializer
from api.views.auth.authhelper import get_authenticated_user
from api.models import ExamShift  # đảm bảo Shift đã được import đúng

class StudentDetailTestView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        try:
            print(f"🔍 GET yêu cầu chi tiết đề thi ID = {id}")

            # Bỏ đoạn xác thực token thủ công dưới đây:
            # user, error_response = get_authenticated_user(request)
            # if error_response:
            #     print("❌ Lỗi xác thực token:", error_response.content.decode())
            #     return error_response

            test = get_object_or_404(Test, test_id=id)

            # Nếu bạn vẫn muốn kiểm tra quyền truy cập dựa trên thuộc tính shift
            if not test.shift:
                return Response(
                    {"message": "Bạn không có quyền truy cập đề thi này."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            serialized = TestSerializer(test)
            print("✅ Trả về dữ liệu đề thi và câu hỏi:", serialized.data)
            return Response(serialized.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("❌ Lỗi bất ngờ trong GET đề thi:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def put(self, request, id):
        try:
            print(f"✏️ PUT cập nhật đề thi ID = {id}")

            # Xác thực người dùng
            user, error_response = get_authenticated_user(request)
            if error_response:
                print("❌ Lỗi xác thực token:", error_response.content.decode())
                return error_response

            # Lấy đề thi
            test = get_object_or_404(Test, test_id=id)

            # Kiểm tra quyền cập nhật: đề thi -> ca thi -> kỳ thi -> user
            if not test.shift:
                return Response(
                    {"message": "Bạn không có quyền cập nhật đề thi này."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Dữ liệu từ request
            data = request.data
            print("📥 Dữ liệu cập nhật:", data)

            # Cập nhật thông tin đề thi
            test.name = data.get('name', test.name)
            test.type = data.get('type', test.type)
            test.duration_minutes = data.get('duration_minutes', test.duration_minutes)
            test.save()

            # Serialize và trả về
            serialized = TestSerializer(test)
            print("✅ Cập nhật thành công:", serialized.data)
            return Response(serialized.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("❌ Lỗi bất ngờ trong PUT đề thi:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request):
        try:
            print("📝 POST tạo đề thi mới")

            # Xác thực người dùng
            user, error_response = get_authenticated_user(request)
            if error_response:
                print("❌ Lỗi xác thực token:", error_response.content.decode())
                return error_response

            data = request.data
            print("📥 Dữ liệu đầu vào:", data)

            # Kiểm tra dữ liệu cần thiết
            required_fields = ['name', 'type', 'duration_minutes', 'shift_id']
            for field in required_fields:
                if field not in data:
                    return Response(
                        {"message": f"Thiếu trường bắt buộc: {field}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Kiểm tra shift tồn tại
            shift = get_object_or_404(ExamShift, shift_id=data['shift_id'])

            # Kiểm tra quyền tạo: shift -> exam -> user
            if not shift.exam or shift.exam.user.id != user.id:
                return Response(
                    {"message": "Bạn không có quyền tạo đề thi trong ca thi này."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Tạo đề thi mới
            test = Test.objects.create(
                name=data['name'],
                type=data['type'],
                duration_minutes=data['duration_minutes'],
                shift=shift,
                user=user 
            )

            serialized = TestSerializer(test)
            print("✅ Tạo đề thi thành công:", serialized.data)
            return Response(serialized.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("❌ Lỗi bất ngờ trong POST đề thi:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request, id):
        try:
            print(f"🗑️ DELETE xóa đề thi ID = {id}")

            # Xác thực người dùng
            user, error_response = get_authenticated_user(request)
            if error_response:
                print("❌ Lỗi xác thực token:", error_response.content.decode())
                return error_response

            # Lấy đề thi
            test = get_object_or_404(Test, test_id=id)

            # Kiểm tra quyền xóa: đề thi -> ca thi -> kỳ thi -> user
            if not test.shift or not test.shift.exam or test.shift.exam.user.id != user.id:
                return Response(
                    {"message": "Bạn không có quyền xóa đề thi này."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Xóa đề thi
            test.delete()
            print("✅ Đã xóa đề thi thành công.")
            return Response({"message": "Xóa đề thi thành công."}, status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            print("❌ Lỗi bất ngờ trong DELETE đề thi:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
