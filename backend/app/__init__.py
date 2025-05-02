from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # 初始化扩展
    db.init_app(app)
    CORS(app)
    
    # 添加根路由
    @app.route('/')
    def index():
        return jsonify({
            'message': 'Welcome to ArkBridge API',
            'status': 'running'
        })
    
    # 注册蓝图
    from app.controllers.auth import auth_bp
    from app.controllers.user import user_bp
    from app.controllers.model import model_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(model_bp, url_prefix='/api/model')
    
    return app 