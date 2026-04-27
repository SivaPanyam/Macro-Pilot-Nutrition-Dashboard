import React, { useState } from 'react';
import { ShoppingCart, Loader2, CheckCircle2 } from 'lucide-react';
import { DataCard } from '../components/DataCard';
import { Button } from '../components/Button';
import { useNutritionStore } from '../store/nutritionStore';

export const GroceryPage: React.FC = () => {
  const mode = useNutritionStore((state) => state.mode);
  const [isGenerating, setIsGenerating] = useState(false);
  const [groceryList, setGroceryList] = useState<{ category: string, items: string[] }[] | null>(null);

  const handleGenerateList = () => {
    setIsGenerating(true);
    
    // Simulate algorithmic generation delay
    setTimeout(() => {
      let list = [];
      if (mode === 'Athlete') {
        list = [
          { category: 'Proteins', items: ['Chicken Breast (2 lbs)', 'Whey Protein Isolate', 'Greek Yogurt', 'Lean Ground Beef'] },
          { category: 'Carbs', items: ['Sweet Potatoes', 'Rolled Oats', 'Jasmine Rice', 'Bananas'] },
          { category: 'Fats', items: ['Almond Butter', 'Olive Oil', 'Avocados'] }
        ];
      } else if (mode === 'Strict') {
        list = [
          { category: 'Proteins', items: ['Egg Whites (3 cartons)', 'White Fish (1.5 lbs)', 'Chicken Breast (2 lbs)'] },
          { category: 'Carbs', items: ['Broccoli', 'Spinach', 'Cauliflower Rice'] },
          { category: 'Fats', items: ['Macadamia Nuts', 'Avocado Oil'] }
        ];
      } else {
        list = [
          { category: 'Proteins', items: ['Salmon (1 lb)', 'Tofu', 'Eggs (1 dozen)'] },
          { category: 'Carbs', items: ['Brown Rice', 'Quinoa', 'Mixed Berries', 'Apples'] },
          { category: 'Fats', items: ['Mixed Nuts', 'Olive Oil'] }
        ];
      }
      
      setGroceryList(list);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center', textAlign: 'center', paddingTop: '64px', paddingBottom: '64px' }}>
      <ShoppingCart size={64} color="var(--primary-fixed)" aria-hidden="true" />
      
      <div>
        <h1 className="display-lg">Grocery & Prep</h1>
        <p className="body-large text-secondary" style={{ marginTop: '16px', maxWidth: '400px', margin: '16px auto' }}>
          {groceryList 
            ? `Here is your optimized shopping list for the ${mode} plan.` 
            : `Your algorithmic shopping list is currently empty. Start logging meals or run the predictive prep to generate your list.`}
        </p>
      </div>

      {!groceryList ? (
        <DataCard title="PREDICTIVE PREP" style={{ width: '100%', marginTop: '32px', textAlign: 'left' }}>
          <p className="body-main" style={{ marginBottom: '24px' }}>
            Generate a shopping list based on your biological needs and current active mode ({mode}).
          </p>
          <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleGenerateList} disabled={isGenerating}>
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : null}
            {isGenerating ? 'GENERATING ALGORITHMIC LIST...' : 'GENERATE LIST'}
          </Button>
        </DataCard>
      ) : (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
          {groceryList.map((categoryGroup, index) => (
            <DataCard key={index} title={categoryGroup.category.toUpperCase()}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {categoryGroup.items.map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px' }}>
                    <CheckCircle2 size={18} color="var(--primary-fixed)" />
                    {item}
                  </li>
                ))}
              </ul>
            </DataCard>
          ))}
          <Button variant="secondary" onClick={() => setGroceryList(null)} style={{ marginTop: '16px', alignSelf: 'center' }}>
            RESET LIST
          </Button>
        </div>
      )}
    </div>
  );
};
