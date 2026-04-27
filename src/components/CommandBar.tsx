import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Plus, Activity, Mic, Loader2 } from 'lucide-react';
import './CommandBar.css';
import { Button } from './Button';
import { CameraLog } from './CameraLog';
import { useNutritionStore } from '../store/nutritionStore';

export const CommandBar: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const updateConsumed = useNutritionStore((state) => state.updateConsumed);

  const handleVoiceLog = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setIsAnalyzing(true);

      try {
        const response = await fetch('/api/analyze-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: transcript })
        });

        if (!response.ok) throw new Error("Failed to analyze text");

        const data = await response.json();
        updateConsumed({
          calories: data.calories || 0,
          protein: data.protein || 0,
          carbs: data.carbs || 0,
          fat: data.fat || 0
        });

        alert(`Voice Logged ${data.foodName}: ${data.calories} kcal`);
      } catch (err) {
        console.error(err);
        alert('Voice analysis failed.');
      } finally {
        setIsAnalyzing(false);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="command-bar layer-2">
      <div className="command-logo">
        <Activity size={24} className="logo-icon" aria-hidden="true" />
        <span className="data-lg logo-text">MACRO-PILOT</span>
      </div>
      
      <div className="command-input-container">
        <Search className="command-icon" size={20} aria-hidden="true" />
        <input 
          type="text" 
          className="command-input body-main" 
          placeholder="Log food, enter command, or search telemetry..."
          aria-label="Command input"
        />
        <div className="command-shortcut label-caps">CTRL+K</div>
      </div>

      <div className="command-actions" style={{ display: 'flex', gap: '8px' }}>
        <CameraLog />
        <Button variant="secondary" onClick={handleVoiceLog} disabled={isAnalyzing || isListening} aria-label="Voice Log">
          {isAnalyzing ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Mic size={16} color={isListening ? 'red' : 'currentColor'} aria-hidden="true" />}
          {isListening ? 'LISTENING...' : 'VOICE LOG'}
        </Button>
        <NavLink to="/log" style={{ textDecoration: 'none' }}>
          <Button variant="primary" aria-label="Log Entry">
            <Plus size={16} aria-hidden="true" /> LOG ENTRY
          </Button>
        </NavLink>
      </div>
    </div>
  );
};
