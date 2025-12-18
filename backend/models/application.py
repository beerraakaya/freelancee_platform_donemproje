from database import db
from datetime import datetime

class Application(db.Model):
    __tablename__ = "applications"

    id = db.Column(db.Integer, primary_key=True)

    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint("job_id", "user_id", name="uq_job_user"),
    )
    
