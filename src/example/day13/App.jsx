import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import List from './List';
import Write from './Write';
import View from './View';

export default function App() {
  return (
    <>
      <div style={{ maxWidth: '800px', margin: '20px auto', fontFamily: 'sans-serif' }}>
        <header style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
          <h2>게시판 서비스</h2>
          <nav style={{ display: 'flex', gap: '10px' }}>
            <Link to="/">목록</Link>
            <Link to="/write">글쓰기</Link>
          </nav>
        </header>
        <hr style={{ marginBottom: '20px' }} />

        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/write" element={<Write />} />
          <Route path="/view/:id" element={<View />} />
        </Routes>
      </div>
      </>
  );
}