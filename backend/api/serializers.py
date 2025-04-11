from rest_framework import serializers
from .models import Item
from .models import Exam, ExamQuestion

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class ExamQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamQuestion
        exclude = ['exam']

class ExamSerializer(serializers.ModelSerializer):
    questions = ExamQuestionSerializer(many=True, read_only=True)  # dùng related_name="questions"

    class Meta:
        model = Exam
        fields = [
            'id', 'title', 'grade', 'type', 'time_start', 'time_end',
            'duration', 'status', 'questions'
        ]
