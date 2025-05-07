from app import db
from datetime import datetime

class TranslationHistory(db.Model):
    __tablename__ = 'translation_history'
 
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow) 