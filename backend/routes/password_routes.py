from flask import Blueprint, jsonify,request,current_app
from itsdangerous import BadSignature, SignatureExpired

from models.user import User
from database import db
from services.token_service import TokenService
from services.email_service import EmailService
from extensions import mail

password_routes= Blueprint("password_routes", __name__, url_prefix="/api/password")

def token_service():
    return TokenService(current_app.config["SECRET_KEY"])

def email_service():
    return EmailService(mail)


@password_routes.route("/forgot", methods= ["POST"])
def forgot_password():
    data=request.get_json() or {}
    email= (data.get("email") or "").strip().lower()
    
    if not email:
        return jsonify({"message": "Email Zorunlu."}),400
    
    user= User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"message": "Bu email sistemde kayıtlı değil."}),404
    
    token= token_service().create_reset_token(email)
    
    reset_url= f'{current_app.config["FRONTEND_URL"]}/sifre-sifirlama?token={token}'
    email_service().send_password_reset_email(email, reset_url)
    
    return jsonify({"message": "Şifre sıfırlama linki mail adresinize gönderildi. Lütfen E-Postanızı kontrol ediniz."})


@password_routes.route("/reset", methods=["POST"])
def reset_password():
    data=request.get_json() or {}
    token= data.get("token")
    new_password= data.get("new_password")
    
    if not token or not new_password:
        return jsonify({"message": "Token ve yeni şifre zorunlu."}),400
    
    try:
        email= token_service().verify_reset_token(token, max_age_seconds=3600)
    except SignatureExpired:
        return jsonify({"message": "Linkin süresi dolmuş. Yeniden Link Alın."}),400
    except BadSignature:
        return jsonify({"message": "Geçersiz link."}), 400
    
    user= User.query.filter_by(email=email).first()
    
    if not user:
        return jsonify ({"message": "Kullanıcı bulunamadı."}),404
    
    user.set_password(new_password)
    db.session.commit()
    
    return jsonify({"message": "Şifre başarılı ile güncellendi."}),200
