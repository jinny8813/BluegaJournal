from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape
import io
import logging
from .pdf_utils import px_to_points, convert_color, register_fonts, draw_text
from .page_generator import generate_pages, PageTypes
import os
from django.conf import settings
import json
logger = logging.getLogger(__name__)

class PlannerPDFGenerator:
    def __init__(self, width=720, height=1080):
        self.width = width
        self.height = height
        self.register_fonts()

    @staticmethod
    def register_fonts():
        """註冊所需字體"""
        if not register_fonts():
            logger.warning("Font registration failed, falling back to default font")

    def create_canvas(self, buffer, orientation='vertical'):
        """創建 PDF 畫布"""
        page_size = (px_to_points(self.width), px_to_points(self.height))
        if orientation == 'horizontal':
            page_size = landscape(page_size)
        return canvas.Canvas(buffer, pagesize=page_size)

    def draw_background(self, pdf_canvas, color):
        """繪製背景"""
        pdf_canvas.setFillColor(convert_color(color))
        pdf_canvas.rect(
            px_to_points(0),
            px_to_points(0),
            px_to_points(self.width),
            px_to_points(self.height),
            fill=1
        )

    def draw_grid(self, pdf_canvas, grid_config, theme):
        """繪製網格"""
        pdf_canvas.setStrokeColor(convert_color(theme['styles']['gridLines']['small']['color']))
        pdf_canvas.setLineWidth(px_to_points(float(theme['styles']['gridLines']['small']['width'])))

        # 垂直線
        for i in range(grid_config['vertical']['count']):
            x = grid_config['vertical']['start_left'] + i * grid_config['vertical']['gap']
            pdf_canvas.line(
                px_to_points(x),
                px_to_points(grid_config['horizontal']['start_top']),
                px_to_points(x),
                px_to_points(grid_config['horizontal']['end_top'])
            )

        # 水平線
        for i in range(grid_config['horizontal']['count']):
            y = grid_config['horizontal']['start_top'] + i * grid_config['horizontal']['gap']
            pdf_canvas.line(
                px_to_points(grid_config['vertical']['start_left']),
                px_to_points(y),
                px_to_points(grid_config['vertical']['end_left']),
                px_to_points(y)
            )

    def draw_table_grid(self, pdf_canvas, table_config, theme):
        """繪製表格網格"""
        pdf_canvas.setStrokeColor(convert_color(theme['styles']['gridLines']['large']['color']))
        pdf_canvas.setLineWidth(px_to_points(float(theme['styles']['gridLines']['large']['width'])))

        # 繪製所有線條
        for lines in [table_config['vertical'], table_config['horizontal']]:
            for x1, y1, x2, y2 in lines:
                pdf_canvas.line(
                    px_to_points(x1),
                    px_to_points(y1),
                    px_to_points(x2),
                    px_to_points(y2)
                )

    def draw_page_number(self, pdf_canvas, number, theme):
        """繪製頁碼"""
        draw_text(
            pdf_canvas,
            str(number),
            self.width - 40,  # 右邊距離
            40,               # 底部距離
            font_size=10,
            color=convert_color(theme['styles']['text'])
        )

    def generate(self, selected_theme, selected_layouts, selected_start_date, selected_duration, selected_orientation,
                selected_language, selected_week_start, selected_lunar_date, selected_holidays):
        """生成完整的計劃本 PDF"""
        try:
            buffer = io.BytesIO()
            pdf_canvas = self.create_canvas(buffer, selected_orientation)

            if selected_orientation == "horizontal":
                folder = "size_w3h2"    
            elif selected_orientation == "vertical":
                folder = "size_w2h3"

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

            layouts_config = layouts
            contents_config = contents
            themes_config = themes

            # 生成所有頁面配置
            pages = generate_pages(
                layouts_config=layouts_config,
                selected_layouts=selected_layouts,
                selected_start_date=selected_start_date,
                selected_duration=selected_duration,
                selected_week_start=selected_week_start
            )

            # # 繪製每一頁
            # for page in pages:
            #     # 繪製背景
            #     self.draw_background(pdf_canvas, theme['styles']['background'])

            #     if page['type'] == PageTypes.CONTENT:
            #         # 繪製基礎網格
            #         self.draw_grid(pdf_canvas, layouts['base_grid'], theme)

            #         # 繪製表格網格
            #         if 'table_grid' in page['layout']:
            #             self.draw_table_grid(pdf_canvas, page['layout']['table_grid'], theme)

            #         # 繪製頁碼
            #         self.draw_page_number(pdf_canvas, page['pageNumber'], theme)

            #     # TODO: 根據不同頁面類型添加其他元素
            #     # if page['type'] == PageTypes.COVER:
            #     #     self.draw_cover(pdf_canvas, page, theme)
            #     # elif page['type'] == PageTypes.SECTION:
            #     #     self.draw_section(pdf_canvas, page, theme)
            #     # ...

            #     pdf_canvas.showPage()

            pdf_canvas.save()
            buffer.seek(0)
            return buffer

        except Exception as e:
            logger.error(f"PDF generation error: {str(e)}")
            raise
