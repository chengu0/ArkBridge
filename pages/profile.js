import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function ProfilePage() {
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('姓名');
  const [modelType, setModelType] = useState('default'); // 'default' or 'custom'
  const [customConfig, setCustomConfig] = useState({ url: '', model: '', key: '' });
  const router = useRouter();

  useEffect(() => {
    // 检查本地token，决定是否已登录
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // 可选：从后端获取用户信息
      // 这里简单用占位
      setUsername('管理员');
    }
  }, []);

  // 输入框变化
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 登录
  const handleLogin = async () => {
    setError('');
    setSuccess('');
    if (!form.phone || !form.password) {
      setError('请填写所有信息');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/auth/login', {
        phone: form.phone,
        password: form.password
      });
      console.log('登录响应:', res.data);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setSuccess('登录成功！');
        setIsLoggedIn(true);
        setUsername(res.data.username || '管理员');
      } else {
        setError(res.data.message || '登录失败');
      }
    } catch (e) {
      console.error('登录错误:', e);
      setError(e.response?.data?.message || '登录失败，请检查网络连接');
    }
    setLoading(false);
  };

  // 注册
  const handleRegister = async () => {
    setError('');
    setSuccess('');
    if (!form.phone || !form.password) {
      setError('请填写所有信息');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/auth/register', {
        phone: form.phone,
        password: form.password
      });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setSuccess('注册成功！已自动登录');
        setIsLoggedIn(true);
        setUsername(res.data.username || '管理员');
      } else {
        setError(res.data.message || '注册失败');
      }
    } catch (e) {
      setError(e.response?.data?.message || '注册失败');
    }
    setLoading(false);
  };

  // 处理自定义输入变化
  const handleCustomChange = (e) => {
    setCustomConfig({ ...customConfig, [e.target.name]: e.target.value });
  };

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setForm({ phone: '', password: '' });
    setError('');
    setSuccess('');
  };

  return (
    <div style={{display:'flex', minHeight:'100vh', background:'#fff'}}>
      {/* 侧边栏 */}
      <div style={{
        width:200,
        background:'#f5f5f5',
        borderRight:'1px solid #eee',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        paddingTop:32
      }}>
        <img src="/code.png" alt="ArkB Logo" style={{width:80, marginBottom:32}} />
        <button
          onClick={()=>router.push('/')}
          style={{
            width:'80%',
            marginBottom:16,
            padding:'10px 0',
            borderRadius:8,
            border:'none',
            background:'#1976d2',
            color:'#fff',
            fontWeight:'bold',
            cursor:'pointer'
          }}
        >主页</button>
        <button
          onClick={()=>router.push('/history')}
          style={{
            width:'80%',
            marginBottom:16,
            padding:'10px 0',
            borderRadius:8,
            border:'none',
            background:'#1976d2',
            color:'#fff',
            fontWeight:'bold',
            cursor:'pointer'
          }}
        >历史记录</button>
        <button
          onClick={()=>router.push('/profile')}
          style={{
            width:'80%',
            marginBottom:16,
            padding:'10px 0',
            borderRadius:8,
            border:'none',
            background:'#1976d2',
            color:'#fff',
            fontWeight:'bold',
            cursor:'pointer'
          }}
        >个人中心</button>
      </div>
      {/* 主内容区 */}
      <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', marginTop:40}}>
        {!isLoggedIn ? (
          // 未登录，显示原有登录/注册表单
          <div style={{width:350, display:'flex', flexDirection:'column', gap:24}}>
            <div style={{width:120, height:120, borderRadius:'50%', background:'#ccc', display:'flex', alignItems:'center', justifyContent:'center', fontSize:64, color:'#fff', margin:'0 auto 40px auto'}}>
              <span style={{fontSize:80}}>👤</span>
            </div>
            <input
              style={{
                background:'#ccd0d2', border:'none', borderRadius:12, padding:'18px 20px',
                fontSize:20, marginBottom:0
              }}
              placeholder="手机号"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              maxLength={20}
            />
            <input
              style={{
                background:'#ccd0d2', border:'none', borderRadius:12, padding:'18px 20px',
                fontSize:20, marginBottom:0
              }}
              placeholder="密码"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              maxLength={32}
            />
            <div style={{display:'flex', gap:12, justifyContent:'center'}}>
              <button
                style={{
                  background:'#1976d2', color:'#fff', border:'none', borderRadius:8,
                  padding:'12px 24px', fontSize:18, fontWeight:'bold', cursor:'pointer',
                  flex:1
                }}
                onClick={handleLogin}
                disabled={loading}
              >{loading ? '登录中...' : '登录'}</button>
              <button
                style={{
                  background:'#fff', color:'#1976d2', border:'1px solid #1976d2', borderRadius:8,
                  padding:'12px 24px', fontSize:18, fontWeight:'bold', cursor:'pointer',
                  flex:1
                }}
                onClick={handleRegister}
                disabled={loading}
              >{loading ? '注册中...' : '注册'}</button>
            </div>
            {error && <div style={{color:'red', marginTop:8, textAlign:'center'}}>{error}</div>}
            {success && <div style={{color:'green', marginTop:8, textAlign:'center'}}>{success}</div>}
          </div>
        ) : (
          // 已登录，显示个人中心内容
          <>
            {/* 头像 */}
            <div style={{
              width:160, height:160, borderRadius:'50%', background:'#aaa',
              display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto', marginBottom:16
            }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="36" r="24" fill="#fff" />
                <rect x="18" y="60" width="64" height="28" rx="14" fill="#fff" />
              </svg>
            </div>
            {/* 姓名 */}
            <div style={{fontSize:32, fontWeight:'bold', color:'#222', marginBottom:40, textAlign:'center'}}> {username} </div>
            {/* 选择模型 */}
            <div style={{width:400, margin:'0 auto', textAlign:'left'}}>
              <div style={{fontSize:20, fontWeight:'bold', marginBottom:16}}>选择模型</div>
              <div style={{display:'flex', alignItems:'center', marginBottom:8, cursor:'pointer'}} onClick={()=>setModelType('default')}>
                <span style={{fontSize:32, marginRight:8}}>{modelType==='default' ? '☑️' : '☐'}</span>
                <span style={{fontSize:20, marginRight:16}}>默认</span>
              </div>
              <div style={{display:'flex', alignItems:'center', marginBottom:8, cursor:'pointer'}} onClick={()=>setModelType('custom')}>
                <span style={{fontSize:32, marginRight:8}}>{modelType==='custom' ? '☑️' : '☐'}</span>
                <span style={{fontSize:20, marginRight:16}}>自定义</span>
              </div>
              {/* 自定义输入框 */}
              {modelType==='custom' && (
                <div style={{marginTop:16}}>
                  <div style={{display:'flex', alignItems:'center', marginBottom:8}}>
                    <span style={{width:60}}>URL=</span>
                    <input name="url" value={customConfig.url} onChange={handleCustomChange} style={{flex:1, border:'none', borderBottom:'2px solid #ccc', fontSize:18, outline:'none', background:'transparent'}} />
                  </div>
                  <div style={{display:'flex', alignItems:'center', marginBottom:8}}>
                    <span style={{width:60}}>MODEL=</span>
                    <input name="model" value={customConfig.model} onChange={handleCustomChange} style={{flex:1, border:'none', borderBottom:'2px solid #ccc', fontSize:18, outline:'none', background:'transparent'}} />
                  </div>
                  <div style={{display:'flex', alignItems:'center', marginBottom:8}}>
                    <span style={{width:60}}>KEY=</span>
                    <input name="key" value={customConfig.key} onChange={handleCustomChange} style={{flex:1, border:'none', borderBottom:'2px solid #ccc', fontSize:18, outline:'none', background:'transparent'}} />
                  </div>
                </div>
              )}
              {/* 退出按钮始终显示 */}
              <button
                onClick={handleLogout}
                style={{
                  marginTop:32,
                  width:'100%',
                  background:'#e53935',
                  color:'#fff',
                  border:'none',
                  borderRadius:8,
                  padding:'12px 0',
                  fontSize:18,
                  fontWeight:'bold',
                  cursor:'pointer'
                }}
              >退出</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
