from flask import Blueprint, request, jsonify
from app.models.user import User
from app import db
from app.utils.jwt_utils import jwt_required, get_current_user

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@jwt_required
def get_profile():
    user = get_current_user()
    return jsonify({
        'id': user.id,
        'phone': user.phone,
        'username': user.username
    })

@user_bp.route('/profile', methods=['PUT'])
@jwt_required
def update_profile():
    user = get_current_user()
    data = request.get_json()
    
    if 'username' in data:
        user.username = data['username']
        db.session.commit()
    
    return jsonify({
        'id': user.id,
        'phone': user.phone,
        'username': user.username
    }) 