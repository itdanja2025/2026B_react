import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'https://wellness-exclusion-surfing-advisory.trycloudflare.com/api';

const Kang = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('제품 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="card">
      <div className="profile-header">
        <h2>강호동 [제품 전체 조회]</h2>
      </div>
      <table className="info-table">
        <tbody>
          <tr>
            <th>학과</th>
            <td>체육교육학과</td>
          </tr>
          <tr>
            <th>자기소개</th>
            <td>
              포기하지 않는 열정과 에너지로 어려운 과제도 끝까지 밀어붙입니다.
              지치지 않는 체력이 장점입니다!
            </td>
          </tr>
          <tr>
            <th>제품 목록</th>
            <td>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #ccc' }}>
                    <th style={{ padding: '4px' }}>bno</th>
                    <th style={{ padding: '4px' }}>카테고리</th>
                    <th style={{ padding: '4px' }}>상품명</th>
                    <th style={{ padding: '4px' }}>가격</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.bno} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '4px', textAlign: 'center' }}>{p.bno}</td>
                      <td style={{ padding: '4px' }}>{p.categoryname || `ID:${p.cno}`}</td>
                      <td style={{ padding: '4px' }}>{p.name}</td>
                      <td style={{ padding: '4px', textAlign: 'right' }}>{p.price?.toLocaleString()}원</td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '8px' }}>데이터가 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Kang;