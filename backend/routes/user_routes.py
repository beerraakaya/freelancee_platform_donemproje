from flask import Blueprint, jsonify, request, session
from database import db
from models.user import User
from models.profile import Profile
from auth.decarators import giris_kontrolu
import os
from werkzeug.utils import secure_filename
from flask import current_app

user_routes = Blueprint('user_routes', __name__, url_prefix='/api')


@user_routes.route("/register", methods=['POST'])
def register():
    data=request.get_json() or {}
    email=data.get('email')
    password=data.get('password')
    
    if not email or not password:
        return jsonify({"message":"Email ve Şifre zorunludur"}), 400
    
    existing_user=User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message":"Bu email zaten kayıtlı. Lütfen başka bir email ile kayıt olunuz."}), 409
    
    user=User(email=email, platformlar="local")
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        "message":"Giriş başarılı.",
        "user":{"id": user.id, "email": user.email}
    }), 200
    
@user_routes.route("/login", methods=['POST'])
def login():
    data=request.get_json() or {}
    email=data.get('email')
    password=data.get('password')
    
    if not email or not password:
        return jsonify({"message":"Email ve Şifre zorunludur"}), 400
    
    user=User.query.filter_by(email=email).first()
    
    if not user or not user.check_password(password):
        return jsonify({"message":"Geçersiz email veya şifre"}), 401
    
    session['user_email'] = user.email
    session['user_id'] = user.id
    
    return jsonify({
        "message":"Giriş başarılı.",
        "user":{"id": user.id, "email": user.email}
    }), 200

@user_routes.route("/logout", methods=['POST'])
def logout():
    session.pop('user_email', None)
    session.pop('user_id', None)
    return jsonify({"message":"Çıkış başarılı.", "is_logged_in": False}), 200

@user_routes.route("/check_session", methods=['GET'])
@giris_kontrolu
def check_session():
    return jsonify({
        "is_logged_in": True,
        "user": {"id": session.get('user_id'),
                 "email": session.get('user_email')}
    }), 200
    

def profili_getir( user_id: int)-> Profile:
    profil=Profile.query.filter_by(user_id=user_id).first()
    if not profil:
        profil= Profile(user_id=user_id)
        db.session.add(profil)
        db.session.commit()
    return profil
    
@user_routes.route("/profile",methods=["GET"])
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
        "profil_resmi": profil.profil_foto,
        "cv_dosya": profil.cv_dosya,
        "cv_dosya_adi": profil.cv_dosya_adi
        
    }),200
    

@user_routes.route("/profile", methods=["PUT"])
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


@user_routes.route("/profile/cv",methods=["POST"])
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


@user_routes.route("/profile/photo", methods=["POST"])
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