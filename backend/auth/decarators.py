
from functools import wraps
from flask import jsonify, session
from models.profile import Profile


def giris_kontrolu(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_email' not in session:
            return jsonify({"message":"Giriş yapmanız gerekiyor.", "is_logged_in":False}), 401
        return f(*args, **kwargs)
    return decorated_function

    

def profil_dolu_kontrolu(f):
    @wraps(f)
    def wrapper(*args,**kwargs):
        user_id=session.get("user_id")
        if not user_id:
             return jsonify({"message": "Giriş Yapmalısınız."}),401
         
        p=Profile.query.filter_by(user_id=user_id).first()
        
        ad=(p.ad or "").strip() if p else ""
        soyad= (p.soyad or "").strip() if p else ""
        
        if not ad or not soyad:
            return jsonify ({"message": "İşlem için önce profil kısmını doldurunuz."}),400
        
        return f(*args,**kwargs)
    return wrapper


def freelancer_profil_kontrolu(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        user_id = kwargs.get("user_id")  
        p = Profile.query.filter_by(user_id=user_id).first()

        ad = (p.ad or "").strip() if p else ""
        soyad = (p.soyad or "").strip() if p else ""

        if not ad or not soyad:
            return jsonify({"message": "Freelancer profili bulunamadı."}), 404

        kwargs["profil"] = p
        return f(*args, **kwargs)

    return wrapper
