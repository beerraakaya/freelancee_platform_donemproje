from flask import Blueprint, jsonify, request, session
from auth.decarators import giris_kontrolu
from database import db
from models.job import Job
from models.profile import Profile
from models.application import Application
from decimal import Decimal, InvalidOperation


job_routes=Blueprint("job_routes", __name__,url_prefix="/api")

def profili_getir(user_id):
    return Profile.query.filter_by(user_id=user_id).first()
    


@job_routes.route("/jobs", methods=["GET"])
def list_jobs():
    jobs=Job.query.order_by(Job.created_at.desc()).all()
    return jsonify([{
        "id": j.id,
        "yayinlayan_ad": j.yayinlayan_ad,
        "yayinlayan_soyad": j.yayinlayan_soyad,
        "baslik": j.baslik,
        "aciklama": j.aciklama,
        "ucret_tutar": float(j.ucret_tutar) if j.ucret_tutar is not None else None,
        "ucret_para_birimi": j.ucret_para_birimi,
        "created_at": j.created_at.isoformat()
    }for j in jobs]),200
    
    
@job_routes.route("/jobs", methods=["POST"])
@giris_kontrolu
def create_job():
    user_id = session.get("user_id")
    data = request.get_json() or {}

    baslik = (data.get("baslik") or "").strip()
    aciklama = (data.get("aciklama") or "").strip()
    ucret_tutar = data.get("ucret_tutar", None)
    ucret_para_birimi = (data.get("ucret_para_birimi") or "").strip().upper()

    if not baslik or not aciklama:
        return jsonify({"message": "Başlık ve açıklama zorunludur."}), 400

    tutar_decimal=None
    if ucret_tutar is not None and str(ucret_tutar).strip() != "":
        try:
            tutar_decimal = Decimal(str(ucret_tutar))
            if tutar_decimal <= 0:
                return jsonify({"message": "Ücret 0'dan büyük olmalı."}), 400
        except (InvalidOperation, ValueError):
            return jsonify({"message": "Ücret tutarı geçersiz."}), 400

        if ucret_para_birimi not in ["TRY", "USD", "EUR"]:
            return jsonify({"message": "Para birimi TRY/USD/EUR olmalı."}), 400
    
    profil = profili_getir(user_id)
    ad = (profil.ad or "").strip() if profil else ""
    soyad = (profil.soyad or "").strip() if profil else ""

    if not ad or not soyad:
        return jsonify({"message": "İlan yayınlamak için önce Profilim kısmını doldurunuz."}), 400

    job = Job(
        user_id=user_id,
        yayinlayan_ad=ad,
        yayinlayan_soyad=soyad,
        baslik=baslik,
        aciklama=aciklama,
        ucret_tutar=tutar_decimal,
        ucret_para_birimi=ucret_para_birimi if tutar_decimal is not None else None
    )
    db.session.add(job)
    db.session.commit()

    return jsonify({"message": "İlan yayınlandı.", "id": job.id}), 201

@job_routes.route("/jobs/<int:job_id>/apply", methods=["POST"])
@giris_kontrolu
def apply_job(job_id):
    user_id = session.get("user_id")

    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "İlan bulunamadı."}), 404

    if job.user_id == user_id:
        return jsonify({"message": "Kendi ilanına başvuramazsın."}), 400

    existing = Application.query.filter_by(job_id=job_id, user_id=user_id).first()
    if existing:
        return jsonify({"message": "Bu ilana zaten başvurdun."}), 409

    app = Application(job_id=job_id, user_id=user_id)
    db.session.add(app)
    db.session.commit()

    return jsonify({"message": "Başvuru alındı."}), 201

@job_routes.route("/my_applications/ids", methods=["GET"])
@giris_kontrolu
def my_application_ids():
    user_id = session.get("user_id")
    ids = db.session.query(Application.job_id).filter(Application.user_id == user_id).all()
    return jsonify({"job_ids": [x[0] for x in ids]}), 200