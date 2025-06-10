from django.db import models
from django.core.validators import MinLengthValidator
from django.utils.timezone import now
from django.contrib.auth.models import User
import os

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

from django.conf import settings
from django.db import models
from django.utils.timezone import now

class Topic(models.Model):
    topic_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=False)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'topics'
        verbose_name = 'Chủ đề'
        verbose_name_plural = 'Danh sách chủ đề'


class Exam(models.Model):
    class GradeChoices(models.IntegerChoices):
        GRADE_10 = 10, 'Lớp 10'
        GRADE_11 = 11, 'Lớp 11'
        GRADE_12 = 12, 'Lớp 12'

    class StatusChoices(models.TextChoices):
        ACTIVE = 'active', 'Đang diễn ra'
        UPCOMING = 'upcoming', 'Chưa bắt đầu'
        FINISHED = 'finished', 'Đã kết thúc'

    name = models.CharField(max_length=255, null=False)
    grade = models.IntegerField(choices=GradeChoices.choices, null=False)
    type = models.CharField(max_length=50, null=False)
    time_start = models.DateTimeField(null=False)
    time_end = models.DateTimeField(null=False)
    regrade_start_time = models.DateTimeField(null=True, blank=True)  
    regrade_end_time = models.DateTimeField(null=True, blank=True)    
    status = models.CharField(max_length=20, choices=StatusChoices.choices, null=False, default='upcoming')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    topics = models.ManyToManyField('Topic', through='ExamTopic', related_name='exams')

    def __str__(self):
        return f"{self.name} - Lớp {self.grade}"

    @property
    def get_status_display_custom(self):
        current = now()
        if self.time_start <= current <= self.time_end:
            return "Kỳ thi đang diễn ra"
        elif current < self.time_start:
            return "Kỳ thi chưa bắt đầu"
        else:
            return "Kỳ thi đã kết thúc"

    class Meta:
        db_table = 'exams'

