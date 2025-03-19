from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ContactView(APIView):
    def get(self, request):
        data = {
            "title": "Liên hệ",
            "content": "Đây là trang liên hệ khách!"
        }
        return Response(data, status=status.HTTP_200_OK)