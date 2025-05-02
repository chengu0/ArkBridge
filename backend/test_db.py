# import pymysql
# from app import create_app, db
# from app.models.user import User

# def test_pymysql_connection():
#     try:
#         # 直接使用pymysql连接
#         connection = pymysql.connect(
#             host='localhost',
#             user='root',
#             password='123456',
#             database='arkbridge'
#         )
#         cursor = connection.cursor()
#         cursor.execute("SELECT VERSION()")
#         data = cursor.fetchone()
#         print("直接使用pymysql连接成功！")
#         print(f"数据库版本: {data[0]}")
#         connection.close()
#     except Exception as e:
#         print(f"pymysql连接失败: {str(e)}")

# def test_sqlalchemy_connection():
#     try:
#         # 使用SQLAlchemy连接
#         app = create_app()
#         with app.app_context():
#             # 创建所有表
#             db.create_all()
#             print("数据库表创建成功！")
            
#             # 尝试创建一个用户来测试连接
#             user = User(phone='test_phone', username='test_user')
#             user.set_password('test_password')
#             db.session.add(user)
#             db.session.commit()
#             print("SQLAlchemy连接成功！")
#             # 清理测试数据
#             db.session.delete(user)
#             db.session.commit()
#     except Exception as e:
#         print(f"SQLAlchemy连接失败: {str(e)}")

# if __name__ == '__main__':
#     print("测试直接pymysql连接...")
#     test_pymysql_connection()
#     print("\n测试SQLAlchemy连接...")
#     test_sqlalchemy_connection() 