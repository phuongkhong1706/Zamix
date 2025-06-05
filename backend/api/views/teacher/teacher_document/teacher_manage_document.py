from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from api.models import Document
from api.serializers import DocumentSerializer


class TeacherManageDocumentView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        grade_param = request.query_params.get("grade")
        level_param = request.query_params.get("level")
        topic_param = request.query_params.get("topic_id")

        documents = Document.objects.all()

        if grade_param:
            documents = documents.filter(grade=grade_param)

        if level_param:
            documents = documents.filter(level=level_param)

        if topic_param:
            try:
                topic_id = int(topic_param)
                documents = documents.filter(topic_id=topic_id)
            except ValueError:
                return Response({'error': f'Invalid topic_id: {topic_param}'}, status=400)

        serialized = DocumentSerializer(documents, many=True)
        return Response(serialized.data)
