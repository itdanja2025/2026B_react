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

  // 내정보 조회시 accessToken 사용하여 조회한다. 만일 만료되면 재발급
  const checkAuth = async () => {
    // 1. 내정보조회 , 주의할점 : 쿠키/세션 사용시 { withCredentials : true } 옵션 포함
    // axios.post( url , body ,  { withCredentials : true } )
    // axios get( url , { withCredentials : true } )
    const response = await axios.get("http://localhost:8080/api/member/me" , { withCredentials : true } )
    if( response.data ){ setCurrentUser(response.data ); setLoading(false); return; }
    // 2. 만약에 access 토큰 없어서 내정보 조회 실패시 [RTR]토큰 재발급 
    const response2 = await axios.post("http://localhost:8080/api/member/reissue",{},{ withCredentials : true } )
    if( response2.data ){ setCurrentUser(response2.data ); } // 재발급 성공 
    else{ setCurrentUser(null); } // 재발급 실패 
    setLoading(false);
  }
  // * 컴포넌트 최초 1번 실행 훅 
  useEffect(() => {    checkAuth(); }, []);

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