from app import create_app, db
from app.models.user import User

def create_admin():
    app = create_app()
    with app.app_context():
        # 检查是否已存在管理员账号
        admin = User.query.filter_by(phone='13800138000').first()
        if admin:
            print('管理员账号已存在')
            return
            
        # 创建管理员账号
        admin = User(
            phone='13800138000',
            username='管理员'
        )
        admin.set_password('admin123')
        
        db.session.add(admin)
        db.session.commit()
        print('管理员账号创建成功')
        print('手机号: 13800138000')
        print('密码: admin123')

if __name__ == '__main__':
    create_admin() 