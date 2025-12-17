from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()
from config import Config
from database import db
from models.user import User
from models.profile import Profile
from routes.user_routes import user_routes
from routes.profile_routes import profile_routes
from routes.sosyal_routes import sosyal_routes
from auth.oauth_tanimla import oauth_tanimla
from routes.job_routes import job_routes

app=Flask(__name__)
app.secret_key="supersecretkey"
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax' 
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_PATH'] = '/'

CORS(app, supports_credentials=True, origins=["http://localhost:3000","http://127.0.0.1:3000"])
app.config.from_object(Config)

app.register_blueprint(user_routes)
app.register_blueprint(profile_routes)

app.register_blueprint(sosyal_routes)
app.register_blueprint(job_routes)

BASE_DIR=os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER= os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"]= UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"]= 10 * 1024 * 1024




db.init_app(app)
oauth_tanimla(app)

with app.app_context():
    db.create_all()
@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"],filename)

@app.route('/')
def home():
    return jsonify(message="Freelance platform backend'e hoşgeldin ")

if __name__=='__main__':
    app.run(debug=True)