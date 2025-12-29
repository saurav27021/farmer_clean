import React from 'react';
import { useSelector } from 'react-redux';

const ActivityFeed = () => {
  const { reports } = useSelector((state) => state.reports);
  const { alerts } = useSelector((state) => state.alerts);

  // Combine recent reports and alerts
  const safeReports = reports || [];
  const safeAlerts = alerts || [];
  const activities = [
    ...safeReports.slice(0, 3).map(r => ({ ...r, type: 'report', time: r.reportedAt || new Date() })),
    ...safeAlerts.slice(0, 2).map(a => ({ ...a, type: 'alert', time: a.sentAt || new Date() }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

  const getActivityIcon = (activity) => {
    if (activity.type === 'alert') {
      return activity.severity === 'High' ? '🔴' : activity.severity === 'Medium' ? '🟠' : '🟡';
    }
    return '📋';
  };

  const formatTime = (date) => {
    const now = new Date();
    const time = new Date(date);
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="card">
      <h3 style={{ marginTop: 0, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        📊 Recent Activity
      </h3>
      {activities.length === 0 ? (
        <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '2rem' }}>
          No recent activity
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activities.map((activity, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '1rem',
                padding: '0.75rem',
                background: idx % 2 === 0 ? '#f8f9fa' : 'transparent',
                borderRadius: '8px',
                transition: 'var(--transition)'
              }}
            >
              <div style={{ fontSize: '1.5rem' }}>{getActivityIcon(activity)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                  {activity.type === 'alert' ? activity.message : `${activity.pestOrDiseaseName} reported`}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                  {formatTime(activity.time)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;

