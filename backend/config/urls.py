from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    # API endpoints
    path("api/users/", include("users.urls", namespace="users")),
    path("api/", include("api.urls", namespace="api")),
]

# 開發環境添加靜態文件和媒體文件的路由
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
