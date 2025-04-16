from django.db import models
from django.core.validators import MinLengthValidator
from datetime import timedelta

class Item(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return self.name

class UserInformation(models.Model):  
    id = models.BigAutoField(primary_key=True)  # ID đồng bộ với auth_user
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, validators=[MinLengthValidator(10)])
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[("Nam", "Nam"), ("Nữ", "Nữ")])
    user_type = models.CharField(max_length=50)
    address = models.TextField(null=True, blank=True)
    avatar = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "user_info"

    def __str__(self):
        return self.full_name

class Exam(models.Model):
    EXAM_TYPES = [
        ('midterm', 'Giữa kỳ'),
        ('final', 'Cuối kỳ'),
    ]

    GRADE_CHOICES = [
        (10, 'Lớp 10'),
        (11, 'Lớp 11'),
        (12, 'Lớp 12'),
    ]

    title = models.CharField(max_length=255)
    grade = models.IntegerField(choices=GRADE_CHOICES)
    type = models.CharField(max_length=10, choices=EXAM_TYPES)
    time_start = models.DateTimeField()
    time_end = models.DateTimeField()
    duration = models.IntegerField(default=3600)  # Lưu thời gian kỳ thi bằng giây (mặc định 3600 giây = 1 giờ)
    def __str__(self):
        return f"{self.title} - Lớp {self.grade}"

    @property
    def status(self):
        from django.utils.timezone import now
        current = now()
        if self.time_start <= current <= self.time_end:
            return "Kỳ thi đang diễn ra"
        elif current < self.time_start:
            return "Kỳ thi chưa bắt đầu"
        else:
            return "Kỳ thi đã kết thúc"
        
class ExamQuestion(models.Model):
    EXAM_TYPES = [
        ('midterm', 'Giữa kỳ'),
        ('final', 'Cuối kỳ'),
    ]

    GRADE_CHOICES = [
        (10, 'Lớp 10'),
        (11, 'Lớp 11'),
        (12, 'Lớp 12'),
    ]

    DIFFICULTY_LEVELS = [
        (1, 'Nhận biết'),
        (2, 'Thông hiểu'),
        (3, 'Vận dụng'),
        (4, 'Vận dụng cao'),
    ]

    id_question = models.AutoField(primary_key=True)
    exam = models.ForeignKey(Exam, related_name="questions", on_delete=models.CASCADE, null=True)  # Liên kết tới kỳ thi
    grade = models.IntegerField(choices=GRADE_CHOICES)
    question_format = models.CharField(max_length=100)  # dạng bài (VD: trắc nghiệm, điền khuyết, ...)
    type = models.CharField(max_length=10, choices=EXAM_TYPES)
    difficulty = models.IntegerField(choices=DIFFICULTY_LEVELS)
    content = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=1, choices=[('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')])

    def __str__(self):
        return f"Câu hỏi {self.id_question} - Lớp {self.grade} - {self.get_type_display()}"