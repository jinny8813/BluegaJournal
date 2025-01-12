from datetime import datetime, timedelta
from enum import Enum
from typing import List, Dict, Any

class PageTypes(str, Enum):
    COVER = "cover"
    SECTION = "section"
    CHAPTER = "chapter"
    CONTENT = "content"
    BACK_COVER = "backCover"

def generate_date_range(start_date: datetime, months: int) -> List[Dict]:
    """生成月份數據"""
    monthly_data = []
    current_date = start_date
    
    for i in range(months):
        month_start = datetime(current_date.year, current_date.month, 1)
        if current_date.month == 12:
            next_month = datetime(current_date.year + 1, 1, 1)
        else:
            next_month = datetime(current_date.year, current_date.month + 1, 1)
        month_end = next_month - timedelta(days=1)
        
        monthly_data.append({
            'monthsNumber': i + 1,
            'title': month_start.strftime('%Y年%m月'),
            'dateRange': {
                'start': month_start,
                'end': month_end
            }
        })
        
        current_date = next_month
    
    return monthly_data

def generate_weeks(week_start: str, start_date: datetime, months: int) -> List[Dict]:
    """生成週次數據"""
    weekly_data = []
    current_date = start_date
    end_date = start_date + timedelta(days=months * 30)  # 概略計算
    week_number = 1
    
    while current_date < end_date:
        # 調整到週的第一天
        day_of_week = current_date.weekday()  # 0 = Monday, 6 = Sunday
        if week_start == "monday":
            days_to_start = day_of_week
        else:  # sunday
            days_to_start = (day_of_week + 1) % 7
            
        week_start_date = current_date - timedelta(days=days_to_start)
        week_end_date = week_start_date + timedelta(days=6)
        
        weekly_data.append({
            'weeksNumber': week_number,
            'title': f'第{week_number}週',
            'dateRange': {
                'start': week_start_date,
                'end': week_end_date
            }
        })
        
        week_number += 1
        current_date = week_start_date + timedelta(days=7)
    
    return weekly_data

def generate_days(start_date: datetime, months: int) -> List[Dict]:
    """生成日期數據"""
    daily_data = []
    current_date = start_date
    end_date = start_date + timedelta(days=months * 30)
    day_number = 1
    
    while current_date < end_date:
        daily_data.append({
            'daysNumber': day_number,
            'title': current_date.strftime('%Y年%m月%d日'),
            'dateRange': {
                'start': current_date,
                'end': current_date
            }
        })
        
        day_number += 1
        current_date += timedelta(days=1)
    
    return daily_data

def generate_pages(layouts: Dict, selected_layouts: List[str], 
                  start_date: datetime, duration: int, week_start: str) -> List[Dict]:
    """生成所有頁面配置"""
    pages = []
    page_number = 1
    
    # 計算結束日期
    end_date = datetime(start_date.year, start_date.month + duration, 1) - timedelta(days=1)
    
    # 添加封面
    cover_title = (f"{start_date.year} - {end_date.year}" 
                  if start_date.year != end_date.year 
                  else str(start_date.year))
    
    pages.append({
        'id': PageTypes.COVER,
        'pageNumber': page_number,
        'type': PageTypes.COVER,
        'layoutId': PageTypes.COVER,
        'title': cover_title
    })
    page_number += 1
    
    # 添加區段頁
    pages.append({
        'id': PageTypes.SECTION,
        'pageNumber': page_number,
        'type': PageTypes.SECTION,
        'layoutId': PageTypes.SECTION,
        'title': "區段"
    })
    page_number += 1
    
    # 處理內容頁面
    for layout_id in selected_layouts:
        layout = layouts['layouts'][layout_id]
        
        # 添加章節頁
        pages.append({
            'id': f"{PageTypes.CHAPTER}-{layout_id}",
            'pageNumber': page_number,
            'type': PageTypes.CHAPTER,
            'layoutId': layout_id,
            'title': "章節",
            'layout_type': layout['type']
        })
        page_number += 1
        
        # 根據布局類型生成內容頁
        if layout['type'] == 'monthly':
            for month_data in generate_date_range(start_date, duration):
                pages.append({
                    'id': f"{PageTypes.CONTENT}-{layout_id}-{month_data['monthsNumber']}",
                    'pageNumber': page_number,
                    'type': PageTypes.CONTENT,
                    'layoutId': layout_id,
                    'title': month_data['title'],
                    'dateRange': month_data['dateRange'],
                    'layout': layout
                })
                page_number += 1
                
        elif layout['type'] == 'weekly':
            for week_data in generate_weeks(week_start, start_date, duration):
                pages.append({
                    'id': f"{PageTypes.CONTENT}-{layout_id}-{week_data['weeksNumber']}",
                    'pageNumber': page_number,
                    'type': PageTypes.CONTENT,
                    'layoutId': layout_id,
                    'title': week_data['title'],
                    'dateRange': week_data['dateRange'],
                    'layout': layout
                })
                page_number += 1
                
        elif layout['type'] == 'daily':
            for day_data in generate_days(start_date, duration):
                pages.append({
                    'id': f"{PageTypes.CONTENT}-{layout_id}-{day_data['daysNumber']}",
                    'pageNumber': page_number,
                    'type': PageTypes.CONTENT,
                    'layoutId': layout_id,
                    'title': day_data['title'],
                    'dateRange': day_data['dateRange'],
                    'layout': layout
                })
                page_number += 1
    
    # 添加封底
    pages.append({
        'id': PageTypes.BACK_COVER,
        'pageNumber': page_number,
        'type': PageTypes.BACK_COVER,
        'layoutId': PageTypes.BACK_COVER,
        'title': cover_title
    })
    
    return pages