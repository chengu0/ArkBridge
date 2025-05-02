import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('请先登录');
      setLoading(false);
      return;
    }
    axios.get('http://127.0.0.1:5000/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setProfile(res.data);
      setLoading(false);
    }).catch(() => {
      setError('获取个人信息失败');
      setLoading(false);
    });
  }, []);

  if (loading) return <div>加载中...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div style={{padding: 24}}>
      <h2 style={{marginBottom: 24}}>个人中心</h2>
      <div>手机号：{profile.phone}</div>
      <div>姓名：{profile.username}</div>
    </div>
  );
} 