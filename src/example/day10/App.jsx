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

  // 새로고침 시 톰캣 세션 유지 확인 (/api/member/me)
  useEffect(() => {
    axios.get('http://localhost:8080/api/member/me', { withCredentials: true })
      .then((res) => {
        // 데이터가 유효하면 유저 객체 설정, null/빈문자열이면 비로그인 처리
        if (res.data) {
          setCurrentUser(res.data);
        } else {
          setCurrentUser(null);
        }
      })
      .catch((err) => {
        console.error('세션 확인 실패:', err);
        setCurrentUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
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