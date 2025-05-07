import os
from dotenv import load_dotenv

load_dotenv()  # 加载 .env 文件

class Config:
    # 密钥配置
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-jwt-secret-key-here')
    JWT_ACCESS_TOKEN_EXPIRES = 24 * 3600

    # # 数据库配置（关键修改MySQL数据库）
    # SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:123456@localhost/arkbridge?charset=utf8mb4'
    # SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # 数据库配置（使用 SQLite）
    SQLALCHEMY_DATABASE_URI = 'sqlite:///arkbridge.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False