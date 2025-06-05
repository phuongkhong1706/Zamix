import traceback
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from api.models import Test, Question, Answer, StudentAnswer
from api.views.auth.authhelper import get_authenticated_user

class StudentDoTestView(APIView):
    def post(self, request):
        try:
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

            # Map ký tự A,B,C,D thành index 0,1,2,3
            option_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3}

            for answer_item in answers:
                question_id = answer_item.get('question_id')
                selected_option = answer_item.get('selected_option')

                if not question_id or selected_option is None:
                    # Bỏ qua câu hỏi không có lựa chọn
                    continue

                question = get_object_or_404(Question, question_id=question_id)

                # Lấy tất cả đáp án cho câu hỏi theo thứ tự answer_id tăng dần (hoặc thứ tự bạn muốn)
                answer_list = list(Answer.objects.filter(question=question).order_by('answer_id'))

                # Lấy index dựa trên selected_option
                index = option_map.get(selected_option.upper())

                if index is None or index >= len(answer_list):
                    print(f"⚠️ Lựa chọn '{selected_option}' không hợp lệ cho câu hỏi {question_id}")
                    continue

                answer = answer_list[index]

                # Lấy đúng đáp án, và is_correct
                is_correct = answer.is_correct

                # Cập nhật hoặc tạo StudentAnswer
                StudentAnswer.objects.update_or_create(
                    student=user,
                    test=test,
                    question=question,
                    defaults={
                        'answer': answer,
                        'is_correct': is_correct
                    }
                )

            return Response({"message": "Đã lưu bài làm thành công."}, status=status.HTTP_200_OK)

        except Exception as e:
            traceback.print_exc()
            return Response({"message": "Lỗi hệ thống", "detail": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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