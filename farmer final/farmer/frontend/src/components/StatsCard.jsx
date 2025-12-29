import React from 'react';

const StatsCard = ({ title, value, change, icon, color = '#2e7d32' }) => {
  return (
    <div className="stats-card" style={{ borderLeftColor: color }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3>{title}</h3>
          <p className="value" style={{ color }}>{value}</p>
          {change && <p className="change">{change}</p>}
        </div>
        {icon && (
          <div style={{ fontSize: '2.5rem', opacity: 0.3 }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;



