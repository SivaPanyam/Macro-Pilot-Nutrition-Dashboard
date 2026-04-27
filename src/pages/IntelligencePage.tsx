import React from 'react';
import { DataCard } from '../components/DataCard';
import { useNutritionStore } from '../store/nutritionStore';
import { StatusChip } from '../components/StatusChip';
import { Target, Zap, Activity, HeartPulse } from 'lucide-react';
import { Button } from '../components/Button';

export const IntelligencePage: React.FC = () => {
  const { dailyGoals, consumedToday, mode, caloricOvershoot, applySocialBuffer } = useNutritionStore();

  const remainingProtein = Math.max(0, dailyGoals.protein - consumedToday.protein);
  const remainingCarbs = Math.max(0, dailyGoals.carbs - consumedToday.carbs);
  const remainingFat = Math.max(0, dailyGoals.fat - consumedToday.fat);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 className="display-lg">Intelligence View</h1>
        <p className="body-large text-secondary">The Gap Filler: Algorithmic nutritional targeting.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <DataCard title="ACTIVE MODE" className="flex flex-col gap-2">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={24} color="var(--primary-fixed)" />
            <span className="display-md">{mode.toUpperCase()}</span>
          </div>
          <p className="body-main text-secondary" style={{ marginTop: '16px' }}>
            {mode === 'Athlete' && 'Prioritizing protein synthesis and pre-workout carbohydrate loading.'}
            {mode === 'Strict' && 'Precision adherence to macro targets with low variance tolerance.'}
            {mode === 'Balanced' && 'Flexible targeting focusing on total caloric balance and whole foods.'}
          </p>
        </DataCard>

        <DataCard title="MACRO GAP ANALYSIS" className="flex flex-col gap-4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="label-caps">PROTEIN DEFICIT</span>
            <span className="display-sm" style={{ color: 'var(--primary-fixed)' }}>{remainingProtein}g</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="label-caps">CARB DEFICIT</span>
            <span className="display-sm" style={{ color: 'var(--secondary-fixed)' }}>{remainingCarbs}g</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="label-caps">FAT DEFICIT</span>
            <span className="display-sm" style={{ color: 'var(--tertiary-fixed)' }}>{remainingFat}g</span>
          </div>
        </DataCard>

        {caloricOvershoot > 500 && (
          <DataCard title="RECOVERY PROTOCOL" className="flex flex-col gap-4" style={{ borderColor: 'var(--warning)', background: 'var(--surface-container-high)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--warning)' }}>
              <HeartPulse size={24} />
              <span className="display-sm">Caloric Overshoot Detected</span>
            </div>
            <p className="body-main text-secondary">
              You exceeded your limit by {caloricOvershoot} kcal. Instead of zeroing out today, use a Gentle Correction. Spread the deficit across the next 48 hours (-250 kcal/day).
            </p>
            <Button variant="secondary" onClick={applySocialBuffer} style={{ borderColor: 'var(--warning)', color: 'var(--warning)' }}>
              SPREAD OVER 48 HOURS
            </Button>
          </DataCard>
        )}
      </div>

      <DataCard title="AI SUGGESTIONS (GAP FILLERS)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {remainingProtein > 30 ? (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px', background: 'var(--surface-container)', borderRadius: 'var(--radius-md)' }}>
              <Target size={24} color="var(--primary-fixed)" />
              <div>
                <h4 className="label-caps" style={{ color: 'var(--primary-fixed)' }}>High Protein Requirement</h4>
                <p className="body-main" style={{ marginTop: '4px' }}>Consider a lean protein source like Chicken Breast (150g) or a double scoop of Whey Protein to close the {remainingProtein}g gap efficiently.</p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: 'var(--surface-container)', borderRadius: 'var(--radius-md)' }}>
              <StatusChip variant="success" label="PROTEIN ON TRACK" />
            </div>
          )}

          {remainingCarbs > 40 ? (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px', background: 'var(--surface-container)', borderRadius: 'var(--radius-md)' }}>
              <Zap size={24} color="var(--secondary-fixed)" />
              <div>
                <h4 className="label-caps" style={{ color: 'var(--secondary-fixed)' }}>Energy Replenishment Needed</h4>
                <p className="body-main" style={{ marginTop: '4px' }}>Add complex carbohydrates like Sweet Potato (200g) or Brown Rice to fuel upcoming activity and hit the {remainingCarbs}g target.</p>
              </div>
            </div>
          ) : null}
        </div>
      </DataCard>
    </div>
  );
};
