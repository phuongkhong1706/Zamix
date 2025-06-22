from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404
import string
import traceback

from api.models import Test, Result, StudentAnswer, Question, Answer
from api.views.auth.authhelper import get_authenticated_user


class StudentExamReviewView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, test_id):
        try:
            # Xác thực học sinh
            user, error_response = get_authenticated_user(request)
            if error_response:
                return error_response

            # Lấy kết quả của học sinh cho bài thi này
            result = get_object_or_404(Result, user=user, test__test_id=test_id)

            student_answers = StudentAnswer.objects.filter(student=user, test__test_id=test_id).select_related('question', 'answer')
            questions = Question.objects.filter(test__test_id=test_id).order_by('question_id')

            review_data = []
            num_wrong = 0

            for question in questions:
                # Lấy danh sách đáp án của câu hỏi này
                answers = list(Answer.objects.filter(question=question).order_by('answer_id'))
                # Map index sang chữ cái
                option_map = {idx: char for idx, char in enumerate(string.ascii_uppercase)}

                # Tìm đáp án đúng
                correct_answer_letter = None
                for idx, ans in enumerate(answers):
                    if ans.is_correct:
                        correct_answer_letter = option_map[idx]

                # Lấy câu trả lời của học sinh
                student_answer = student_answers.filter(question=question).first()
                student_answer_letter = None
                if student_answer and student_answer.answer:
                    student_answer_letter = option_map[answers.index(student_answer.answer)]

                if student_answer_letter != correct_answer_letter:
                    num_wrong += 1

                review_data.append(
                    {
                        "id_question": question.question_id,
                        "content": question.content,
                        "option_a": answers[0].content if len(answers) > 0 else None,
                        "option_b": answers[1].content if len(answers) > 1 else None,
                        "option_c": answers[2].content if len(answers) > 2 else None,
                        "option_d": answers[3].content if len(answers) > 3 else None,
                        "correct_answer": correct_answer_letter,
                        "student_answer": student_answer_letter,
                        "explanation": (
                            f"`{correct_answer_letter}` được chọn vì nó đúng." 
                            if correct_answer_letter else ""
                        ),
                    }
                )

            num_questions = len(questions)
            num_correct = num_questions - num_wrong

            return Response(
                {
                    "exam_name": result.test.name,
                    "start_time": result.start_time,
                    "end_time": result.end_time,
                    "total_score": result.total_score,
                    "num_questions": num_questions,
                    "num_correct": num_correct,
                    "num_wrong": num_wrong,
                    "review_data": review_data,
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            traceback.print_exc()
            return Response(
                {"message": "❌ Lỗi hệ thống.", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
