import React from 'react';
import { NAV_ITEMS } from '../constants/poster';

export const PrimaryNav: React.FC = () => {
  return (
    <nav className="primary-nav" aria-label="Main Navigation">
      <ul>
        {NAV_ITEMS.map((item) => (
          <li key={item.id} style={{ left: item.leftDesktop }}>
            <a href={item.href} className="nav-link" id={item.id}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
