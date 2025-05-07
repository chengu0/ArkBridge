from flask import Blueprint, request, jsonify
from app.models.user import User
from app import db
from app.utils.jwt_utils import create_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not all(k in data for k in ['phone', 'password']):
        return jsonify({'message': '缺少必要参数'}), 400
        
    if User.query.filter_by(phone=data['phone']).first():
        return jsonify({'message': '手机号已注册'}), 400
        
    user = User(phone=data['phone'])
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    token = create_token(user.id)
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'phone': user.phone,
            'username': user.username
        }
    })

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not all(k in data for k in ['phone', 'password']):
        return jsonify({'message': '缺少必要参数'}), 400
        
    user = User.query.filter_by(phone=data['phone']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'message': '手机号或密码错误'}), 401
        
    token = create_token(user.id)
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'phone': user.phone,
            'username': user.username
        }
    }) 