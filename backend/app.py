from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()
from config import Config
from database import db
from models.user import User
from routes.user_routes import user_routes
from routes.sosyal_routes import sosyal_routes
from auth.oauth_tanimla import oauth_tanimla

app=Flask(__name__)
app.secret_key="supersecretkey"

CORS(app,  resources={r"/api/*": {"origins": "http://localhost:3000"}})
app.config.from_object(Config)

app.register_blueprint(user_routes)

app.register_blueprint(sosyal_routes)

db.init_app(app)
oauth_tanimla(app)
with app.app_context():
    db.create_all()



@app.route('/')
def home():
    return jsonify(message="Freelance platform backend'e hoşgeldin ")

if __name__=='__main__':
    app.run(debug=True)