
import './TelemetryList.css';

export interface TelemetryItem {
  id: string;
  time: string;
  name: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface TelemetryListProps {
  items: TelemetryItem[];
}

export const TelemetryList: React.FC<TelemetryListProps> = ({ items }) => {
  return (
    <div className="telemetry-list">
      {items.map((item) => (
        <div key={item.id} className="telemetry-item">
          <div className="telemetry-time data-sm">{item.time}</div>
          <div className="telemetry-name body-main">{item.name}</div>
          <div className="telemetry-macros data-sm">
            <span className="macro-p">{item.macros.protein}P</span>
            <span className="macro-c">{item.macros.carbs}C</span>
            <span className="macro-f">{item.macros.fat}F</span>
          </div>
          <div className="telemetry-calories data-sm">{item.calories} KCAL</div>
        </div>
      ))}
    </div>
  );
};
