# backend/api/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import os

@api_view(['GET'])
def get_layouts(request):
    """獲取所有布局配置"""
    layouts_path = os.path.join(
            os.path.dirname(__file__),
            'configs',
            'size_w3h2',
            'layouts.json'
        )
    try:
        with open(layouts_path, 'r', encoding='utf-8') as f:
            layouts = json.load(f)
    except Exception as e:
        print(f"Error loading layouts: {e}")

    return Response(layouts)