import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import ChatRoom from './ChatRoom';

function App() {
  // 앱 최초 구동 시 단 한 번 고유 ID를 난수로 생성하여 전역 공유
  const [userId] = useState(
    () => `user_${Math.floor(Math.random() * 9000) + 1000}`
  );

  return (
    <>
      {/* 1. 상단 공통 헤더: 전역 SSE 수신 및 동일 userId 공유 */}
      <Header userId={userId} />

      {/* 2. 페이지 라우팅 영역 */}
      <main>
        <Routes>
          <Route path="/" element={<Home userId={userId} />} />
          <Route path="/chat" element={<ChatRoom userId={userId} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;