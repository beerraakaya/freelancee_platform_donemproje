
from functools import wraps
from flask import jsonify, session


def giris_kontrolu(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_email' not in session:
            return jsonify({"message":"Giriş yapmanız gerekiyor.", "is_logged_in":False}), 401
        return f(*args, **kwargs)
    return decorated_function

    