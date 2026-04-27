import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { LoggingPortalPage } from './pages/LoggingPortalPage';
import './App.css';

// Code split heavier secondary pages
const IntelligencePage = React.lazy(() => import('./pages/IntelligencePage').then(module => ({ default: module.IntelligencePage })));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const GroceryPage = React.lazy(() => import('./pages/GroceryPage').then(module => ({ default: module.GroceryPage })));
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="log" element={<LoggingPortalPage />} />
          <Route path="intelligence" element={
            <Suspense fallback={<div style={{ padding: '24px', color: 'var(--primary-fixed)' }}>Loading Intelligence Engine...</div>}>
              <IntelligencePage />
            </Suspense>
          } />
          <Route path="settings" element={
            <Suspense fallback={<div style={{ padding: '24px', color: 'var(--primary-fixed)' }}>Loading Settings...</div>}>
              <SettingsPage />
            </Suspense>
          } />
          <Route path="grocery" element={
            <Suspense fallback={<div style={{ padding: '24px', color: 'var(--primary-fixed)' }}>Loading Grocery AI...</div>}>
              <GroceryPage />
            </Suspense>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
