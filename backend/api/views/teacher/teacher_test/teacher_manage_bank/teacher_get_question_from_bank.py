from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from api.models import Question, Answer
import traceback

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.db.models import Q
import traceback

from api.models import Question, Answer

class TeacherGetQuestionBankView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            topic_id = request.GET.get("topic_id")
            level = request.GET.get("level")
            quantity = int(request.GET.get("quantity"))
            test_id = request.GET.get("test_id")

            if not all([topic_id, level, quantity, test_id]):
                return Response({"error": "Thiếu dữ liệu đầu vào"}, status=status.HTTP_400_BAD_REQUEST)

            # ✅ Lấy các câu hỏi có test là null hoặc khác test_id
            all_questions = Question.objects.filter(
                topic_id=topic_id,
                level=level
            ).filter(
                Q(test__isnull=True) | ~Q(test_id=test_id)
            )

            total_available = all_questions.count()

            if total_available == 0:
                return Response({"questions": []}, status=status.HTTP_200_OK)

            limited_quantity = min(quantity, total_available)
            questions = all_questions.order_by('?')[:limited_quantity]

            result = []
            for q in questions:
                answers = Answer.objects.filter(question=q)
                topic_name = q.topic.name if q.topic else None

                result.append({
                    "question_id": q.question_id,
                    "content": q.content,
                    "type": q.type,
                    "level": q.level,
                    "score": q.score,
                    "image": q.image.url if q.image else None,
                    "is_gened_by_model": q.is_gened_by_model,
                    "created_by_question": q.created_by_question,
                    "topic_id": q.topic.topic_id if q.topic else None,
                    "topic_name": topic_name,
                    "answers": [
                        {
                            "answer_id": a.answer_id,
                            "content": a.content,
                            "is_correct": a.is_correct,
                            "user": a.user.id if a.user else None
                        } for a in answers
                    ]
                })

            return Response({"questions": result}, status=status.HTTP_200_OK)

        except Exception as e:
            traceback.print_exc()
            return Response({
                "error": "Lỗi khi lấy câu hỏi từ ngân hàng.",
                "detail": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

