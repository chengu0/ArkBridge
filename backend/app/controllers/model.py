from flask import Blueprint, request, jsonify
from app.models.model_config import ModelConfig
from app.models.history import TranslationHistory
from app import db
from app.utils.jwt_utils import jwt_required, get_current_user

model_bp = Blueprint('model', __name__)

@model_bp.route('/config', methods=['GET'])
@jwt_required
def get_config():
    user = get_current_user()
    configs = ModelConfig.query.filter_by(user_id=user.id).all()
    return jsonify([{
        'id': config.id,
        'url': config.url,
        'model_name': config.model_name,
        'api_key': config.api_key,
        'is_default': config.is_default
    } for config in configs])

@model_bp.route('/config', methods=['POST'])
@jwt_required
def create_config():
    user = get_current_user()
    data = request.get_json()
    
    config = ModelConfig(
        user_id=user.id,
        url=data.get('url'),
        model_name=data.get('model_name'),
        api_key=data.get('api_key'),
        is_default=data.get('is_default', False)
    )
    
    if config.is_default:
        # 将其他配置设置为非默认
        ModelConfig.query.filter_by(user_id=user.id, is_default=True).update({'is_default': False})
    
    db.session.add(config)
    db.session.commit()
    
    return jsonify({
        'id': config.id,
        'url': config.url,
        'model_name': config.model_name,
        'api_key': config.api_key,
        'is_default': config.is_default
    })

@model_bp.route('/history', methods=['GET'])
@jwt_required
def get_history():
    user = get_current_user()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    history = TranslationHistory.query.filter_by(user_id=user.id)\
        .order_by(TranslationHistory.created_at.desc())\
        .paginate(page=page, per_page=per_page)
    
    return jsonify({
        'items': [{
            'id': item.id,
            'content': item.content,
            'created_at': item.created_at.isoformat()
        } for item in history.items],
        'total': history.total,
        'pages': history.pages,
        'current_page': history.page
    }) 