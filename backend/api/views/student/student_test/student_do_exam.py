import traceback
import string
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime
from api.models import Test, Question, Answer, StudentAnswer, Result
from api.views.auth.authhelper import get_authenticated_user

class StudentDoTestView(APIView):
    def post(self, request):
        try:
            # Xác thực người dùng
            user, error_response = get_authenticated_user(request)
            if error_response:
                return error_response

            data = request.data
            test_id = data.get('test_id')
            answers = data.get('answers', [])
            start_time = data.get('start_time')
            end_time = data.get('end_time')

            if not test_id or not isinstance(answers, list):
                return Response(
                    {"message": "Thiếu test_id hoặc danh sách answers không hợp lệ."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            test = get_object_or_404(Test, test_id=test_id)

            # 🔥 XÓA TOÀN BỘ đáp án cũ của học sinh này cho đề thi
            StudentAnswer.objects.filter(student=user, test=test).delete()

            # ⚙️ Tạo dynamic option_map từ A-Z
            option_map = {char: idx for idx, char in enumerate(string.ascii_uppercase)}

            total_questions = 0
            correct_answers = 0

            for answer_item in answers:
                question_id = answer_item.get('question_id')
                selected_option = answer_item.get('selected_option')

                if not question_id:
                    continue

                question = get_object_or_404(Question, question_id=question_id)
                answer_list = list(Answer.objects.filter(question=question).order_by('answer_id'))
                is_correct = False

                if selected_option:
                    index = option_map.get(selected_option.upper())
                    if index is not None and index < len(answer_list):
                        answer = answer_list[index]
                        is_correct = answer.is_correct
                    else:
                        answer = None
                        print(f"⚠️ Lựa chọn '{selected_option}' không hợp lệ cho câu hỏi {question_id}")
                else:
                    answer = None

                StudentAnswer.objects.create(
                    student=user,
                    test=test,
                    question=question,
                    answer=answer,
                    is_correct=is_correct
                )

                total_questions += 1
                if is_correct:
                    correct_answers += 1

            # 🧮 Tính điểm số trên thang 10
            total_score = round((correct_answers / total_questions) * 10, 2) if total_questions > 0 else 0

            # 🕒 Parse thời gian
            parsed_start_time = parse_datetime(start_time) if start_time else None
            parsed_end_time = parse_datetime(end_time) if end_time else None

            # 📝 Cập nhật hoặc tạo mới result
            result, created = Result.objects.update_or_create(
                user=user,
                test=test,
                defaults={
                    'start_time': parsed_start_time,
                    'end_time': parsed_end_time,
                    'total_score': total_score,
                    'status': 0,  # trạng thái mặc định
                    'remarks': 'Không'
                }
            )

            return Response(
                {
                    "message": "✅ Đã lưu bài làm và kết quả thành công.",
                    "correct_answers": correct_answers,
                    "total_questions": total_questions,
                    "total_score": total_score
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            traceback.print_exc()
            return Response(
                {"message": "❌ Lỗi hệ thống.", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get(self, request):
        try:
            # Lấy user đã xác thực (nếu cần lọc theo user login)
            user, error_response = get_authenticated_user(request)
            if error_response:
                return error_response

            student_id = request.query_params.get('student_id')
            test_id = request.query_params.get('test_id')

            if not student_id or not test_id:
                return Response(
                    {"message": "Thiếu student_id hoặc test_id"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Lấy danh sách câu trả lời
            student_answers = StudentAnswer.objects.filter(
                student_id=student_id,
                test_id=test_id
            )

            total_questions = student_answers.count()
            correct_answers = student_answers.filter(is_correct=True).count()

            score_percentage = (correct_answers / total_questions) * 100 if total_questions else 0

            return Response({
                "student_id": student_id,
                "test_id": test_id,
                "correct_answers": correct_answers,
                "total_questions": total_questions,
                "score_percentage": round(score_percentage, 2),
            }, status=status.HTTP_200_OK)

        except Exception as e:
            traceback.print_exc()
            return Response({"message": "Lỗi hệ thống", "detail": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)