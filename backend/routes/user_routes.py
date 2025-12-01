from flask import Blueprint, jsonify, request
from database import db
from models.user import User

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
    
    return jsonify({"message":"Kayıt başarılı. Giriş yapabilirsiniz.",
                    "user":{"id": user.id, "email": user.email}}), 201
    
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
    
    return jsonify({"message":"Giriş başarılı.",
                    "user":{"id": user.id, "email": user.email}}), 200

