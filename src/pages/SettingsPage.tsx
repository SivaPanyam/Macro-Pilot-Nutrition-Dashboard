import React, { useState, useEffect } from 'react';
import { DataCard } from '../components/DataCard';
import { Button } from '../components/Button';
import { useNutritionStore } from '../store/nutritionStore';
import type { Mode } from '../store/nutritionStore';

export const SettingsPage: React.FC = () => {
  const { mode, setMode, dailyGoals, updateDailyGoal } = useNutritionStore();
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    setHighContrast(document.body.classList.contains('theme-high-contrast'));
  }, []);

  const toggleHighContrast = () => {
    const isNowHigh = !highContrast;
    setHighContrast(isNowHigh);
    if (isNowHigh) {
      document.body.classList.add('theme-high-contrast');
    } else {
      document.body.classList.remove('theme-high-contrast');
    }
  };

  const handleModeChange = (mode: Mode) => {
    setMode(mode);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 className="display-lg">Profile & Settings</h1>
        <p className="body-large text-secondary">Configure your biological parameters.</p>
      </div>

      <DataCard title="SYSTEM MODE">
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
          <Button 
            variant={mode === 'Athlete' ? 'primary' : 'secondary'} 
            onClick={() => handleModeChange('Athlete')}
          >
            ATHLETE MODE
          </Button>
          <Button 
            variant={mode === 'Strict' ? 'primary' : 'secondary'} 
            onClick={() => handleModeChange('Strict')}
          >
            STRICT MODE
          </Button>
          <Button 
            variant={mode === 'Balanced' ? 'primary' : 'secondary'} 
            onClick={() => handleModeChange('Balanced')}
          >
            BALANCED MODE
          </Button>
        </div>
        <p className="body-main text-secondary" style={{ marginTop: '16px' }}>
          Selected Mode: <span style={{ color: 'var(--primary-fixed)', fontWeight: 'bold', textTransform: 'uppercase' }}>{mode}</span>
        </p>
      </DataCard>

      <DataCard title="CALORIC CEILING (HEALTH SYNC)">
        <p className="body-main" style={{ marginBottom: '16px' }}>
          Your daily base caloric goal is dynamic, driven by the Health Connect Sync.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="display-md">{dailyGoals.calories}</span>
          <span className="label-caps text-secondary">KCAL</span>
        </div>
        <div style={{ marginTop: '16px' }}>
          <Button variant="secondary" onClick={() => updateDailyGoal(2500)}>
            RESET BASE TO 2500
          </Button>
        </div>
      </DataCard>

      <DataCard title="ACCESSIBILITY & THEME">
        <p className="body-main" style={{ marginBottom: '16px' }}>
          Adjust display settings for better visibility and WCAG 2.1 compliance.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button variant={highContrast ? 'primary' : 'secondary'} onClick={toggleHighContrast}>
            {highContrast ? 'DISABLE HIGH CONTRAST' : 'ENABLE HIGH CONTRAST'}
          </Button>
        </div>
      </DataCard>
    </div>
  );
};
