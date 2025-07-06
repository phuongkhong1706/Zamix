from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.models import LinkReset
from django.utils import timezone

@api_view(['POST'])
def resetpassword_view(request):
    token = request.data.get('token')
    new_password = request.data.get('new_password')

    if not token or not new_password:
        return Response({"error": "Thiếu token hoặc mật khẩu mới!"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        reset_entry = LinkReset.objects.get(link=token)
    except LinkReset.DoesNotExist:
        return Response({"error": "❌ Token không hợp lệ hoặc đã hết hạn!"}, status=status.HTTP_404_NOT_FOUND)

    # Kiểm tra hạn dùng token
    if (timezone.now() - reset_entry.created_at).total_seconds() > 1800:
        reset_entry.delete()
        return Response({"error": "❌ Link đã hết hạn. Vui lòng yêu cầu lại."}, status=status.HTTP_400_BAD_REQUEST)

    # Cập nhật mật khẩu
    user = reset_entry.for_user
    user.set_password(new_password)
    user.save()

    # Xoá token sau khi dùng
    reset_entry.delete()

    return Response({"message": "✅ Mật khẩu đã được cập nhật thành công!"}, status=status.HTTP_200_OK)
