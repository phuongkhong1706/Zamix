from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class DoExamView(APIView):
    def get(self, request):
        data = {
            "title": "Vào thi",
            "content": "Đây là vào thi admin nè"
        }
        return Response(data, status=status.HTTP_200_OK)