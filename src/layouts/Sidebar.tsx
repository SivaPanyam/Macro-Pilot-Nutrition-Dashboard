import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileEdit, BrainCircuit, Settings, ShoppingCart } from 'lucide-react';
import './Sidebar.css';

export const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/log', label: 'Logging Portal', icon: FileEdit },
    { path: '/intelligence', label: 'Intelligence', icon: BrainCircuit },
    { path: '/grocery', label: 'Grocery & Prep', icon: ShoppingCart },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar layer-1">
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} aria-hidden="true" />
              <span className="label-caps">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
