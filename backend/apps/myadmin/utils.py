def get_client_ip(request):
    """獲取客戶端 IP 地址"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def get_user_agent(request):
    """獲取用戶代理"""
    return request.META.get('HTTP_USER_AGENT', '')

def mask_ip(ip):
    """遮罩 IP 地址，用於日誌顯示"""
    if not ip:
        return ''
    parts = ip.split('.')
    if len(parts) == 4:  # IPv4
        return f"{parts[0]}.{parts[1]}.***.***.***"
    return ip  # IPv6 或其他格式則返回原值