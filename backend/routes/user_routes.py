from flask import Blueprint, jsonify, request, session
from database import db
from models.user import User
from auth.decarators import giris_kontrolu

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