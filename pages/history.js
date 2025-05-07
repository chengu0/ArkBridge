import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

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

  if (loading) return (
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
      <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{textAlign:'center', fontSize:22, color:'#888'}}>加载中...</div>
      </div>
    </div>
  );
  if (error) return (
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
      <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{color:'red', fontSize:22}}>{error}</div>
      </div>
    </div>
  );

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
      <div style={{flex:1, minHeight:'100vh', background:'#fff'}}>
        <div style={{textAlign:'center', fontSize:28, fontWeight:'bold', marginTop:40, marginBottom:40}}>
          历史转译记录
        </div>
        <div style={{
          display:'flex',
          justifyContent:'center',
          alignItems:'flex-start'
        }}>
          <div style={{
            width:'80%',
            minWidth:300,
            background:'#ccc',
            borderRadius:24,
            padding:'32px 40px',
            fontSize:24,
            color:'#222',
            textAlign:'left'
          }}>
            2025.04.29
          </div>
        </div>
      </div>
    </div>
  );
} 