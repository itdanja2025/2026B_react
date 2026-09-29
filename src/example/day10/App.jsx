import  { useState, useEffect } from 'react';
import {  Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import SignUp from './SignUp';
import Login from './Login';

// 메인 홈 컴포넌트
function Home({ currentUser }) {
  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '24px', textAlign: 'center' }}>
      <h2> 세션 인증 메인 페이지</h2>
      {currentUser ? (
        <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', textAlign: 'left', lineHeight: '1.8' }}>
          <p><strong>회원번호(mno):</strong> {currentUser.mno}</p>
          <p><strong>아이디(mid):</strong> {currentUser.mid}</p>
          <p><strong>이름(mname):</strong> {currentUser.mname}</p>
          <p><strong>권한(role):</strong> {currentUser.role}</p>

          {currentUser.role === 'admin' ? (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fed7d7', color: '#c53030', borderRadius: '4px', fontWeight: 'bold' }}>
              관리자(Admin) 권한으로 접속 중입니다.
            </div>
          ) : (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#ebf8ff', color: '#2b6cb0', borderRadius: '4px' }}>
              일반회원(User) 계정입니다.
            </div>
          )}
        </div>
      ) : (
        <p style={{ color: '#718096' }}>로그인 후 세션 정보 및 회원 권한을 확인할 수 있습니다.</p>
      )}
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 토큰 확인 및 RTR 재발급 처리
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. 현재 Access Token으로 내 정보 조회 시도
        const res = await axios.get('http://localhost:8080/api/member/me',        
        { withCredentials: true });

        if (res.data ) {
          setCurrentUser(res.data);
          return;
        }

        // 2. Access Token 만료/없음(null 반환) -> RTR 재발급 요청 (/reissue)
        const reissueRes = await axios.post('http://localhost:8080/api/member/reissue',        
          {},
        { withCredentials: true });

        if (reissueRes.data) {
          // 백엔드 컨트롤러가 갱신된 쿠키 탑재와 함께 MemberDto를 반환하므로 바로 세팅
          setCurrentUser(reissueRes.data);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        // Refresh Token까지 만료되었거나 변조/침해 감지 시
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>세션 확인 중...</div>;
  }

  return (
      <div style={{ fontFamily: 'sans-serif' }}>
        <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <Routes>
          <Route path="/" element={<Home currentUser={currentUser} />} />
          <Route path="/signup" element={currentUser ? <Navigate to="/" /> : <SignUp />} />
          <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login setCurrentUser={setCurrentUser} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
  );
}

export default App;