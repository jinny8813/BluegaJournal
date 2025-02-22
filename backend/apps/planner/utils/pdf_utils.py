from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import Color

def px_to_points(px, dpi=96):
    """將像素轉換為點"""
    return px * 72 / dpi

def convert_color(css_color):
    """將 CSS 顏色轉換為 reportlab 顏色對象"""
    if css_color.startswith('#'):
        r = int(css_color[1:3], 16) / 255
        g = int(css_color[3:5], 16) / 255
        b = int(css_color[5:7], 16) / 255
        return Color(r, g, b)
    return Color(0, 0, 0)  # 默認黑色

def register_fonts():
    """註冊字體"""
    try:
        pdfmetrics.registerFont(TTFont('NotoSansTC', 'static/fonts/NotoSansTC-Regular.ttf'))
        return True
    except Exception as e:
        print(f"Font registration error: {str(e)}")
        return False

def draw_text_center(canvas, text, x, y, font_name='Helvetica', font_size=10, color=None):
    """繪製文字"""
    canvas.setFont(font_name, font_size)

    if color:
        canvas.setFillColor(color)

    text_width = canvas.stringWidth(text, font_name, font_size)
    text_height = font_size * 0.75

    x_offset = px_to_points(x) - text_width/2
    y_offset = px_to_points(y) - text_height/2

    canvas.drawString(x_offset, y_offset, text)

def draw_text_left(canvas, text, x, y, font_name='Helvetica', font_size=10, color=None):
    """繪製文字"""
    canvas.setFont(font_name, font_size)

    if color:
        canvas.setFillColor(color)

    text_height = font_size * 0.75

    x_offset = px_to_points(x)
    y_offset = px_to_points(y) - text_height/2

    canvas.drawString(x_offset, y_offset, text)