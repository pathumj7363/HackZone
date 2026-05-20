import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';

export default function AdminLayout() {
  return (
    <div className="layout-container admin-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="admin-body" style={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar />
        <main className="main-content" style={{ flexGrow: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
