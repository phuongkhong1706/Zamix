from rest_framework import serializers
from .models import Item
from .models import Exam, ExamQuestion, UserInformation, Test, ExamShift

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
    full_name = serializers.SerializerMethodField()  # thêm dòng này

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

    class Meta:
        model = Exam
        fields = [
            'id', 'name', 'grade_display', 'type', 'status', 'status_display',
            'time_start', 'time_end', 'user_id', 'full_name'
        ]

class ExamShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamShift
        fields = ['shift_id', 'name', 'date', 'start_time', 'end_time']

class TestSerializer(serializers.ModelSerializer):
    shift = ExamShiftSerializer(read_only=True)
    shift_id = serializers.PrimaryKeyRelatedField(
        queryset=ExamShift.objects.all(), source='shift', write_only=True
    )
    exam_type = serializers.SerializerMethodField()  # 🔥 thêm trường này

    def get_exam_type(self, obj):
        try:
            return obj.shift.exam.type if obj.shift and obj.shift.exam else None
        except AttributeError:
            return None

    class Meta:
        model = Test
        fields = [
            'test_id',
            'name',
            'grade',
            'duration_minutes',
            'created_at',
            'level',
            'doc',
            'shift',
            'shift_id',
            'exam_type',  # ✅ Trường mới
        ]
