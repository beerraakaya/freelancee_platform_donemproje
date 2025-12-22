from flask import Blueprint, jsonify, request, session
from auth.decarators import giris_kontrolu, profil_dolu_kontrolu
from database import db
from models.job import Job
from models.profile import Profile
from models.application import Application
from decimal import Decimal, InvalidOperation
from datetime import datetime
from models.bildirim import Bildirim


job_routes=Blueprint("job_routes", __name__,url_prefix="/api")


    


@job_routes.route("/jobs", methods=["GET"])
@giris_kontrolu
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
        "created_at": j.created_at.isoformat(),
        "tamamlandi": j.tamamlandi
    }for j in jobs]),200
    
    
@job_routes.route("/jobs", methods=["POST"])
@giris_kontrolu
@profil_dolu_kontrolu
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
        
    profil = Profile.query.filter_by(user_id=user_id).first()
    ad = (profil.ad or "").strip() if profil else ""
    soyad = (profil.soyad or "").strip() if profil else ""
    

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
@profil_dolu_kontrolu
def apply_job(job_id):
    user_id = session.get("user_id")

    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "İlan bulunamadı."}), 404

    if job.user_id == user_id:
        return jsonify({"message": "Kendi ilanına başvuramazsın."}), 400

    existing = Application.query.filter_by(job_id=job_id, user_id=user_id).first()
    if existing:
        return jsonify({"message": "Bu ilana zaten başvurdunuz."}), 409

    app = Application(job_id=job_id, user_id=user_id)
    db.session.add(app)
    db.session.flush()
    
    
    
    profil= Profile.query.filter_by(user_id=user_id).first()
    ad=(profil.ad or "").strip() if profil else ""
    soyad=(profil.soyad or "").strip() if profil else ""
    basvuran_adi= (f"{ad} {soyad}").strip() or "Bir kullanıcı"
    mesaj = f"{basvuran_adi} '{job.baslik}' ilanınıza başvurdu."

    notif = Bildirim(
        user_id=job.user_id, 
        type="job_application",
        message=mesaj,
        ilgili_is_id=job.id,
        ilgili_application_id=app.id
    )
    db.session.add(notif)

    db.session.commit()

    return jsonify({"message": "Başvuru alındı."}), 201

@job_routes.route("/my_applications/ids", methods=["GET"])
@giris_kontrolu
def my_application_ids():
    user_id = session.get("user_id")
    ids = db.session.query(Application.job_id).filter(Application.user_id == user_id).all()
    return jsonify({"job_ids": [x[0] for x in ids]}), 200


@job_routes.route("/jobs/mine",methods=["GET"])
@giris_kontrolu
def my_jobs():
    user_id= session.get("user_id")
    status = (request.args.get("status") or "active").lower()
    q = Job.query.filter(Job.user_id==user_id)

    if status == "active":
        q = q.filter(Job.tamamlandi==False)
    elif status == "completed":
        q = q.filter(Job.tamamlandi==True)
    
    jobs= q.order_by(Job.created_at.desc()).all()
    
    return jsonify([{
        "id": j.id,
        "yayinlayan_ad": j.yayinlayan_ad,
        "yayinlayan_soyad": j.yayinlayan_soyad,
        "baslik": j.baslik,
        "aciklama": j.aciklama,
        "ucret_tutar": float(j.ucret_tutar) if j.ucret_tutar is not None else None,
        "ucret_para_birimi": j.ucret_para_birimi,
        "created_at": j.created_at.isoformat(),
        "tamamlandi": j.tamamlandi,
        "tamamlanma_zamani": j.tamamlanma_zamani.isoformat() if j.tamamlanma_zamani else None
    } for j in jobs]),200
    
@job_routes.route("/jobs/<int:job_id>/complete", methods=["PATCH"])
@giris_kontrolu
def complete_job(job_id):
    user_id = session.get("user_id")
    job = Job.query.get(job_id)

    if not job:
        return jsonify({"message": "İlan bulunamadı."}), 404
    if job.user_id != user_id:
        return jsonify({"message": "Bu ilanı tamamlama yetkin yok."}), 403
    
    job.tamamlandi=True
    job.tamamlanma_zamani = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "İlan tamamlandı olarak işaretlendi."}), 200


