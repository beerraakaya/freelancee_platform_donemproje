from itsdangerous import URLSafeTimedSerializer


class TokenService:
    def __init__(self, secret_key: str):
        self.serializer= URLSafeTimedSerializer(secret_key)
    
    def create_reset_token(self, email: str)-> str:
        return self.serializer.dumps(email, salt="password-reset")
    
    def verify_reset_token(self, token: str, max_age_seconds: int=3600)-> str:
        return self.serializer.loads(token, salt="password-reset", max_age=max_age_seconds)