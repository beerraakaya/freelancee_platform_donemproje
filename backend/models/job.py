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
    
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "yayinlayan_ad": self.yayinlayan_ad,
            "yayinlayan_soyad": self.yayinlayan_soyad,
            "baslik": self.baslik,
            "aciklama": self.aciklama,
            "ucret_tutar": float(self.ucret_tutar) if self.ucret_tutar is not None else None,
            "ucret_para_birimi": self.ucret_para_birimi,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "tamamlandi": self.tamamlandi,
            "tamamlanma_zamani": self.tamamlanma_zamani.isoformat() if self.tamamlanma_zamani else None,
            "guncelleme_zamani": self.guncelleme_zamani.isoformat() if self.guncelleme_zamani else None,
        }
    
