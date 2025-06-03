from rest_framework import serializers
from .models import Item
from .models import Exam, ExamQuestion, UserInformation, Test, ExamShift, Topic, Question, Answer
from django.contrib.auth.models import User

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = [
            'answer_id',
            'content',
            'is_correct',
            'user',
        ]

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)  # 👈 dùng related_name="answers"

    class Meta:
        model = Question
        fields = [
            'question_id',
            'content',
            'type',
            'score',
            'level',
            'is_gened_by_model',
            'created_by_question',
            'user',
            'test',
            'answers',  # 👈 thêm vào cuối cùng
        ]

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['topic_id', 'name']

class ExamQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamQuestion
        exclude = ['exam']

class ExamSerializer(serializers.ModelSerializer):
    questions = ExamQuestionSerializer(many=True, read_only=True)  # dùng related_name="questions"
    duration = serializers.SerializerMethodField()

    class Meta:
        model = Exam
        fields = [
            'id', 'title', 'grade', 'type', 'time_start', 'time_end',
            'duration', 'status', 'questions'
        ]

    def get_duration(self, obj):
        # Vì 'duration' là số giây (integer), ta trả về trực tiếp giá trị đó.
        return obj.duration if obj.duration else 0
    
class ExamsSerializer(serializers.ModelSerializer):
    status_display = serializers.SerializerMethodField()
    grade_display = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    topics = serializers.SerializerMethodField()

    def get_status_display(self, obj):
        return obj.get_status_display_custom

    def get_grade_display(self, obj):
        return f"Lớp {obj.grade}"

    def get_full_name(self, obj):
        try:
            user_info = UserInformation.objects.get(id=obj.user_id)
            return user_info.full_name
        except UserInformation.DoesNotExist:
            return None

    def get_topics(self, obj):
        from .models import ExamTopic  # tránh import vòng lặp
        exam_topics = ExamTopic.objects.filter(exam=obj).select_related('topic')
        return TopicSerializer([et.topic for et in exam_topics], many=True).data

    class Meta:
        model = Exam
        fields = [
            'id', 'name', 'grade', 'grade_display', 'type', 'status', 'status_display',
            'time_start', 'time_end', 'user_id', 'full_name',
            'regrade_start_time', 'regrade_end_time', 'topics'
        ]

class ExamShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamShift
        fields = ['shift_id', 'start_time', 'end_time']

class TestSerializer(serializers.ModelSerializer):
    shift = ExamShiftSerializer(read_only=True)
    shift_id = serializers.PrimaryKeyRelatedField(
        queryset=ExamShift.objects.all(), source='shift', write_only=True
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user'
    )
    questions = QuestionSerializer(source='question_set', many=True, read_only=True)

    class Meta:
        model = Test
        fields = [
            'test_id',
            'name',
            'duration_minutes',
            'created_at',
            'type',
            'user_id',
            'shift',
            'shift_id',
            'questions',  # 👈 thêm danh sách câu hỏi (kèm đáp án)
        ]