class Test(models.Model):
    class LevelChoices(models.TextChoices):
        BASIC = 'Cơ bản', 'Cơ bản'
        MEDIUM = 'Trung bình', 'Trung bình'
        HARD = 'Khó', 'Khó'

    class TypeChoices(models.TextChoices):
        MOCK = 'Thi thử', 'Thi thử'
        REAL = 'Thi chính thức', 'Thi chính thức'

    test_id = models.AutoField(primary_key=True)
    shift = models.ForeignKey('ExamShift', on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=255, null=False)
    duration_minutes = models.IntegerField(null=False)
    created_at = models.DateTimeField(default=now)
    type = models.CharField(max_length=20, choices=TypeChoices.choices, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    exam = models.ForeignKey('Exam', on_delete=models.SET_NULL, null=True, blank=True)  # ➕ Trường mới

    def __str__(self):
        return f"{self.name} - {self.get_type_display()}"

    class Meta:
        db_table = 'tests'
        verbose_name = 'Đề thi'
        verbose_name_plural = 'Danh sách đề thi'

class ExamTopic(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.exam.name} - {self.topic.name}"

    class Meta:
        db_table = 'exam_topic'
        unique_together = ('exam', 'topic')
        verbose_name = 'Kỳ thi - Chủ đề'
        verbose_name_plural = 'Danh sách kỳ thi - chủ đề'

        
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

# -------------------- DOCUMENT --------------------
def upload_to_documents(instance, filename):
    # Lưu vào thư mục documents/
    return os.path.join('documents', filename)

class Document(models.Model):
    class GradeChoices(models.TextChoices):
        GRADE_10 = '10', 'Lớp 10'
        GRADE_11 = '11', 'Lớp 11'
        GRADE_12 = '12', 'Lớp 12'

    class LevelChoices(models.TextChoices):
        BASIC = 'basic', 'Cơ bản'
        INTERMEDIATE = 'intermediate', 'Trung bình'
        ADVANCED = 'advanced', 'Khó'

    doc_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=False)
    file_url = models.FileField(upload_to=upload_to_documents, null=False)
    description = models.TextField(null=True, blank=True)
    grade = models.CharField(max_length=20, choices=GradeChoices.choices, null=True, blank=True)
    level = models.CharField(max_length=20, choices=LevelChoices.choices, null=True, blank=True)
    topic = models.ForeignKey('Topic', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(default=now)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'documents'
        verbose_name = 'Tài liệu'
        verbose_name_plural = 'Danh sách tài liệu'


# -------------------- EXAM SHIFT --------------------
class ExamShift(models.Model):
    shift_id = models.AutoField(primary_key=True)
    start_time = models.TimeField(null=True)
    end_time = models.TimeField(null=True)

    def __str__(self):
        return f"Kíp thi {self.shift_id} ({self.start_time} - {self.end_time})"

    class Meta:
        db_table = 'exam_shift'
        verbose_name = 'Kíp thi'
        verbose_name_plural = 'Danh sách kíp thi'


# -------------------- TEST --------------------
class Test(models.Model):
    class LevelChoices(models.TextChoices):
        BASIC = 'Cơ bản', 'Cơ bản'
        MEDIUM = 'Trung bình', 'Trung bình'
        HARD = 'Khó', 'Khó'

    class TypeChoices(models.TextChoices):
        MOCK = 'Thi thử', 'Thi thử'
        REAL = 'Thi thật', 'Thi thật'

    test_id = models.AutoField(primary_key=True)
    shift = models.ForeignKey('ExamShift', on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=255, null=False)
    duration_minutes = models.IntegerField(null=False)
    created_at = models.DateTimeField(default=now)
    type = models.CharField(max_length=20, choices=TypeChoices.choices, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    exam = models.ForeignKey('Exam', on_delete=models.SET_NULL, null=True, blank=True)  # ➕ Trường mới

    def __str__(self):
        return f"{self.name} - {self.get_type_display()}"

    class Meta:
        db_table = 'tests'
        verbose_name = 'Đề thi'
        verbose_name_plural = 'Danh sách đề thi'


class Question(models.Model):
    class QuestionType(models.TextChoices):
        SINGLE_CHOICE = 'single', 'Trắc nghiệm 1 đáp án'
        MULTIPLE_CHOICE = 'multiple', 'Trắc nghiệm nhiều đáp án'
        TEXT = 'text', 'Tự luận'

    question_id = models.BigAutoField(primary_key=True)
    test = models.ForeignKey('Test', on_delete=models.CASCADE)
    content = models.TextField()
    type = models.CharField(max_length=20, choices=QuestionType.choices)
    score = models.FloatField()
    level = models.IntegerField()
    is_gened_by_model = models.BooleanField(default=False)
    created_by_question = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)  # ✅ Dùng auth_user
    image = models.FileField(upload_to='image_question/', null=True, blank=True)  # ✅ Trường ảnh mới

    def __str__(self):
        return f"Câu hỏi {self.question_id} - {self.content[:50]}..."

    class Meta:
        db_table = 'questions'
        verbose_name = 'Câu hỏi'
        verbose_name_plural = 'Danh sách câu hỏi'

class Answer(models.Model):
    answer_id = models.BigAutoField(primary_key=True)
    question = models.ForeignKey('Question', on_delete=models.CASCADE, related_name='answers')
    content = models.TextField()
    is_correct = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)  # ✅ Dùng auth_user

    def __str__(self):
        return f"Đáp án {self.answer_id} - {'✔' if self.is_correct else '✘'}"

    class Meta:
        db_table = 'answers'
        verbose_name = 'Đáp án'
        verbose_name_plural = 'Danh sách đáp án'

class StudentAnswer(models.Model):
    student_answer_id = models.BigAutoField(primary_key=True)
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='student_answers')  # ✅ Dùng auth_user
    test = models.ForeignKey('Test', on_delete=models.CASCADE, related_name='student_answers')
    question = models.ForeignKey('Question', on_delete=models.CASCADE, related_name='student_answers')
    answer = models.ForeignKey(Answer, on_delete=models.SET_NULL, null=True, blank=True)
    answer_content = models.TextField(null=True, blank=True)  # ✅ Trường lưu nội dung câu trả lời
    
    is_correct = models.BooleanField(null=True, blank=True)
    
    def __str__(self):
        return f"SV: {self.student.username} - Câu {self.question_id} - Đáp án {self.answer_id} - {'✔' if self.is_correct else '✘'}"
    
    class Meta:
        db_table = 'student_answer'
        verbose_name = 'Câu trả lời của sinh viên'
        verbose_name_plural = 'Danh sách câu trả lời sinh viên'
        unique_together = ('student', 'test', 'question')
