import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { DataCard } from '../components/DataCard';
import { Button } from '../components/Button';

export const GroceryPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center', textAlign: 'center', paddingTop: '64px' }}>
      <ShoppingCart size={64} color="var(--primary-fixed)" aria-hidden="true" />
      
      <div>
        <h1 className="display-lg">Grocery & Prep</h1>
        <p className="body-large text-secondary" style={{ marginTop: '16px', maxWidth: '400px', margin: '16px auto' }}>
          Your algorithmic shopping list is currently empty. Start logging meals or run the predictive prep to generate your list.
        </p>
      </div>

      <DataCard title="PREDICTIVE PREP" style={{ width: '100%', marginTop: '32px', textAlign: 'left' }}>
        <p className="body-main" style={{ marginBottom: '24px' }}>
          Generate a shopping list based on your biological needs and current active mode.
        </p>
        <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
          GENERATE LIST
        </Button>
      </DataCard>
    </div>
  );
};
