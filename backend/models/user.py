from database import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=True)
    platformlar = db.Column(db.String(50), default="local")
    olusturulma_tarihi = db.Column(db.DateTime, default=datetime.utcnow)
    
    profile= db.relationship(
        "Profile",
        backref="user",
        uselist= False,
        cascade="all, delete-orphan"
    )
    
    def set_password(self, password: str):
        self.password = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        if not self.password:
            return False
        return check_password_hash(self.password, password)

