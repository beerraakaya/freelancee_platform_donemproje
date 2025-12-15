from database import db
from datetime import datetime

class Profile(db.Model):
    __tablename__="profiles"
    
    id= db.Column(db.Integer, primary_key=True)
    
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)

    ad = db.Column(db.String(80), nullable=True)
    soyad = db.Column(db.String(80), nullable=True)
    github = db.Column(db.String(255), nullable=True)
    linkedin = db.Column(db.String(255), nullable=True)

    profil_foto = db.Column(db.String(255), nullable=True)  
    cv_dosya = db.Column(db.String(255), nullable=True)    
    cv_dosya_adi = db.Column(db.String(255), nullable=True)

    guncelleme_tarihi = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    