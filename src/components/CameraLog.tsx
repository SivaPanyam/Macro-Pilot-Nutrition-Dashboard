import React, { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { useNutritionStore } from '../store/nutritionStore';

export const CameraLog: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const updateConsumed = useNutritionStore((state) => state.updateConsumed);

  const handleCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Pointing to relative path so it works when deployed or proxied
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      
      updateConsumed({
        calories: data.calories || 0,
        protein: data.protein || 0,
        carbs: data.carbs || 0,
        fat: data.fat || 0
      });

      alert(`Logged ${data.foodName}: ${data.calories} kcal`);

    } catch (error) {
      console.error(error);
      alert('Failed to analyze food.');
    } finally {
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={fileInputRef}
        onChange={handleCapture}
        style={{ display: 'none' }}
      />
      <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing} aria-label="Camera Log">
        {isAnalyzing ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Camera size={16} aria-hidden="true" />}
        {isAnalyzing ? 'ANALYZING...' : 'CAMERA LOG'}
      </Button>
    </div>
  );
};
