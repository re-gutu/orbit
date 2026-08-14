import React from 'react';
import { COPY } from '../constants/poster';

interface SecurePillProps {
  className?: string;
  id?: string;
  onClick?: () => void;
}

export const SecurePill: React.FC<SecurePillProps> = ({
  className = 'secure-pill',
  id = 'secure-pill',
  onClick,
}) => {
  return (
    <a href="#secure" className={className} id={id} onClick={onClick}>
      {COPY.pill}
    </a>
  );
};
