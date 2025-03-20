from django.db import models

class Item(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return self.name
    
class UserInformation(models.Model):  
    id = models.BigAutoField(primary_key=True)
    full_name = models.CharField(max_length=255)
    password = models.CharField(max_length=255, null=True, blank=True)
    email = models.CharField(max_length=20, unique=True)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[("Nam", "Nam"), ("Nữ", "Nữ")])
    user_type = models.CharField(max_length=50)
    address = models.TextField()
    avatar = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "user_info"

    def __str__(self):
        return self.full_name