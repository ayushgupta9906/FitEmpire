import React from 'react';

interface TurnstileGateControlProps {
  gateId: string;
  gateName: string;
  status: 'OPEN' | 'LOCKED' | 'MAINTENANCE';
  onToggleGate: (gateId: string) => void;
}

export const TurnstileGateControl: React.FC<TurnstileGateControlProps> = ({
  gateId,
  gateName,
  status,
  onToggleGate,
}) => {
  const statusColors = {
    OPEN: '#10B981',
    LOCKED: '#EF4444',
    MAINTENANCE: '#F59E0B',
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderRadius: '8px',
      backgroundColor: '#1E293B',
      color: '#F8FAFC',
      border: '1px solid #334155',
    }}>
      <div>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{gateName}</h4>
        <span style={{ fontSize: '12px', color: statusColors[status] }}>● {status}</span>
      </div>
      <button
        onClick={() => onToggleGate(gateId)}
        style={{
          padding: '6px 12px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor: '#3B82F6',
          color: '#FFFFFF',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 600,
        }}
      >
        Toggle
      </button>
    </div>
  );
};
