from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class DoExamView(APIView):
    def get(self, request):
        data = {
            "title": "Vào thi",
            "content": "Đây là trang vào thi student"
        }
        return Response(data, status=status.HTTP_200_OK)