from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from django.http import JsonResponse

def get_authenticated_user(request):
    """
    Lấy user từ JWT token trong request headers.
    Trả về (user, None) nếu hợp lệ,
    hoặc (None, error_response) nếu lỗi.
    """
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None, JsonResponse({"error": "Thiếu token xác thực!"}, status=401)

    if not auth_header.startswith("Bearer "):
        return None, JsonResponse({"error": "Header Authorization phải có dạng 'Bearer <token>'"}, status=401)

    try:
        jwt_authenticator = JWTAuthentication()
        user_auth_tuple = jwt_authenticator.authenticate(request)  # tự động lấy token từ header

        if user_auth_tuple is None:
            # Trường hợp token không hợp lệ hoặc hết hạn
            return None, JsonResponse({"error": "Token không hợp lệ hoặc hết hạn!"}, status=401)

        user, auth_token = user_auth_tuple

        if not user.is_authenticated:
            return None, JsonResponse({"error": "User chưa xác thực!"}, status=401)

        return user, None

    except (InvalidToken, AuthenticationFailed) as e:
        return None, JsonResponse({"error": f"Token lỗi: {str(e)}"}, status=401)
    except Exception as e:
        return None, JsonResponse({"error": f"Lỗi xác thực không xác định: {str(e)}"}, status=500)
