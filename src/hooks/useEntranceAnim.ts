import { useEffect, useCallback } from 'react';

export function useEntranceAnim() {
  const cleanAnim = useCallback(() => {
    document.documentElement.classList.remove('anim');
  }, []);

  useEffect(() => {
    // Safety timer to ensure anim class is removed even if animation events are skipped
    const timer = setTimeout(cleanAnim, 6000);
    return () => clearTimeout(timer);
  }, [cleanAnim]);

  return { onCornerAnimationEnd: cleanAnim };
}
