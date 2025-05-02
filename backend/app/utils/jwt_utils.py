from functools import wraps
from flask import request, jsonify, current_app, g
import jwt
from app.models.user import User

def create_token(user_id):
    return jwt.encode(
        {'user_id': user_id},
        current_app.config['JWT_SECRET_KEY'],
        algorithm='HS256'
    )

def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': '无效的认证头部'}), 401
                
        if not token:
            return jsonify({'message': '缺少认证令牌'}), 401
            
        try:
            data = jwt.decode(
                token,
                current_app.config['JWT_SECRET_KEY'],
                algorithms=['HS256']
            )
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'message': '用户不存在'}), 401
            g.current_user = current_user
        except:
            return jsonify({'message': '无效的认证令牌'}), 401
            
        return f(*args, **kwargs)
    return decorated

def get_current_user():
    return g.current_user 