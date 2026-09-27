import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUp() {
  const navigate = useNavigate();
  const [mid, setMid] = useState('');
  const [mpwd, setMpwd] = useState('');
  const [mname, setMname] = useState('');
  const [role, setRole] = useState('user'); // 기본값 'user'

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:8080/api/member/signup',
        { mid, mpwd, mname, role },
        { withCredentials: true }
      );

      // 컨트롤러가 boolean(true/false)을 직접 리턴함
      if (res.data === true) {
        alert('회원가입이 완료되었습니다. 로그인해주세요.');
        navigate('/login');
      } else {
        alert('회원가입 실패: 이미 사용 중인 아이디입니다.');
      }
    } catch (err) {
      console.error(err);
      alert('서버 통신 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <h3 style={{ marginTop: 0 }}>회원가입</h3>
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
        <input
          type="text"
          placeholder="이름 (닉네임)"
          value={mname}
          required
          onChange={(e) => setMname(e.target.value)}
          style={{ padding: '8px' }}
        />

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span>권한:</span>
          <label style={{ cursor: 'pointer' }}>
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === 'user'}
              onChange={(e) => setRole(e.target.value)}
            /> 일반회원 (user)
          </label>
          <label style={{ cursor: 'pointer' }}>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === 'admin'}
              onChange={(e) => setRole(e.target.value)}
            /> 관리자 (admin)
          </label>
        </div>

        <button 
          type="submit" 
          style={{ padding: '10px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          가입하기
        </button>
      </form>
    </div>
  );
}

export default SignUp;