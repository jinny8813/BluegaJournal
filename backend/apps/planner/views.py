from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import os
from django.conf import settings

@api_view(['GET'])
def get_configs(request):
    orientation = request.GET.get('orientation', 'horizontal')
    
    try:
        # 根據方向選擇不同的配置文件夾
        if orientation == "horizontal":
            folder = "size_w3h2"    
        elif orientation == "vertical":
            folder = "size_w2h3"
        else:
            return Response(
                {"error": f"Invalid orientation: {orientation}"},
                status=400
            )

        # 使用 os.path.join 確保路徑正確
        layouts_path = os.path.join(
            settings.BASE_DIR,
            '..',
            'apps',
            'planner',
            'configs',
            folder,
            'layouts.json'
        )
        contents_path = os.path.join(
            settings.BASE_DIR,
            '..',
            'apps',
            'planner',
            'configs',
            folder,
            'contents.json'
        )
        themes_path = os.path.join(
            settings.BASE_DIR,
            '..',
            'apps',
            'planner',
            'configs',
            'themes.json'
        )

        # 讀取配置文件
        with open(layouts_path, 'r', encoding='utf-8') as f:
            layouts = json.load(f)
        with open(contents_path, 'r', encoding='utf-8') as f:
            contents = json.load(f)
        with open(themes_path, 'r', encoding='utf-8') as f:
            themes = json.load(f)

        configs = {
            'layouts': layouts,
            'contents': contents,
            'themes': themes
        }
        return Response(configs)
        
    except Exception as e:
        return Response(
            {"error": f"Error loading configs: {str(e)}"},
            status=500
        )