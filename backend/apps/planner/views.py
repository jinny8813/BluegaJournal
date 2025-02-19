import logging
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
import os
from django.conf import settings
from django.http import FileResponse, JsonResponse
from .utils.pdf_generator import PlannerPDFGenerator

logger = logging.getLogger(__name__)

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
    
@api_view(['POST'])
def generate_pdf(request):
    try:
        generator = PlannerPDFGenerator()
        pdf_buffer = generator.generate(data=request.data['userSelection'])

        response = FileResponse(
            pdf_buffer,
            content_type='application/pdf',
            as_attachment=True,
            filename='planner.pdf'
        )
        
        return response
    except Exception as e:
        logger.error(f"PDF generation failed: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
def test_generate_pdf(request):
    """
    測試 PDF 生成的 GET 方法
    """
    try:
        # 測試數據
        test_data = {
            'theme': {
                'id': 'white',
                'styles': {
                    'background': '#FFFFFF',
                    'text': '#000000',
                    'gridLines': {
                        'small': {'color': '#CCCCCC', 'width': '1'},
                        'large': {'color': '#999999', 'width': '2'}
                    }
                }
            },
            'layouts': ['monthly_calendar', 'monthly_project'],
            'startDate': '2025-01-27',
            'duration': 3,
            'orientation': 'horizontal',
            'language': 'en',
            'weekStart': 'monday',
            'lunarDate': 'off',
            'holidays': 'off'
        }

        # 生成 PDF
        generator = PlannerPDFGenerator()
        pdf_buffer = generator.generate(test_data)

        # 返回 PDF 文件
        response = FileResponse(
            pdf_buffer,
            content_type='application/pdf',
            as_attachment=True,
            filename='test_planner.pdf'
        )
        
        return response

    except Exception as e:
        logger.error(f"Test PDF generation failed: {str(e)}")
        return JsonResponse({
            'error': str(e),
            'message': 'PDF generation test failed'
        }, status=500)