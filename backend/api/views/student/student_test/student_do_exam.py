import traceback
import string
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from api.models import Test, Question, Answer, StudentAnswer
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

            if not test_id or not isinstance(answers, list):
                return Response(
                    {"message": "Thiếu test_id hoặc danh sách answers không hợp lệ."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            test = get_object_or_404(Test, test_id=test_id)

            # 🔥 XÓA TOÀN BỘ đáp án cũ của học sinh này cho đề thi hiện tại
            StudentAnswer.objects.filter(student=user, test=test).delete()

            # ⚙️ Tạo dynamic option_map từ A-Z: {'A': 0, ..., 'Z': 25}
            option_map = {char: idx for idx, char in enumerate(string.ascii_uppercase)}

            for answer_item in answers:
                question_id = answer_item.get('question_id')
                selected_option = answer_item.get('selected_option')

                if not question_id:
                    continue  # Bỏ qua nếu thiếu question_id

                question = get_object_or_404(Question, question_id=question_id)
                answer_list = list(Answer.objects.filter(question=question).order_by('answer_id'))

                answer = None
                is_correct = False

                if selected_option:
                    index = option_map.get(selected_option.upper())
                    if index is not None and index < len(answer_list):
                        answer = answer_list[index]
                        is_correct = answer.is_correct
                    else:
                        print(f"⚠️ Lựa chọn '{selected_option}' không hợp lệ cho câu hỏi {question_id}")

                # 📝 Dù chọn hay không chọn, vẫn tạo bản ghi
                StudentAnswer.objects.create(
                    student=user,
                    test=test,
                    question=question,
                    answer=answer,
                    is_correct=is_correct
                )

            return Response({"message": "✅ Đã lưu bài làm thành công."}, status=status.HTTP_200_OK)

        except Exception as e:
            traceback.print_exc()
            return Response({
                "message": "❌ Lỗi hệ thống.",
                "detail": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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