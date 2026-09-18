import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CATEGORY_API_URL = 'https://wellness-exclusion-surfing-advisory.trycloudflare.com/api/categories';
const TEST1_URL = 'http://localhost:8080/test1';

const DISPLAY_COLUMNS = [
  { key: '상호', label: '상호' },
  { key: '업태', label: '업태' },
  { key: '메뉴', label: '대표메뉴' },
  { key: '도로명주소', label: '도로명주소' },
  { key: '전화번호', label: '전화번호' }
];

const Yoo = () => {
  const [name, setName] = useState('');
  const [result, setResult] = useState(null);

  const [xmlData, setXmlData] = useState([]);

  useEffect(() => {
    const fetchTest1 = async () => {
        const response = await axios.get(TEST1_URL);
        const resData = response.data;
        setXmlData( resData.data );
    };
    fetchTest1();
  }, [] );

  const handleRegisterCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const response = await axios.post(CATEGORY_API_URL, { name });
      setResult(response.data);
      setName('');
      alert(`카테고리 등록 성공: ${response.data.name} (cno: ${response.data.cno})`);
    } catch (error) {
      console.error('카테고리 등록 실패:', error);
      alert('카테고리 등록에 실패했습니다.');
    }
  };

  return (
    <div className="card">
      <div className="profile-header">
        <h2>유재석 [카테고리 등록 & 맛집 정보]</h2>
      </div>
      <table className="info-table">
        <tbody>
          <tr>
            <th>학과</th>
            <td>방송연예학과</td>
          </tr>
          <tr>
            <th>자기소개</th>
            <td>
              팀원들의 역량을 최대로 끌어올릴 수 있도록 돕는 배려형 리더입니다.
              소통을 가장 중요한 가치로 생각합니다.
            </td>
          </tr>
          <tr>
            <th>기능 수행</th>
            <td>
              <form onSubmit={handleRegisterCategory} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input
                  type="text"
                  placeholder="새 카테고리명"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ padding: '6px' }}
                />
                <button type="submit" style={{ padding: '6px 12px', cursor: 'pointer' }}>등록</button>
              </form>
              {result && (
                <div style={{ marginTop: '8px', fontSize: '13px', color: '#2e7d32' }}>
                  등록 완료: {result.name} (ID: {result.cno})
                </div>
              )}

              <hr style={{ margin: '16px 0', border: '0', borderTop: '1px solid #e0e0e0' }} />


              {/* 스크롤 제거된 테이블 영역 */}
              { xmlData.length > 0 && (
                <div>
                  <div style={{ border: '1px solid #ddd' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                      <thead style={{ backgroundColor: '#f5f5f5' }}>
                        <tr>
                          {DISPLAY_COLUMNS.map((col) => (
                            <th key={col.key} style={{ borderBottom: '2px solid #ddd', padding: '8px', whiteSpace: 'nowrap' }}>
                              {col.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {xmlData.map((row, rowIndex) => (
                          <tr key={rowIndex} style={{ borderBottom: '1px solid #eee' }}>
                            {DISPLAY_COLUMNS.map((col) => (
                              <td key={col.key} style={{ padding: '6px 8px', whiteSpace: 'normal' }}>
                                {row[col.key] !== undefined ? String(row[col.key]) : '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Yoo;