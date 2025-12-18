from database import db
from datetime import datetime

class Job(db.Model):
    __tablename__="jobs"
    id= db.Column(db.Integer, primary_key=True)
    
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    yayinlayan_ad = db.Column(db.String(80), nullable=False)
    yayinlayan_soyad = db.Column(db.String(80), nullable=False)

    baslik = db.Column(db.String(120), nullable=False)
    aciklama = db.Column(db.Text, nullable=False)
    ucret_tutar = db.Column(db.Numeric(10), nullable=True)  
    ucret_para_birimi = db.Column(db.String(5), nullable=True)  

    
    created_at= db.Column(db.DateTime, default=datetime.utcnow)
    
    tamamlandi= db.Column(db.Boolean, default=False, nullable=False)
    
    tamamlanma_zamani= db.Column(db.DateTime, nullable=True)
    
    guncelleme_zamani=db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
