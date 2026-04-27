
import './MacroMeter.css';

interface MacroMeterProps {
  label: string;
  current: number;
  max: number;
  unit?: string;
  size?: number;
  strokeWidth?: number;
}

export const MacroMeter: React.FC<MacroMeterProps> = ({ 
  label, 
  current, 
  max, 
  unit = 'g', 
  size = 120, 
  strokeWidth = 8 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = Math.min(Math.max(current / max, 0), 1);
  const offset = circumference - percent * circumference;
  
  const isGoalReached = current >= max;

  return (
    <div className="macro-meter-wrapper" style={{ width: size, height: size }}>
      <svg 
        className="macro-meter-svg" 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        role="progressbar"
        aria-label={`${label} progress: ${current} out of ${max} ${unit}`}
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <circle
          className="macro-meter-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className={`macro-meter-progress ${isGoalReached ? 'goal-reached' : ''}`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="macro-meter-content">
        <span className="data-lg meter-current">{current}</span>
        <span className="data-sm meter-max">/ {max}{unit}</span>
        <span className="label-caps meter-label">{label}</span>
      </div>
    </div>
  );
};
