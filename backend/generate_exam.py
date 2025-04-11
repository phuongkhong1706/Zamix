import os
import django
import random
from datetime import timedelta
from faker import Faker

# Nếu chạy ngoài shell
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Exam

fake = Faker('vi_VN')

grades = [10, 11, 12]
types = ['midterm', 'final']

for _ in range(5):
    grade = random.choice(grades)
    exam_type = random.choice(types)

    # Sinh ngày bắt đầu kỳ thi
    start_time = fake.date_time_between(start_date="+1d", end_date="+10d")
    end_time = start_time + timedelta(minutes=60)
    duration = timedelta(minutes=60)

    # Lấy năm học từ time_start
    year = start_time.year
    title = f"Kỳ thi {exam_type.upper()} môn Toán lớp {grade} năm học {year-1}-{year}"

    Exam.objects.create(
        title=title,
        type=exam_type,
        grade=grade,
        time_start=start_time,
        time_end=end_time,
        duration=duration
    )