@job_routes.route("/jobs/<int:job_id>", methods=["PUT"])
@giris_kontrolu
def update_job(job_id):
    user_id = session.get("user_id")
    job = Job.query.get(job_id)

    if not job:
        return jsonify({"message": "İlan bulunamadı."}), 404
    if job.user_id != user_id:
        return jsonify({"message": "Bu ilanı düzenleme yetkin yok."}), 403
    if job.tamamlandi:
        return jsonify({"message": "Tamamlanan ilan düzenlenemez."}), 400

    data = request.get_json() or {}

    baslik = (data.get("baslik") or "").strip()
    aciklama = (data.get("aciklama") or "").strip()
    ucret_tutar = data.get("ucret_tutar", None)
    ucret_para_birimi = (data.get("ucret_para_birimi") or "").strip().upper()

    if not baslik or not aciklama:
        return jsonify({"message": "Başlık ve açıklama zorunludur."}), 400

    tutar_decimal = None
    if ucret_tutar is not None and str(ucret_tutar).strip() != "":
        try:
            tutar_decimal = Decimal(str(ucret_tutar))
            if tutar_decimal <= 0:
                return jsonify({"message": "Ücret 0'dan büyük olmalı."}), 400
        except (InvalidOperation, ValueError):
            return jsonify({"message": "Ücret tutarı geçersiz."}), 400

        if ucret_para_birimi not in ["TRY", "USD", "EUR"]:
            return jsonify({"message": "Para birimi TRY/USD/EUR olmalı."}), 400

    job.baslik = baslik
    job.aciklama = aciklama
    job.ucret_tutar = tutar_decimal
    job.ucret_para_birimi = ucret_para_birimi if tutar_decimal is not None else None

    db.session.commit()
    return jsonify({"message": "İlan güncellendi."}), 200

@job_routes.route("/jobs/<int:job_id>", methods=["GET"])
@giris_kontrolu
def get_my_job(job_id):
    
    user_id = session.get("user_id")
    job = Job.query.get(job_id)

    if not job:
        return jsonify({"message": "İlan bulunamadı."}), 404

    if job.user_id != user_id:
        return jsonify({"message": "Bu ilana erişim yetkin yok."}), 403

    return jsonify(job.to_dict()), 200

@job_routes.route("/applications/mine", methods=["GET"])
@giris_kontrolu
def my_applications():
    user_id=session.get("user_id")
    
    rows=(
        db.session.query(Application, Job)
        .outerjoin(Job, Application.job_id==Job.id)
        .filter(Application.user_id==user_id)
        .order_by(Application.created_at.desc())
        .all()
    )
    
    result=[]
    for app, job in rows:
        if job is None:
            result.append({
                "id": app.id,
                "job_id": app.job_id,
                "created_at": app.created_at.isoformat() if app.created_at else None,
                "job_exists": False,
                "job_closed": True,
                "job_status_text": "İlan kaldırılmış",
            })
        else:
            closed = bool(job.tamamlandi)
            result.append({
                "id": app.id,
                "job_id": job.id,
                "created_at": app.created_at.isoformat() if app.created_at else None,

                "job_exists": True,
                "baslik": job.baslik,
                "aciklama": job.aciklama,
                "ucret_tutar": float(job.ucret_tutar) if job.ucret_tutar is not None else None,
                "ucret_para_birimi": job.ucret_para_birimi,
                "yayinlayan_ad": job.yayinlayan_ad,
                "yayinlayan_soyad": job.yayinlayan_soyad,

                "job_closed": closed,
                "job_status_text": "İlan kapatılmış" if closed else "Başvuru gönderildi",
                "tamamlanma_zamani": job.tamamlanma_zamani.isoformat() if job.tamamlanma_zamani else None,    
            })    
    return jsonify(result),200


@job_routes.route("/jobs/<int:job_id>/applicants", methods=["GET"])
@giris_kontrolu
def job_applicants(job_id):
     job=Job.query.get(job_id)
     if not job:
         return jsonify({"message": "İlan Bulunamadı."}),404
     
     rows=(
         db.session.query(Application,Profile)
         .outerjoin(Profile, Profile.user_id==Application.user_id)
         .filter(Application.job_id==job_id)
         .order_by(Application.created_at.desc()).all()
     )
     
     result=[]
     for app, profil in rows:
            result.append({
            "id": app.id,
            "user_id": app.user_id,
            "created_at": app.created_at.isoformat() if app.created_at else None,
            "ad": profil.ad if profil else None,
            "soyad": profil.soyad if profil else None,
            "profil_foto": profil.profil_foto if profil else None,
        })

     return jsonify(result), 200
 
 
@job_routes.route("/jobs/<int:job_id>/applicants/<int:applicant_id>/profile", methods=["GET"])
@giris_kontrolu
def get_applicant_profile(job_id,applicant_id):
    
    job=Job.query.get(job_id)
    if not job:
        return jsonify({"message": "İlan bulunamadı."}),404
    
    app = Application.query.filter_by(job_id=job_id, user_id=applicant_id).first()
    if not app:
        return jsonify({"message": "Bu kullanıcı bu ilana başvurmamış."}), 404
    
    profil = Profile.query.filter_by(user_id=applicant_id).first()

    return jsonify({
        "user_id": applicant_id,
        "ad": profil.ad if profil else None,
        "soyad": profil.soyad if profil else None,
        "github": profil.github if profil else None,
        "linkedin": profil.linkedin if profil else None,
        "profil_foto": profil.profil_foto if profil else None,
        "cv_dosya": profil.cv_dosya if profil else None,
        "cv_dosya_adi": profil.cv_dosya_adi if profil else None,
    }), 200
 
 