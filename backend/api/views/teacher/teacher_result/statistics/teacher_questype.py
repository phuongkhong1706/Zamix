from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.db.models import Count, Avg, Q, FloatField, F
from django.db.models.functions import Cast

from api.models import Question, StudentAnswer, Result


class TeacherQuesTypeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Bản đồ ánh xạ loại câu hỏi -> nhãn + màu
        type_mapping = {
            'single': {'label': 'Trắc nghiệm', 'color': '#8884d8'},
            'multiple_choice': {'label': 'Trắc nghiệm', 'color': '#8884d8'},
            'essay': {'label': 'Tự luận', 'color': '#82ca9d'},
        }

        # Đếm số câu hỏi theo từng loại
        question_counts = Question.objects.values('type').annotate(count=Count('question_id'))

        # Tính điểm trung bình của các câu hỏi theo loại (từ kết quả làm bài)
        # Với mỗi câu hỏi, lấy điểm đạt được trung bình từ student_answer.is_correct hoặc điểm từ text
        score_aggregates = (
            StudentAnswer.objects
            .select_related('question')
            .values('question__type')
            .annotate(avgScore=Avg('question__score', filter=Q(is_correct=True)))
        )

        # Ghép dữ liệu
        result = []
        for q in question_counts:
            qtype = q['type']
            label_info = type_mapping.get(qtype)

            if not label_info:
                continue

            # Tìm điểm trung bình ứng với loại này
            avg_score = next((s['avgScore'] for s in score_aggregates if s['question__type'] == qtype), 0)

            # Kiểm tra xem đã có trong kết quả chưa (Trắc nghiệm gom lại cả 'single' và 'multiple')
            existing = next((item for item in result if item['type'] == label_info['label']), None)
            if existing:
                existing['count'] += q['count']
                # Trung bình cộng tổng quát hơn, hoặc giữ nguyên một cách đơn giản:
                # Có thể cải tiến sau
            else:
                result.append({
                    'type': label_info['label'],
                    'count': q['count'],
                    'avgScore': round(avg_score or 0, 1),
                    'color': label_info['color'],
                })

        return Response(result, status=status.HTTP_200_OK)