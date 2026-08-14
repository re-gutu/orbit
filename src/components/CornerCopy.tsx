import React from 'react';
import { COPY } from '../constants/poster';

interface CornerCopyProps {
  onAnimationEnd?: () => void;
}

export const CornerCopy: React.FC<CornerCopyProps> = ({ onAnimationEnd }) => {
  return (
    <>
      <div className="support-copy support-copy--left" id="copy-left">
        <div className="support-copy__inner">
          {COPY.left.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i === 0 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="support-copy support-copy--right" id="copy-right">
        <div className="support-copy__inner" onAnimationEnd={onAnimationEnd}>
          {COPY.right.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i === 0 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};
