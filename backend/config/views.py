from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_services(request):
    services = [
        {
            'id': 'blog',
            'title': '部落格',
            'description': '分享最新的文章和想法',
            'path': '/blog',
            'icon': 'blog'
        },
        {
            'id': 'shop',
            'title': '商店',
            'description': '探索我們的商品',
            'path': '/shop',
            'icon': 'shop'
        },
        {
            'id': 'planner',
            'title': '電子手帳',
            'description': '製作你的個人化手帳',
            'path': '/planner',
            'icon': 'planner'
        }
    ]
    return Response(services)