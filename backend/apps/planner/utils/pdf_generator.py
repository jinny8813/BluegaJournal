from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape
import io
import logging
from .pdf_utils import px_to_points, convert_color, register_fonts, draw_text
from .page_generator import generate_pages, PageTypes
import os
from pathlib import Path
from django.conf import settings
import json
    
logger = logging.getLogger(__name__)

class PlannerPDFGenerator:
    def __init__(self):
        # self.register_fonts()
        self.font_name = 'Helvetica'

    def _set_dimensions(self, orientation):
        """根據方向設置尺寸"""
        if orientation == 'horizontal':
            self.width = 1080  # 橫向寬度
            self.height = 720  # 橫向高度
        else:  # vertical
            self.width = 720   # 直向寬度
            self.height = 1080 # 直向高度

    @staticmethod
    def register_fonts():
        """註冊所需字體"""
        if not register_fonts():
            logger.warning("Font registration failed, falling back to default font")

    def create_canvas(self, buffer):
        """創建 PDF 畫布"""
        page_size = (px_to_points(self.width), px_to_points(self.height))
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
        pdf_canvas.setLineWidth(px_to_points(float(theme['styles']['gridLines']['small']['width'].replace('px', ''))))

        # 垂直線
        for i in range(grid_config['vertical']['count']):
            x = grid_config['vertical']['start_left'] + i * grid_config['vertical']['gap']
            pdf_canvas.line(
                px_to_points(x),
                px_to_points(self.height - grid_config['horizontal']['start_top']),
                px_to_points(x),
                px_to_points(self.height - grid_config['horizontal']['end_top'])
            )

        # 水平線
        for i in range(grid_config['horizontal']['count']):
            y = grid_config['horizontal']['start_top'] + i * grid_config['horizontal']['gap']
            pdf_canvas.line(
                px_to_points(grid_config['vertical']['start_left']),
                px_to_points(self.height - y),
                px_to_points(grid_config['vertical']['end_left']),
                px_to_points(self.height - y)
            )

    def draw_table_grid(self, pdf_canvas, table_config, theme):
        """繪製表格網格"""
        pdf_canvas.setStrokeColor(convert_color(theme['styles']['gridLines']['large']['color']))
        pdf_canvas.setLineWidth(px_to_points(float(theme['styles']['gridLines']['large']['width'].replace('px', ''))))

        # 繪製所有線條
        for lines in [table_config['vertical'], table_config['horizontal']]:
            for x1, y1, x2, y2 in lines:
                pdf_canvas.line(
                    px_to_points(x1),
                    px_to_points(self.height - y1),
                    px_to_points(x2),
                    px_to_points(self.height - y2)
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

    def generate(self, data):
        try:
            logger.info(f"Starting PDF generation with data: {json.dumps(data, ensure_ascii=False)}")

            self._set_dimensions(data['orientation'])

            buffer = io.BytesIO()
            pdf_canvas = self.create_canvas(buffer)
            
            # 先決定資料夾
            folder = "size_w3h2" if data['orientation'] == "horizontal" else "size_w2h3"
            logger.info(f"Orientation: {data['orientation']}, Using folder: {folder}")

            # 使用 Path 來構建路徑
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

            # 記錄文件路徑
            logger.info(f"Config paths:\nLayouts: {layouts_path}\nContents: {contents_path}\nThemes: {themes_path}")

            # 檢查文件是否存在
            for path in [layouts_path, contents_path, themes_path]:
                if not os.path.exists(path):
                    logger.error(f"Config file not found: {path}")
                    raise FileNotFoundError(f"Config file not found: {path}")

            # 讀取配置文件
            try:
                with open(layouts_path, 'r', encoding='utf-8') as f:
                    layouts = json.load(f)
                with open(contents_path, 'r', encoding='utf-8') as f:
                    contents = json.load(f)
                with open(themes_path, 'r', encoding='utf-8') as f:
                    themes = json.load(f)
                
                logger.info("Successfully loaded all config files")
            except json.JSONDecodeError as e:
                logger.error(f"JSON parsing error: {str(e)}")
                raise
            except Exception as e:
                logger.error(f"Error reading config files: {str(e)}")
                raise

            base_grid = layouts['base_grid']
            theme = themes['themes']['white']

            # 繪製網格
            for index, name in enumerate(layouts['layouts']):
                self.draw_grid(pdf_canvas, base_grid, theme)
                self.draw_table_grid(pdf_canvas, layouts['layouts'][name]['table_grid'], theme)

                for i,n in enumerate(contents['contents'][data['language']][name]['content']):
                    text = n['text']
                    style = n['style']

                    top = float(style['top'].replace('px', ''))
                    left = float(style['left'].replace('px', ''))
                    width = float(style['width'].replace('px', ''))
                    height = float(style['height'].replace('px', ''))

                    draw_text(
                        pdf_canvas,
                        text,
                        left + width/2,
                        self.height - top - height/2,
                        font_size=10,
                        font_name=self.font_name,
                        color=convert_color(theme['styles']['text']['page_contents'])
                    )

                pdf_canvas.showPage()

            # # 生成所有頁面配置
            # try:
            #     pages = generate_pages(
            #         layouts=layouts,
            #         selected_layouts=data['layouts'],
            #         start_date=data['startDate'],
            #         duration=data['duration'],
            #         week_start=data['weekStart']
            #     )
            #     logger.info(f"Generated {len(pages)} pages")
                
            #     # 記錄生成的頁面資訊
            #     for i, page in enumerate(pages):
            #         logger.debug(f"Page {i+1}: Type={page['type']}, Layout ID={page.get('layoutId', 'N/A')}")
            # except Exception as e:
            #     logger.error(f"Error generating pages: {str(e)}")
            #     raise

            # 測試代碼：生成一個簡單的測試頁面
            try:
                # 繪製測試文字
                draw_text(
                    pdf_canvas,
                    "Test PDF Generation",
                    self.width/2,
                    self.height/2,
                    font_size=16,
                    font_name=self.font_name
                )
                pdf_canvas.showPage()
                
                logger.info("Successfully generated test page")
            except Exception as e:
                logger.error(f"Error drawing test page: {str(e)}")
                raise

            pdf_canvas.save()
            buffer.seek(0)
            logger.info("PDF generation completed successfully")
            return buffer

        except Exception as e:
            logger.error(f"PDF generation error: {str(e)}", exc_info=True)
            raise
