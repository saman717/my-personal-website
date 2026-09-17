'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPathRef = useRef<string>('');

  const currentPath = pathname + searchParams.toString();

  useEffect(() => {
    if (prevPathRef.current && prevPathRef.current !== currentPath) {
      // Navigation completed — finish the bar
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 400);
    }
    prevPathRef.current = currentPath;
  }, [currentPath]);

  // We can't easily intercept the start of navigation in App Router Server Components.
  // Instead, we add a click handler on links to trigger the bar.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Only trigger for internal links that are not anchors or external
      const isInternal =
        href.startsWith('/') ||
        href.startsWith(window.location.origin);
      const isAnchor = href.startsWith('#');
      const isExternal = target.getAttribute('target') === '_blank';

      if (!isInternal || isAnchor || isExternal) return;

      // Don't trigger if already on the same path
      const targetPath = href.split('?')[0];
      if (targetPath === window.location.pathname && href === window.location.href) return;

      // Start the progress bar
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);

      setProgress(0);
      setVisible(true);

      let p = 0;
      intervalRef.current = setInterval(() => {
        p += Math.random() * 12 + 3;
        if (p >= 85) {
          p = 85;
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
        setProgress(p);
      }, 150);
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: '3px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          transition: progress === 100 ? 'width 0.15s ease, opacity 0.3s ease' : 'width 0.2s ease',
          opacity: progress === 100 ? 0 : 1,
          background: 'linear-gradient(90deg, #a855f7, #7c3aed, #6366f1)',
          boxShadow: '0 0 10px rgba(168, 85, 247, 0.6)',
          borderRadius: '0 4px 4px 0',
        }}
      />
    </div>
  );
}
