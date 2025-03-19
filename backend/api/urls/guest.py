from django.urls import path
from api.views.guest.home import HomeView
from api.views.guest.contact import ContactView


urlpatterns = [
    path('home/', HomeView.as_view(), name='guest_home'),
    path('contact/', ContactView.as_view(), name='guest_contact'),
]
