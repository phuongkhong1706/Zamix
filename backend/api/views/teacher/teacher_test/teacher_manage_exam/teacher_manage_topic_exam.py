# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from api.models import Topic
from api.serializers import TopicSerializer

class TeacherManageTopicExam(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        topics = Topic.objects.all().order_by('name')
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)
