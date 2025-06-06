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

class TeacherDetailTestView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        try:
            print(f"🔍 GET yêu cầu chi tiết đề thi ID = {id}")

            # Xác thực người dùng
            user, error_response = get_authenticated_user(request)
            if error_response:
                print("❌ Lỗi xác thực token:", error_response.content.decode())
                return error_response

            # Lấy đề thi
            test = get_object_or_404(Test, test_id=id)

            # Kiểm tra quyền truy cập
            if not test.shift:
                return Response(
                    {"message": "Bạn không có quyền truy cập đề thi này."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Serialize đề thi + câu hỏi + đáp án
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
