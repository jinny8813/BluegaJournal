from functools import wraps
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class JWTValidationMixin:
    def validate_jwt_token(self, request):
        """驗證 JWT Token"""
        try:
            auth = request.headers.get('Authorization', '')
            if auth.startswith('Bearer '):
                token = auth.split(' ')[1]
                jwt_auth = JWTAuthentication()
                validated_token = jwt_auth.get_validated_token(token)
                user = jwt_auth.get_user(validated_token)
                return user
            return None
        except (InvalidToken, TokenError) as e:
            print(f"Token Error: {str(e)}")
            return None
        except Exception as e:
            print(f"Other Error: {str(e)}")
            return None