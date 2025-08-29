import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ border: '2px solid #333', padding: '10px' }}>
      <h2>🌐 Global Layout</h2>
      <nav>
        <Link to="/welcome">Welcome</Link> | <Link to="/admin/sub-page">Admin</Link>
      </nav>
      <div style={{ marginTop: '10px' }}>
        <Outlet />
        {children}
      </div>
    </div>
  );
};

export default Layout;
