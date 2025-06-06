import traceback
from datetime import timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.utils.timezone import now

from api.models import Exam, Test, Document


class StudentPracticeExamView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            # Thời điểm 30 ngày trước
            one_month_ago = now() - timedelta(days=30)

            # Lọc các kỳ thi có time_end >= one_month_ago
            exams = Exam.objects.filter(time_end__gte=one_month_ago)

            result = []

            for exam in exams:
                # Lấy các test MOCK của kỳ thi này
                mock_tests = Test.objects.filter(exam=exam, type=Test.TypeChoices.MOCK)
                test_ids = list(mock_tests.values_list('test_id', flat=True))

                # Lấy topic liên kết với exam (nhiều-nhiều)
                topics = exam.topics.all()

                topic_info = []
                for topic in topics:
                    # Xác định topic rõ ràng là từ model Topic
                    topic_id = topic.topic_id
                    topic_name = topic.name

                    # Lọc các document thuộc topic này và thuộc user hiện tại
                    user_docs = Document.objects.filter(topic=topic)
                    
                    # Trả về danh sách dict với cả doc_id và file_url
                    doc_list = [
                        {
                            "doc_id": doc.doc_id,
                            "file_url": request.build_absolute_uri(doc.file_url.url)
                        }
                        for doc in user_docs
                    ]

                    topic_info.append({
                        "topic_id": topic_id,
                        "topic_name": topic_name,
                        "list_doc": doc_list
                    })

                exam_data = {
                    "exam_id": exam.id,
                    "exam_name": exam.name,
                    "test_ids": test_ids,
                    "topics": topic_info
                }

                result.append(exam_data)

            print("✅ Dữ liệu kỳ thi và tài liệu được trả về thành công.")
            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            print("❌ Lỗi khi lấy dữ liệu kỳ thi và tài liệu:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
