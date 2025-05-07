from app import create_app, db
from app.models.user import User

def check_admin():
    app = create_app()
    with app.app_context():
        # 检查管理员账号
        admin = User.query.filter_by(phone='13800138000').first()
        if admin:
            print('找到管理员账号：')
            print(f'ID: {admin.id}')
            print(f'手机号: {admin.phone}')
            print(f'用户名: {admin.username}')
        else:
            print('未找到管理员账号')

if __name__ == '__main__':
    check_admin() 