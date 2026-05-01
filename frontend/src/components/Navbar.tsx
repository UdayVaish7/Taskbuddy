import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="sidebar">
      <div className="brand">
        <CheckSquare size={32} color="var(--primary-color)" />
        TaskBuddy
      </div>
      
      <div style={{ marginTop: '24px', flex: 1 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 600 }}>Menu</p>
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <FolderKanban size={20} /> Projects
            </NavLink>
          </li>
          <li>
            <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <CheckSquare size={20} /> Tasks
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 600 }}>{user?.name}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user?.role}</span>
        </div>
        <button onClick={logout} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: '8px' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
