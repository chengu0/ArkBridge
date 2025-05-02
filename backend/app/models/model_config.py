from app import db
from datetime import datetime

class ModelConfig(db.Model):
    __tablename__ = 'model_configs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    is_default = db.Column(db.Boolean, default=False)
    url = db.Column(db.String(255))
    model_name = db.Column(db.String(100))
    api_key = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow) 