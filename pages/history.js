import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('请先登录');
      setLoading(false);
      return;
    }
    axios.get('http://127.0.0.1:5000/api/model/history', {
      headers: { Authorization: `Bearer ${token}` },
      params: { page: 1, per_page: 10 }
    }).then(res => {
      setHistory(res.data.items);
      setLoading(false);
    }).catch(() => {
      setError('获取历史记录失败');
      setLoading(false);
    });
  }, []);

  if (loading) return <div>加载中...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div style={{padding: 24}}>
      <h2 style={{marginBottom: 24}}>历史转译记录</h2>
      {history.length === 0 ? (
        <div>暂无历史记录</div>
      ) : (
        history.map(item => (
          <div key={item.id} style={{marginBottom: 16, background: '#eee', padding: 16, borderRadius: 8}}>
            <div style={{fontSize: 16}}>{item.content}</div>
            <div style={{fontSize: 12, color: '#888', marginTop: 8}}>{item.created_at}</div>
          </div>
        ))
      )}
    </div>
  );
} 