from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class HomeView(APIView):
    def get(self, request):
        data = {
            "title": "Trang chủ",
            "content": "Đây là trang chủ student"
        }
        return Response(data, status=status.HTTP_200_OK)