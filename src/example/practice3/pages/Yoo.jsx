import React from 'react';

const Yoo = () => {
  return (
    <div className="card">
      <div className="profile-header">
        <h2>유재석</h2>
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
        </tbody>
      </table>
    </div>
  );
};

export default Yoo;