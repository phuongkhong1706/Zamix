import string
import random
from django.core.mail import send_mail
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from api.models import LinkReset

def generate_token(length=48):
    """Sinh chuỗi token ngẫu nhiên gồm chữ và số."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@api_view(['POST'])
def forgotpassword_view(request):
    email = request.data.get('email')
    if not email:
        return Response({"error": "Vui lòng nhập email!"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "Email không tồn tại trong hệ thống!"}, status=status.HTTP_404_NOT_FOUND)

    # Xoá link cũ nếu có
    LinkReset.objects.filter(for_user=user).delete()

    # Tạo token và lưu
    token = generate_token()
    LinkReset.objects.create(for_user=user, link=token)

    # Tạo link reset chứa token
    reset_url = f"http://localhost:3000/resetpassword/{token}"

    # Gửi mail
    subject = "🔐 Yêu cầu đặt lại mật khẩu"
    message = (
        f"Xin chào {user.username},\n\n"
        f"Bạn vừa yêu cầu đặt lại mật khẩu. Hãy truy cập liên kết sau:\n"
        f"{reset_url}\n\n"
        f"⏳ Link có hiệu lực trong 30 phút.\n"
        f"⚠️ Nếu bạn không yêu cầu, hãy bỏ qua email này."
    )

    try:
        send_mail(subject, message, settings.EMAIL_HOST_USER, [email])
        return Response({"message": "✅ Liên kết đặt lại mật khẩu đã được gửi đến email của bạn."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": f"Lỗi khi gửi email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
