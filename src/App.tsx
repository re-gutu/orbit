import React, { useRef } from 'react';
import { BrandMark } from './components/BrandMark';
import { PrimaryNav } from './components/PrimaryNav';
import { SecurePill } from './components/SecurePill';
import { Wordmark } from './components/Wordmark';
import { FlowerMorph } from './components/FlowerMorph';
import { CornerCopy } from './components/CornerCopy';
import { MobileMenu } from './components/MobileMenu';
import { useEntranceAnim } from './hooks/useEntranceAnim';

export default function App() {
  const stageRef = useRef<HTMLElement>(null);
  const { onCornerAnimationEnd } = useEntranceAnim();

  return (
    <main className="viewport">
      <section className="stage" id="poster-stage" ref={stageRef}>
        <BrandMark />
        <PrimaryNav />
        <SecurePill />
        <Wordmark />
        <FlowerMorph stageRef={stageRef} />
        <CornerCopy onAnimationEnd={onCornerAnimationEnd} />
        <MobileMenu />
      </section>
    </main>
  );
}
