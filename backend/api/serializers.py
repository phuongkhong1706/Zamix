from rest_framework import serializers
from .models import Item
from .models import Exam, ExamQuestion, UserInformation, Test, ExamShift, Topic, Question, Answer, Document, ExamParticipation
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
    answers = AnswerSerializer(many=True, read_only=True)
    topic_name = serializers.CharField(source='topic.name', read_only=True)
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
            'answers', 
            'image',
            'topic_id',
            'topic_name',
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
            'regrade_start_time', 'regrade_end_time', 'topics', 'is_approve'
        ]

class ExamsSerializerAdmin(serializers.ModelSerializer):
    status_display = serializers.SerializerMethodField()
    grade_display = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    topics = serializers.SerializerMethodField()
    studentCount = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()
    subject = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    def get_status_display(self, obj):
        return "approved" if obj.is_approve else "pending"

    def get_grade_display(self, obj):
        return obj.get_grade_display()  # ✔️ vì grade có IntegerChoices

    def get_full_name(self, obj):
        try:
            return UserInformation.objects.get(id=obj.user_id).full_name
        except UserInformation.DoesNotExist:
            return None

    def get_topics(self, obj):
        from .models import ExamTopic
        exam_topics = ExamTopic.objects.filter(exam=obj).select_related('topic')
        return TopicSerializer([et.topic for et in exam_topics], many=True).data

    def get_studentCount(self, obj):  # ✅ Dùng bảng exam_participation
        return ExamParticipation.objects.filter(exam=obj).values('student_id').distinct().count()


    def get_date(self, obj):
        return obj.time_start.date() if obj.time_start else None

    def get_time(self, obj):
        return obj.time_start.strftime("%H:%M") if obj.time_start else None

    def get_subject(self, obj):
        from .models import ExamTopic
        exam_topic = ExamTopic.objects.filter(exam=obj).select_related('topic').first()
        return exam_topic.topic.name if exam_topic and exam_topic.topic else "Không rõ"

    def get_description(self, obj):
        # ✔️ Không dùng get_type_display vì không có choices
        type_display = {
            'MOCK': 'Thi thử',
            'REAL': 'Thi chính thức'
        }.get(obj.type, obj.type or 'Không xác định')
        return f"Kỳ thi dành cho lớp {obj.grade}, loại: {type_display}"

    class Meta:
        model = Exam
        fields = [
            'id', 'name', 'subject', 'grade', 'grade_display',
            'date', 'time', 'status_display', 'studentCount',
            'description', 'is_approve', 'user_id',
            'time_start', 'time_end', 'regrade_start_time', 'regrade_end_time',
            'topics', 'full_name'
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
    
    # Thêm field exam_name lấy tên exam qua quan hệ exam
    exam_name = serializers.CharField(source='exam.name', read_only=True)

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
            'exam_id',
            'exam_name',
            'questions',
        ]

class DocumentSerializer(serializers.ModelSerializer):
    topic_name = serializers.SerializerMethodField()  # ✅ Thêm trường topic_name

    class Meta:
        model = Document
        fields = '__all__'  # Lấy tất cả các trường mặc định
        read_only_fields = ['topic_name']  # topic_name chỉ để đọc

    def get_topic_name(self, obj):
        # Trả về tên chủ đề nếu có
        return obj.topic.name if obj.topic else None