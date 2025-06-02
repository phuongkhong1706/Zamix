import traceback
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from api.models import Exam, Topic, ExamTopic
from api.serializers import ExamsSerializer
from django.utils import timezone
from api.views.auth.authhelper import get_authenticated_user
from django.shortcuts import get_object_or_404



class TeacherDetailExamView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        try:
            print(f"🔍 GET yêu cầu chi tiết kỳ thi ID = {id}")

            user, error_response = get_authenticated_user(request)
            if error_response:
                print("❌ Lỗi xác thực token:", error_response.content.decode())
                return error_response

            exam = get_object_or_404(Exam, id=id)

            if exam.user.id != user.id:
                # Trả về message theo key 'message' để frontend dễ xử lý
                return Response(
                    {"message": "Bạn không có quyền truy cập kỳ thi này."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            serialized = ExamsSerializer(exam)
            print("✅ Trả về dữ liệu kỳ thi:", serialized.data)
            return Response(serialized.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("❌ Lỗi bất ngờ trong GET:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )   
    def post(self, request):
        try:
            print("=== Bắt đầu xử lý POST ===")
            print("Headers:", dict(request.headers))
            print("Data:", request.data)

            user, error_response = get_authenticated_user(request)
            if error_response:
                print("Lỗi xác thực token:", error_response.content.decode())
                return error_response

            print("User xác thực thành công:", user, type(user))

            data = request.data.copy()
            required_fields = ["name", "grade", "type", "time_start", "time_end"]
            for field in required_fields:
                if field not in data:
                    return Response(
                        {"message": f"Thiếu trường bắt buộc: {field}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Chuyển đổi thời gian và xác định trạng thái kỳ thi
            time_start = Exam._meta.get_field("time_start").to_python(data["time_start"])
            time_end = Exam._meta.get_field("time_end").to_python(data["time_end"])

            if timezone.is_naive(time_start):
                time_start = timezone.make_aware(time_start)
            if timezone.is_naive(time_end):
                time_end = timezone.make_aware(time_end)

            current = timezone.now()
            if time_start <= current <= time_end:
                exam_status = "Đang diễn ra"
            elif current < time_start:
                exam_status = "Chưa diễn ra"
            else:
                exam_status = "Đã kết thúc"

            # Tạo đối tượng Exam
            exam = Exam.objects.create(
                name=data["name"],
                grade=int(data["grade"]),
                type=data["type"],
                time_start=time_start,
                time_end=time_end,
                status=exam_status,
                user=user
            )

            print("✅ Exam được tạo:", exam.id)

            # ✅ Nếu có topic_ids, tạo các liên kết trong bảng ExamTopic
            topic_ids = data.get("topic_ids", None)
            if topic_ids is not None:
                for topic_id in topic_ids:
                    topic = Topic.objects.filter(topic_id=topic_id).first()
                    if topic:
                        ExamTopic.objects.create(exam=exam, topic=topic)
                    else:
                        print(f"⚠️ Topic ID không tồn tại: {topic_id}")

            serialized = ExamsSerializer(exam)
            print("✅ Tạo kỳ thi và topic thành công:", serialized.data)
            return Response(serialized.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("❌ Lỗi bất ngờ xảy ra trong POST:")
            import traceback
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    def put(self, request, id):
        try:
            print(f"=== Bắt đầu xử lý PUT kỳ thi ID = {id} ===")

            user, error_response = get_authenticated_user(request)
            if error_response:
                print("Lỗi xác thực token:", error_response.content.decode())
                return error_response

            exam = get_object_or_404(Exam, id=id)

            # Kiểm tra quyền: chỉ owner mới được update
            if exam.user.id != user.id:
                return Response(
                    {"message": "Bạn không có quyền cập nhật kỳ thi này."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            data = request.data.copy()
            updatable_fields = ["name", "grade", "type", "time_start", "time_end"]

            for field in updatable_fields:
                if field in data and data[field] is not None:
                    value = data[field]

                    if field in ["time_start", "time_end"]:
                        dt = Exam._meta.get_field(field).to_python(value)
                        if timezone.is_naive(dt):
                            dt = timezone.make_aware(dt)
                        setattr(exam, field, dt)
                    elif field == "grade":
                        try:
                            setattr(exam, field, int(value))
                        except (ValueError, TypeError):
                            return Response(
                                {"message": f"Trường {field} phải là số nguyên hợp lệ."},
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                    else:
                        setattr(exam, field, value)

            # Tính lại trạng thái kỳ thi
            current = timezone.now()
            if exam.time_start <= current <= exam.time_end:
                exam.status = "Đang diễn ra"
            elif current < exam.time_start:
                exam.status = "Chưa diễn ra"
            else:
                exam.status = "Đã kết thúc"

            exam.save()

            # ✅ Cập nhật danh sách topic_ids
            topic_ids = data.get("topic_ids", None)
            if topic_ids is not None:
                # Xóa các quan hệ cũ
                ExamTopic.objects.filter(exam=exam).delete()

                # Tạo mới các quan hệ
                for topic_id in topic_ids:
                    topic = Topic.objects.filter(topic_id=topic_id).first()
                    if topic:
                        ExamTopic.objects.create(exam=exam, topic=topic)
                    else:
                        print(f"⚠️ Topic ID không tồn tại: {topic_id}")

            # Serialize và trả về
            serialized = ExamsSerializer(exam)
            print("✅ Cập nhật kỳ thi và topic thành công:", serialized.data)
            return Response(serialized.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("❌ Lỗi bất ngờ trong PUT:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request, id):
        try:
            user, error_response = get_authenticated_user(request)
            if error_response:
                return error_response
            
            exam = get_object_or_404(Exam, id=id)

            # Kiểm tra quyền: chỉ owner mới được xóa
            if exam.user.id != user.id:
                return Response(
                    {"message": "Bạn không có quyền xóa kỳ thi này."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            exam.delete()

            return Response(
                {"message": "Xóa kỳ thi thành công."},
                status=status.HTTP_204_NO_CONTENT,
            )
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )