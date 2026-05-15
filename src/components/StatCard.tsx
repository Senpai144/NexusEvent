import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatProps {
  label: string;
  value: string | number; // Permet de passer un nombre ou une chaîne (ex: "45 000 FCFA")
  trend: string;
  isPositive?: boolean;   // Optionnel, par défaut à true
}

const StatCard = ({ label, value, trend, isPositive = true }: StatProps) => {
  return (
    <div className="card" style={{ flex: 1, minWidth: '200px' }}>
      <p className="form-label" style={{ marginBottom: '10px' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <h3 style={{ fontSize: '1.8rem' }}>{value}</h3>
        <span 
          style={{ 
            color: isPositive ? 'var(--success)' : 'var(--error, #dc3545)', 
            fontSize: '0.8rem', 
            display: 'flex', 
            alignItems: 'center' 
          }}
        >
          {trend}{' '}
          {isPositive ? (
            <TrendingUp size={14} style={{ marginLeft: '4px' }} />
          ) : (
            <TrendingDown size={14} style={{ marginLeft: '4px' }} />
          )}
        </span>
      </div>
    </div>
  );
};

export default StatCard;