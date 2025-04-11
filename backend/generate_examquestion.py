# generate_examquestion.py
import os
import django
import random
from faker import Faker

# Khởi động Django (rất quan trọng nếu chạy ngoài shell)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  # sửa lại nếu tên project khác
django.setup()

from api.models import ExamQuestion

fake = Faker('vi_VN')

grades = [10, 11, 12]
types = ['midterm', 'final']
difficulties = [1, 2, 3, 4]
answers = ['A', 'B', 'C', 'D']
formats = ['Hàm số', 'Hình học', 'Số phức']

for _ in range(1000):
    grade = random.choice(grades)
    q_format = random.choice(formats)
    type_exam = random.choice(types)
    difficulty = random.choice(difficulties)
    content = fake.sentence(nb_words=12) + "?"
    options = [fake.sentence(nb_words=4) for _ in range(4)]
    correct = random.choice(answers)

    ExamQuestion.objects.create(
        grade=grade,
        question_format=q_format,
        type=type_exam,
        difficulty=difficulty,
        content=content,
        option_a=options[0],
        option_b=options[1],
        option_c=options[2],
        option_d=options[3],
        correct_answer=correct
    )
