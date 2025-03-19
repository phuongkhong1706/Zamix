from django.urls import include, path

urlpatterns = [
    path('guest/', include('api.urls.guest')),
    path('admin/', include('api.urls.admin')),
]
