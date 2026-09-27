import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setCurrentUser }) {
  const navigate = useNavigate();
  const [mid, setMid] = useState('');
  const [mpwd, setMpwd] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:8080/api/member/login',
        { mid, mpwd },
        { withCredentials: true }
      );

      // 컨트롤러가 성공 시 MemberDto 객체, 실패 시 null을 직접 리턴함
      if (res.data) {
        setCurrentUser(res.data);
        alert(`${res.data.mname}님 로그인 성공!`);
        navigate('/');
      } else {
        alert('로그인 실패: 아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      console.error(err);
      alert('서버 통신 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0 }}>로그인</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <input
          type="text"
          placeholder="아이디"
          value={mid}
          required
          onChange={(e) => setMid(e.target.value)}
          style={{ padding: '8px' }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={mpwd}
          required
          onChange={(e) => setMpwd(e.target.value)}
          style={{ padding: '8px' }}
        />
        <button 
          type="submit" 
          style={{ padding: '10px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          로그인
        </button>
      </form>
    </div>
  );
}

export default Login;