import React from 'react';

export const Wordmark: React.FC = () => {
  return (
    <h1 className="orbit-word" id="orbit-title" aria-label="Orbit">
      <span className="orbit-word__mask">
        <span className="orbit-word__inner">
          <span className="orbit-word__white">
            <span className="orbit-word__o">O</span>R
          </span>
          <span className="orbit-word__pink">BIT</span>
        </span>
      </span>
    </h1>
  );
};
