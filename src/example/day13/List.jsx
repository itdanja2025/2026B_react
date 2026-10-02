import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/board';

export default function List() {
  const [boardList, setBoardList] = useState([]);

  // async / await 기반 데이터 조회
  const fetchList = async () => {
    try {
      const response = await axios.get(`${API_BASE}/list`);
      setBoardList(response.data);
    } catch (error) {
      console.error('목록 로드 실패:', error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3>게시글 목록</h3>
        <Link to="/write">
          <button style={{ padding: '6px 12px', cursor: 'pointer' }}>새 글 작성</button>
        </Link>
      </div>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th>번호</th>
            <th>제목</th>
            <th>작성일</th>
            <th>첨부여부</th>
          </tr>
        </thead>
        <tbody>
          {boardList.length === 0 ? (
            <tr><td colSpan="4">등록된 게시물이 없습니다.</td></tr>
          ) : (
            boardList.map((board) => (
              <tr key={board.id}>
                <td>{board.id}</td>
                <td style={{ textAlign: 'left', paddingLeft: '15px' }}>
                  <Link to={`/view/${board.id}`} style={{ textDecoration: 'none', color: '#0066cc' }}>
                    {board.title}
                  </Link>
                </td>
                <td>{board.cdate ? board.cdate.substring(0, 10) : '-'}</td>
                <td>{board.fileName ? 'O' : 'X'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}