
import './StatusChip.css';

interface StatusChipProps {
  label: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({ label, variant = 'info', className = '' }) => {
  return (
    <span className={`status-chip chip-${variant} label-caps ${className}`}>
      {label}
    </span>
  );
};
