import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { icon: '🚨', label: 'Report Issue', path: '/report', color: '#d32f2f' },
    { icon: '🔔', label: 'Alerts', path: '/alerts', color: '#ff9800' },
    { icon: '📋', label: 'Farmer Reports', path: '/reports', color: '#2196f3' },
  ];

  return (
    <div style={{ width: '100%' }}>
      <h3 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--white)' }}>⚡ Quick Actions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
        {actions.map((action) => (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: `1px solid rgba(255, 255, 255, 0.2)`,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'var(--transition)',
              fontSize: '1.5rem',
              backdropFilter: 'blur(5px)',
              color: 'var(--white)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = action.color;
              e.currentTarget.style.borderColor = action.color;
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = 'var(--white)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span>{action.icon}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
