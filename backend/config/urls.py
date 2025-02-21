# backend/config/urls.py
from django.contrib import admin
from django.urls import path, include
from .views import get_services

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', get_services, name='get_services'),
    path('api/planner/', include('apps.planner.urls')),
    path('api/v1/member/', include('apps.member.urls')),
    # path('api/v1/admin/', include('apps.myadmin.urls')),
]
