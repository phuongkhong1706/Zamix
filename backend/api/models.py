from django.db import models
from django.core.validators import MinLengthValidator

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

    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=EXAM_TYPES)
    time_start = models.DateTimeField()
    time_end = models.DateTimeField()
    duration = models.DurationField(default=0)

    def __str__(self):
        return f"{self.title} - {self.subject}"

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