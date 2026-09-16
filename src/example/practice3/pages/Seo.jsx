import React from 'react';

const Seo = () => {
  return (
    <div className="card">
      <div className="profile-header">
        <h2>서장훈</h2>
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
        </tbody>
      </table>
    </div>
  );
};

export default Seo;