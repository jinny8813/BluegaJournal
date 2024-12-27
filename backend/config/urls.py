# backend/config/urls.py
from django.contrib import admin
from django.urls import path, include
# from .views import get_services
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def get_services(request):
    """
    簡單的測試端點，返回可用的服務列表
    """
    services = [
        {
            'id': 'blog',
            'title': '部落格',
            'description': '分享最新的文章和想法',
            'path': '/blog',
        },
        {
            'id': 'planner',
            'title': '電子手帳',
            'description': '製作你的個人化手帳',
            'path': '/planner',
        },
        {
            'id': 'shop',
            'title': '商店',
            'description': '購買我們的商品',
            'path': '/shop',
        }
    ]
    return Response(services, status=status.HTTP_200_OK)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', get_services, name='get_services'),
    path('api/planner/', include('apps.planner.urls')),
]
