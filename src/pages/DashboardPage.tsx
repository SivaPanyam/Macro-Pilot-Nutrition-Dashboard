import React from 'react';
import { MacroMeter } from '../components/MacroMeter';
import { DataCard } from '../components/DataCard';
import { TimelineList } from '../components/TimelineList';
import { TelemetryList } from '../components/TelemetryList';
import type { TelemetryItem } from '../components/TelemetryList';
import { StatusChip } from '../components/StatusChip';
import { useNutritionStore } from '../store/nutritionStore';

const mockTelemetry: TelemetryItem[] = [
  { id: '1', time: '08:30 AM', name: 'Oatmeal & Whey Protein', calories: 450, macros: { protein: 40, carbs: 50, fat: 10 } },
  { id: '2', time: '01:00 PM', name: 'Grilled Chicken Salad', calories: 320, macros: { protein: 35, carbs: 10, fat: 15 } },
];

export const DashboardPage: React.FC = () => {
  const { dailyGoals, consumedToday } = useNutritionStore();

  return (
    <div className="dashboard-grid">
      {/* Top Level Summary */}
      <DataCard title="SYSTEM STATUS" className="status-card" tabIndex={0} aria-label="System Status">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <StatusChip variant="success" label="METABOLIC SYNC" />
          <StatusChip variant="info" label="HYDRATION" />
          <StatusChip variant="warning" label="SLEEP DEFICIT" />
        </div>
      </DataCard>

      {/* Main Macro Meters */}
      <DataCard title="MACRO TELEMETRY" className="macros-card" tabIndex={0} aria-label="Macro Telemetry">
        <div className="meters-container" style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <MacroMeter label="PROTEIN" current={consumedToday.protein} max={dailyGoals.protein} />
          <MacroMeter label="CARBS" current={consumedToday.carbs} max={dailyGoals.carbs} />
          <MacroMeter label="FAT" current={consumedToday.fat} max={dailyGoals.fat} />
        </div>
      </DataCard>

      {/* Calorie Overview */}
      <DataCard title="ENERGY EXPENDITURE" className="calories-card" tabIndex={0} aria-label="Energy Expenditure">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }} aria-live="polite" aria-atomic="true">
          <span className="display-lg">{consumedToday.calories}</span>
          <span className="body-main" style={{ paddingBottom: '8px' }}>/ {dailyGoals.calories} kcal</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'var(--surface-container-highest)', borderRadius: '4px', marginTop: '16px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${Math.min(100, (consumedToday.calories / dailyGoals.calories) * 100)}%`, 
              height: '100%', 
              background: 'var(--primary-fixed)',
              transition: 'width 0.5s ease-out'
            }} 
          />
        </div>
      </DataCard>

      {/* Telemetry Log & Timeline */}
      <div style={{ gridColumn: 'span 12', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-md)' }}>
        <DataCard title="RECENT LOGS" className="log-card" tabIndex={0} aria-label="Recent Logs">
          <TelemetryList items={mockTelemetry} />
        </DataCard>

        <DataCard title="PREDICTIVE TIMELINE" className="timeline-card" tabIndex={0} aria-label="Predictive Timeline">
          <TimelineList />
        </DataCard>
      </div>
    </div>
  );
};
