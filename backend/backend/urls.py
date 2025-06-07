"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from api.views.generate import generate_view

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # Đảm bảo include đúng module chính của API
    path('api/', include('api.urls.admin')),
    path('api/', include('api.urls.guest')),
    path('api/', include('api.urls.student')),
    path('api/', include('api.urls.teacher')),
    path('api/', include('api.urls.login')),
    # path('api/', include('api.urls.forgotpw')),
    # path('api/', include('api.urls.verifyOTP')),
    # path('api/', include('api.urls.resetpw')),
    path('api/', include('api.urls.signup')),
    path('api/generate/', generate_view, name='generate'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


