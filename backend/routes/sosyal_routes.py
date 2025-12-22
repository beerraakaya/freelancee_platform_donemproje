from flask import Blueprint, redirect, url_for, jsonify, session,current_app
from database import db
from models.user import User
import os
from auth.oauth_tanimla import oauth


sosyal_routes = Blueprint('sosyal_routes', __name__, url_prefix='/api/sosyal')

def frontend_login_redirect(email: str):
    base = current_app.config["FRONTEND_URL"].rstrip("/")
    return redirect(f"{base}/login?success=true&email={email}")

@sosyal_routes.route('/google')
def google_giris():
    yonlendirme_url=url_for('sosyal_routes.google_callback', _external=True)
    return oauth.google.authorize_redirect(yonlendirme_url)


@sosyal_routes.route('/google/callback')
def google_callback():
    token=oauth.google.authorize_access_token()
    userinfo= token.get('userinfo')
    if not userinfo:
        userinfo = oauth.google.parse_id_token(token)

    email = userinfo.get("email")
    if not email:
        return redirect("http://localhost:3000/login?error=no_email")
    
    user=User.query.filter_by(email=email).first()
    
    if not user:
        user=User(email=email, platformlar="google")
        db.session.add(user)
        db.session.commit()
    
    session['user_email'] = user.email
    session['user_id'] = user.id
        
    return redirect(f"http://localhost:3000/login?success=true&email={email}")


@sosyal_routes.route('/github')
def github_giris():
    yonlendirme_url=url_for('sosyal_routes.github_callback', _external=True)
    return oauth.github.authorize_redirect(yonlendirme_url)

@sosyal_routes.route('/github/callback')
def github_callback():
    token=oauth.github.authorize_access_token()
    userinfo=oauth.github.get('user').json()
    emails=oauth.github.get("user/emails").json()
    
    email=None
    for e in emails:
        if e.get("primary"):
            email=e.get("email")
            break
    
    if not email:
        return jsonify({"message":"GitHub'dan email alınamadı."}), 400
    
    user=User.query.filter_by(email=email).first()
    
    if not user:
        user=User(email=email, platformlar="github")
        db.session.add(user)
        db.session.commit()
        
    session['user_email'] = user.email
    session['user_id'] = user.id
    return redirect(f"http://localhost:3000/login?success=true&email={email}")
    

@sosyal_routes.route('/linkedin')
def linkedin_giris():
    yonlendirme_url=url_for('sosyal_routes.linkedin_callback', _external=True)
    return oauth.linkedin.authorize_redirect(yonlendirme_url)

@sosyal_routes.route('/linkedin/callback')
def linkedin_callback():
    token=oauth.linkedin.authorize_access_token()
    
    email_data=oauth.linkedin.get('emailAddress?q=members&projection=(elements*(handle~))').json()
    email=email_data["elements"][0]["handle~"]["emailAddress"]
    profile_data=oauth.linkedin.get('me?projection=(id,localizedFirstName,localizedLastName)').json()
    user=User.query.filter_by(email=email).first()
    if not user:
        user=User(email=email, platformlar="linkedin")
        db.session.add(user)
        db.session.commit()
    session['user_email'] = user.email
    session['user_id'] = user.id
    return redirect(f"http://localhost:3000/login?success=true&email={email}")