from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class ResponseMixin:
    """統一回應格式的 Mixin"""
    @staticmethod
    def success_response(data=None, msg="success", status_code=status.HTTP_200_OK):
        return Response({
            "code": status_code,
            "msg": msg,
            "data": data
        }, status=status_code)

    @staticmethod
    def error_response(msg="error", errors=None, status_code=status.HTTP_400_BAD_REQUEST):
        response_data = {
            "code": status_code,
            "msg": msg,
        }
        if errors:
            response_data["errors"] = errors
        return Response(response_data, status=status_code)

class JWTAuthenticationMixin:
    """JWT 認證 Mixin"""
    def dispatch(self, request, *args, **kwargs):
        try:
            auth = request.headers.get('Authorization', '')
            if not auth or not auth.startswith('Bearer '):
                return self.error_response(
                    msg="未提供認證令牌",
                    status_code=status.HTTP_401_UNAUTHORIZED
                )
            
            token = auth.split(' ')[1]
            jwt_auth = JWTAuthentication()
            validated_token = jwt_auth.get_validated_token(token)
            user = jwt_auth.get_user(validated_token)
            
            if not user:
                return self.error_response(
                    msg="無效的使用者",
                    status_code=status.HTTP_401_UNAUTHORIZED
                )
                
            request.user = user
            return super().dispatch(request, *args, **kwargs)
            
        except (InvalidToken, TokenError) as e:
            return self.error_response(
                msg="無效或過期的令牌",
                errors=str(e),
                status_code=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return self.error_response(
                msg="伺服器錯誤",
                errors=str(e),
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class APIViewMixin(ResponseMixin, JWTAuthenticationMixin):
    """組合 Response 和 JWT 認證的 Mixin"""
    pass
