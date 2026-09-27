import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Header({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();

  // 로그아웃 요청 (boolean 응답 반환)
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        'http://localhost:8080/api/member/logout',
        {},
        { withCredentials: true }
      );

      if (res.data === true) {
        setCurrentUser(null);
        alert('로그아웃 되었습니다.');
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      alert('로그아웃 처리 중 통신 오류가 발생했습니다.');
    }
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      backgroundColor: '#2d3748',
      color: '#fff'
    }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>
        Sesssion
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {currentUser ? (
          <>
            <span>{currentUser.mname} ({currentUser.mid})</span>
            <span style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              backgroundColor: currentUser.role === 'admin' ? '#e53e3e' : '#3182ce',
              color: '#fff'
            }}>
              {currentUser.role ? currentUser.role.toUpperCase() : 'USER'}
            </span>
            <button 
              onClick={handleLogout} 
              style={{ padding: '6px 12px', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#e2e8f0' }}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <span style={{ color: '#a0aec0', fontSize: '14px' }}>비로그인</span>
            <Link to="/signup">
              <button style={{ padding: '6px 12px', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#edf2f7' }}>
                회원가입
              </button>
            </Link>
            <Link to="/login">
              <button style={{ padding: '6px 12px', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#edf2f7' }}>
                로그인
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;