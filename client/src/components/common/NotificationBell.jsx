import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
  const { user, token } = useContext(AuthContext);
  const { isDark } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, token]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleMarkAsRead = async (id, e) => {
    if(e) e.stopPropagation();
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read", err);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    setOpen(false);
    if (notification.link) {
      navigate(notification.link);
    }
  };

  if (!user) return null;

  const metaClr = isDark ? '#e2e8f0' : 'var(--hz-text)';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const bgDropdown = isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const linkClr = isDark ? 'rgba(255,255,255,0.7)' : 'var(--hz-text-secondary)';

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} ref={dropdownRef}>
      <button 
        onClick={() => setOpen(!open)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: metaClr, padding: '0.5rem', borderRadius: '12px',
          transition: 'all 0.2s', position: 'relative',
          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
        }}
        onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
        onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '2px', right: '4px',
            background: '#ef4444', color: '#fff', fontSize: '0.65rem',
            fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px',
            minWidth: '18px', textAlign: 'center'
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          background: bgDropdown, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${border}`, borderRadius: '16px',
          width: '320px', maxHeight: '400px', overflowY: 'auto',
          boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.1)',
          display: 'flex', flexDirection: 'column',
          zIndex: 100, animation: 'slideDown 0.2s ease-out forwards', transformOrigin: 'top right'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: `1px solid ${border}` }}>
            <h4 style={{ margin: 0, color: metaClr, fontSize: '1rem' }}>Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} style={{
                background: 'none', border: 'none', color: 'var(--hz-primary)',
                fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600
              }}>
                Mark all read
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: linkClr, fontSize: '0.9rem' }}>
                No notifications yet.
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{
                    padding: '1rem', borderBottom: `1px solid ${border}`,
                    background: notif.isRead ? 'transparent' : (isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)'),
                    cursor: notif.link ? 'pointer' : 'default',
                    transition: 'background 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={e => { if(notif.link) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = notif.isRead ? 'transparent' : (isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)') }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    {!notif.isRead && (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--hz-primary)', marginTop: '6px', flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, paddingLeft: notif.isRead ? '14px' : '0' }}>
                      <h5 style={{ margin: '0 0 0.25rem 0', color: metaClr, fontSize: '0.9rem' }}>{notif.title}</h5>
                      <p style={{ margin: 0, color: linkClr, fontSize: '0.85rem', lineHeight: '1.4' }}>{notif.message}</p>
                      <span style={{ fontSize: '0.75rem', color: linkClr, marginTop: '0.5rem', display: 'block' }}>
                        {new Date(notif.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
