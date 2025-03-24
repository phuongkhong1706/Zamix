from django.db import models
from django.core.validators import MinLengthValidator #kiểm tra độ dài

class Item(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return self.name
    
class UserInformation(models.Model):  
    id = models.BigAutoField(primary_key=True)
    full_name = models.CharField(max_length=255)
    password = models.TextField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    phone=models.CharField(max_length=20, validators=[MinLengthValidator(10)])
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[("Nam", "Nam"), ("Nữ", "Nữ")])
    user_type = models.CharField(max_length=50)
    address = models.TextField(null=True, blank=True)
    avatar = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "user_info"

    def __str__(self):
        return self.full_name