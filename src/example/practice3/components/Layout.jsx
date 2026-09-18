import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2 className="sidebar-title"> OOO 팀 프로젝트</h2>
        <nav className="nav-menu">
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            홈 (공통)
          </NavLink>

          <div className="nav-divider">팀원 소개</div>

          <NavLink 
            to="/yoo" 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
             유재석(카테고리등록)
          </NavLink>

          <NavLink 
            to="/shin" 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
             신동엽(카테고리전체출력)
          </NavLink>

          <NavLink 
            to="/kang" 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
             강호동(제춤전체출력)
          </NavLink>

          <NavLink 
            to="/seo" 
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
             서장훈(제품등록)
          </NavLink>
        </nav>
      </aside>

      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;