import traceback
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.utils.timezone import now
from django.utils import timezone
from django.shortcuts import get_object_or_404

from api.models import Document, Topic
from api.serializers import DocumentSerializer  # Đảm bảo bạn đã có serializer này
from api.views.auth.authhelper import get_authenticated_user


class TeacherDetailDocumentView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        try:
            print(f"📄 Đang lấy chi tiết tài liệu với ID = {id}")

            user, error_response = get_authenticated_user(request)
            if error_response:
                print("❌ Lỗi xác thực token:", error_response.content.decode())
                return error_response

            document = get_object_or_404(Document, doc_id=id)

            # Chỉ cho phép xem nếu là chủ tài liệu
            if document.user.id != user.id:
                return Response(
                    {"message": "Bạn không có quyền xem tài liệu này."},
                    status=status.HTTP_403_FORBIDDEN
                )

            serialized = DocumentSerializer(document)
            print("✅ Trả về dữ liệu tài liệu thành công:", serialized.data)
            return Response(serialized.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("❌ Lỗi khi lấy dữ liệu tài liệu:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        try:
            print("=== Bắt đầu xử lý POST tài liệu ===")
            print("Headers:", dict(request.headers))
            print("Data:", request.data)

            user, error_response = get_authenticated_user(request)
            if error_response:
                print("❌ Lỗi xác thực token:", error_response.content.decode())
                return error_response

            data = request.data.copy()
            required_fields = ["name", "file_url"]
            for field in required_fields:
                if field not in data or not data[field]:
                    return Response(
                        {"message": f"Thiếu trường bắt buộc: {field}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            topic = None
            topic_id = data.get("topic_id")
            if topic_id:
                topic = Topic.objects.filter(topic_id=topic_id).first()
                if not topic:
                    return Response(
                        {"message": f"Không tìm thấy chủ đề với ID: {topic_id}"},
                        status=status.HTTP_404_NOT_FOUND
                    )

            document = Document.objects.create(
                name=data["name"],
                file_url=data["file_url"],
                description=data.get("description"),
                grade=data.get("grade"),
                level=data.get("level"),
                topic=topic,
                user=user
            )

            serialized = DocumentSerializer(document)
            print("✅ Tạo tài liệu thành công:", serialized.data)
            return Response(serialized.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print("❌ Lỗi trong POST tài liệu:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request, id):
        try:
            print(f"=== Bắt đầu xử lý PUT tài liệu ID = {id} ===")

            user, error_response = get_authenticated_user(request)
            if error_response:
                print("❌ Lỗi xác thực token:", error_response.content.decode())
                return error_response

            document = get_object_or_404(Document, doc_id=id)

            # Kiểm tra quyền: chỉ owner mới được update
            if document.user.id != user.id:
                return Response(
                    {"message": "Bạn không có quyền cập nhật tài liệu này."},
                    status=status.HTTP_403_FORBIDDEN
                )

            data = request.data.copy()
            updatable_fields = ["name", "file_url", "description", "grade", "level", "topic_id"]

            for field in updatable_fields:
                if field in data and data[field] is not None:
                    if field == "topic_id":
                        topic = Topic.objects.filter(topic_id=data["topic_id"]).first()
                        if not topic:
                            return Response(
                                {"message": f"Không tìm thấy chủ đề với ID: {data['topic_id']}"},
                                status=status.HTTP_404_NOT_FOUND
                            )
                        document.topic = topic
                    else:
                        setattr(document, field if field != "topic_id" else "topic", data[field])

            document.save()

            serialized = DocumentSerializer(document)
            print("✅ Cập nhật tài liệu thành công:", serialized.data)
            return Response(serialized.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("❌ Lỗi trong PUT tài liệu:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, id):
        try:
            print(f"=== Bắt đầu xử lý DELETE tài liệu ID = {id} ===")

            user, error_response = get_authenticated_user(request)
            if error_response:
                print("❌ Lỗi xác thực token:", error_response.content.decode())
                return error_response

            document = get_object_or_404(Document, doc_id=id)

            # Kiểm tra quyền: chỉ owner mới được xoá
            if document.user.id != user.id:
                return Response(
                    {"message": "Bạn không có quyền xoá tài liệu này."},
                    status=status.HTTP_403_FORBIDDEN
                )

            document.delete()
            print("✅ Xoá tài liệu thành công")
            return Response({"message": "Xoá tài liệu thành công."}, status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            print("❌ Lỗi trong DELETE tài liệu:")
            traceback.print_exc()
            return Response(
                {"message": "Internal Server Error", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )