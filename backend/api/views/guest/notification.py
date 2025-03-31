from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class NotificationView(APIView):
    def get(self, request):
        data = {
            "title": "Trang chủ",
            "content": "Đây là trang thông báo khách!"
        }
        return Response(data, status=status.HTTP_200_OK)