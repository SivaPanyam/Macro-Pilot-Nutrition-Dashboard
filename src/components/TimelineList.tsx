import React from 'react';
import { useNutritionStore } from '../store/nutritionStore';
import { Clock } from 'lucide-react';
import './TimelineList.css';

export const TimelineList: React.FC = () => {
  const timelineSlots = useNutritionStore(state => state.timelineSlots);

  // Filter out slots that have passed (using naive hour check from the store)
  const nowHour = new Date().getHours();
  const upcomingSlots = timelineSlots.filter((slot) => {
    const isPM = slot.time.includes('PM');
    let hour = parseInt(slot.time.split(':')[0]);
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    return hour >= nowHour;
  });

  if (upcomingSlots.length === 0) {
    return <p className="body-main text-secondary">No remaining meals scheduled for today.</p>;
  }

  return (
    <div className="timeline-list">
      {upcomingSlots.map((slot, index) => (
        <div key={slot.id} className="timeline-item">
          <div className="timeline-connector">
            <div className="timeline-dot" />
            {index < upcomingSlots.length - 1 && <div className="timeline-line" />}
          </div>
          
          <div className="timeline-content layer-2" style={{ background: 'var(--surface-container-high)', padding: '16px', borderRadius: 'var(--radius-md)', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--primary-fixed)" />
                <span className="label-caps">{slot.time} - {slot.label}</span>
              </div>
              <span className="data-sm">{slot.suggestedCalories} KCAL</span>
            </div>
            
            <p className="display-sm" style={{ marginBottom: '12px', color: 'var(--primary-fixed)' }}>
              {slot.suggestedMealText || 'Balanced Meal'}
            </p>
            
            <div className="timeline-macros data-sm">
              <span className="macro-p">{slot.suggestedMacros.protein}g Protein</span>
              <span className="macro-c">{slot.suggestedMacros.carbs}g Carbs</span>
              <span className="macro-f">{slot.suggestedMacros.fat}g Fat</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
