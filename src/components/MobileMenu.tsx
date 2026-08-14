import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NAV_ITEMS } from '../constants/poster';
import { SecurePill } from './SecurePill';

export const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLElement>(null);

  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Keyboard navigation & Focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
        burgerRef.current?.focus();
      } else if (e.key === 'Tab') {
        if (!sheetRef.current) return;
        const focusableEls = [
          burgerRef.current,
          ...Array.from(sheetRef.current.querySelectorAll<HTMLElement>('a, button, [tabindex="0"]')),
        ].filter(Boolean) as HTMLElement[];

        if (focusableEls.length === 0) return;
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeMenu]);

  return (
    <>
      <button
        ref={burgerRef}
        className="mobile-burger"
        id="burger-btn"
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-sheet"
        onClick={toggleMenu}
      >
        <span className="burger-icon" aria-hidden="true">
          <span className="burger-bar" />
          <span className="burger-bar" />
        </span>
      </button>

      <div
        className={`scrim ${isOpen ? 'is-open' : ''}`}
        id="mobile-scrim"
        aria-hidden={!isOpen}
        onClick={closeMenu}
      />

      <aside
        ref={sheetRef}
        className={`mobile-sheet ${isOpen ? 'is-open' : ''}`}
        id="mobile-sheet"
        aria-hidden={!isOpen}
        inert={!isOpen ? true : undefined}
      >
        <nav className="mobile-nav" aria-label="Mobile Navigation">
          <ul className="mobile-nav__list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="mobile-nav__link"
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <SecurePill
            className="mobile-secure-pill"
            id="mobile-secure-pill"
            onClick={closeMenu}
          />
        </nav>
      </aside>
    </>
  );
};
