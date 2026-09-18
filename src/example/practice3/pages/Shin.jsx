import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'https://wellness-exclusion-surfing-advisory.trycloudflare.com/api';

const Shin = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="card">
      <div className="profile-header">
        <h2>신동엽 [카테고리 전체 조회]</h2>
      </div>
      <table className="info-table">
        <tbody>
          <tr>
            <th>학과</th>
            <td>연극영화학과</td>
          </tr>
          <tr>
            <th>자기소개</th>
            <td>
              남다른 관점과 유쾌한 센스로 프로젝트에 차별화된 아이디어를 더합니다.
              효율적이고 깔끔한 구조를 지향합니다.
            </td>
          </tr>
          <tr>
            <th>카테고리 목록</th>
            <td>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {categories.map((cat) => (
                  <li key={cat.cno}>
                    {cat.name} (cno: {cat.cno})
                  </li>
                ))}
                {categories.length === 0 && <li>등록된 카테고리가 없습니다.</li>}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Shin;