import React, { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'https://wellness-exclusion-surfing-advisory.trycloudflare.com/api';

const Seo = () => {
  const [form, setForm] = useState({ name: '', price: '', cno: '' });
  const [result, setResult] = useState(null);

  const handleRegisterProduct = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.cno) return;

    try {
      const response = await axios.post(`${BASE_URL}/products`, {
        name: form.name,
        price: Number(form.price),
        cno: Number(form.cno)
      });
      setResult(response.data);
      setForm({ name: '', price: '', cno: '' });
      alert(`제품 등록 성공: ${response.data.name} (bno: ${response.data.bno})`);
    } catch (error) {
      console.error('제품 등록 실패:', error);
      alert('제품 등록에 실패했습니다.');
    }
  };

  return (
    <div className="card">
      <div className="profile-header">
        <h2>서장훈 [제품 등록]</h2>
      </div>
      <table className="info-table">
        <tbody>
          <tr>
            <th>학과</th>
            <td>스포츠경영학과</td>
          </tr>
          <tr>
            <th>자기소개</th>
            <td>
              원칙과 정확성을 최우선으로 여깁니다. 
              사소한 버그나 놓치기 쉬운 세부 사항도 꼼꼼하게 검토합니다.
            </td>
          </tr>
          <tr>
            <th>제품 등록 폼</th>
            <td>
              <form onSubmit={handleRegisterProduct} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="제품명 (예: 기계식 키보드)"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ padding: '6px' }}
                />
                <input
                  type="number"
                  placeholder="가격 (예: 45000)"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  style={{ padding: '6px' }}
                />
                <input
                  type="number"
                  placeholder="카테고리 번호(cno) (예: 1)"
                  value={form.cno}
                  onChange={(e) => setForm({ ...form, cno: e.target.value })}
                  style={{ padding: '6px' }}
                />
                <button type="submit" style={{ padding: '6px 12px', cursor: 'pointer' }}>등록</button>
              </form>
              {result && (
                <div style={{ marginTop: '8px', fontSize: '13px', color: '#2e7d32' }}>
                  등록 완료: {result.name} (bno: {result.bno}, {result.price.toLocaleString()}원)
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Seo;