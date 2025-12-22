from database import db
from datetime import datetime

class Bildirim(db.Model):
    __tablename__="bildirim"
    
    id=db.Column(db.Integer,primary_key=True)
    
    user_id=db.Column(db.Integer, db.ForeignKey("users.id"),nullable=False)
    
    type = db.Column(db.String(50),default="job_application", nullable=False)
    message= db.Column(db.Text,nullable=False)
    
    is_read=db.Column(db.Boolean, default=False, nullable=False)
    created_at= db.Column(db.DateTime, default=datetime.utcnow)
    
    ilgili_is_id=db.Column(db.Integer, nullable=True)
    ilgili_application_id= db.Column(db.Integer,nullable=True)
    
    