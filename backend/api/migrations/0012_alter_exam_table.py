# Generated by Django 5.1.7 on 2025-05-25 12:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_rename_title_exam_name_remove_exam_duration_and_more'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='exam',
            table='exams',
        ),
    ]
