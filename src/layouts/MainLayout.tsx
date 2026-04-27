import React from 'react';
import { Outlet } from 'react-router-dom';
import { CommandBar } from '../components/CommandBar';
import { Sidebar } from './Sidebar';
import { useHealthSync } from '../hooks/useHealthSync';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  useHealthSync(); // Keeps health sync active globally

  return (
    <div className="layer-0 min-h-screen layout-container">
      <CommandBar />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
