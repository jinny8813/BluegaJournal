from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_services(request):
    services = [
        {
            'id': 'blog',
            'title': '部落格',
            'description': '(未開始)分享最新的文章和想法',
            'path': '/blog',
            'icon': 'blog'
        },
        {
            'id': 'planner',
            'title': '電子手帳',
            'description': '(開發中)製作個人化手帳',
            'path': '/planner',
            'icon': 'planner'
        },
        {
            'id': 'flashcard',
            'title': '單字閃卡',
            'description': '(開發中)單字閃卡環遊世界',
            'path': '/flashcard',
            'icon': 'flashcard'
        },
        {
            'id': 'chat',
            'title': '交流分享',
            'description': '(未開始)聊聊天吧',
            'path': '/chat',
            'icon': 'chat'
        },
        {
            'id': 'shop',
            'title': '商店',
            'description': '(未開始)探索我們的商品',
            'path': '/shop',
            'icon': 'shop'
        },
        {
            'id': 'about',
            'title': '關於我',
            'description': '(未開始)簡介與大記事',
            'path': '/about',
            'icon': 'about'
        },
    ]
    return Response(services)