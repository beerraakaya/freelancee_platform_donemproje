from flask import Blueprint, jsonify, request, session
from database import db
from models.user import User
from models.profile import Profile
from auth.decarators import giris_kontrolu
import os
from werkzeug.utils import secure_filename
from flask import current_app
profile_routes = Blueprint('profile_routes', __name__, url_prefix='/api')

def profili_getir( user_id: int)-> Profile:
    profil=Profile.query.filter_by(user_id=user_id).first()
    if not profil:
        profil= Profile(user_id=user_id)
        db.session.add(profil)
        db.session.commit()
    return profil


@profile_routes.route("/profile",methods=["GET"])
@giris_kontrolu
def get_profile():
    user_id= session.get("user_id")
    profil= profili_getir(user_id)
    
    return jsonify({
        "user_id": profil.user_id,
        "ad": profil.ad,
        "soyad": profil.soyad,
        "github": profil.github,
        "linkedin": profil.linkedin,
        "profil_foto": profil.profil_foto,
        "cv_dosya": profil.cv_dosya,
        "cv_dosya_adi": profil.cv_dosya_adi
        
    }),200
    

@profile_routes.route("/profile", methods=["PUT"])
@giris_kontrolu
def update_profile():
    user_id= session.get("user_id")
    profil=profili_getir(user_id)
    
    data= request.get_json() or {}
    profil.ad=data.get("ad")
    profil.soyad=data.get("soyad")
    profil.github=data.get("github")
    profil.linkedin=data.get("linkedin")
    
    db.session.commit()
    
    return jsonify({"message": "Profil Güncellendi."}),200


def allowed_cv(filename: str)-> bool:
    return "." in filename and filename.rsplit(".",1)[1].lower()=="pdf"


@profile_routes.route("/profile/cv",methods=["POST"])
@giris_kontrolu
def upload_cv():
    user_id=session.get("user_id")
    profil=profili_getir(user_id)
    
    if "cv" not in request.files:
            return jsonify({"message": "cv dosyası gönderilmedi."}), 400

    file = request.files["cv"]
    if file.filename == "":
        return jsonify({"message": "Dosya seçilmedi."}), 400

    if not allowed_cv(file.filename):
        return jsonify({"message": "Sadece PDF yükleyebilirsiniz."}), 400

    original_name = secure_filename(file.filename)

    user_folder = os.path.join(current_app.config["UPLOAD_FOLDER"], str(user_id))
    os.makedirs(user_folder, exist_ok=True)

    save_path = os.path.join(user_folder, "cv.pdf")
    file.save(save_path)

    profil.cv_dosya = f"/uploads/{user_id}/cv.pdf"
    profil.cv_dosya_adi = original_name
    db.session.commit()

    return jsonify({"message": "CV yüklendi.", "cv_dosya": profil.cv_dosya, "cv_dosya_adi": profil.cv_dosya_adi}), 200


def allowed_image(filename: str) -> bool:
    ext = filename.rsplit(".", 1)[-1].lower()
    return ext in ["jpg", "jpeg", "png", "webp"]


@profile_routes.route("/profile/photo", methods=["POST"])
@giris_kontrolu
def upload_photo():
    user_id = session.get("user_id")
    profil = profili_getir(user_id)

    if "photo" not in request.files:
        return jsonify({"message": "photo dosyası gönderilmedi."}), 400

    file = request.files["photo"]
    if file.filename == "":
        return jsonify({"message": "Dosya seçilmedi."}), 400

    if not allowed_image(file.filename):
        return jsonify({"message": "Sadece jpg/jpeg/png/webp yükleyebilirsiniz."}), 400

    user_folder = os.path.join(current_app.config["UPLOAD_FOLDER"], str(user_id))
    os.makedirs(user_folder, exist_ok=True)

    save_path = os.path.join(user_folder, "profile.jpg")
    file.save(save_path)

    profil.profil_foto = f"/uploads/{user_id}/profile.jpg"
    db.session.commit()

    return jsonify({"message": "Profil foto güncellendi.", "profil_foto": profil.profil_foto}), 200