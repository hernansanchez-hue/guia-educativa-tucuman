'use client';

import {useEffect, useRef, useState} from 'react';

// Share one visibility contract between autoplay media and the city slider.
export default function useViewportActivity({rootMargin = '0px', reducedMotion = false} = {}) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let intersecting = false;
    const update = () => {
      const enabled = intersecting && !document.hidden && !(reducedMotion && motion.matches);
      setActive(enabled);
      if (intersecting) setSeen(true);
    };
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      update();
    }, {rootMargin});
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    motion.addEventListener('change', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
      motion.removeEventListener('change', update);
    };
  }, [rootMargin, reducedMotion]);

  return {ref, active, seen};
}
