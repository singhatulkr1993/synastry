'use client';

import { useEffect } from 'react';

/**
 * CSS Health Check
 *
 * Monitors whether styles are properly loaded and applied.
 * Unregisters service workers that might serve stale CSS.
 * Logs warnings if CSS variables or styles are missing.
 */
export function CSSHealthCheck() {
  useEffect(() => {
    // First: Unregister any service workers that might cache old CSS
    const unregisterServiceWorkers = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
            console.log('[CSS Health] Unregistered stale service worker');
          }
        } catch (error) {
          // Service workers might not be supported or accessible
        }
      }
    };

    const runHealthCheck = () => {
      const checks = [];

      // Check 1: Verify CSS custom properties are available
      const testVar = '--syn-bg';
      const testElement = document.createElement('div');
      testElement.style.setProperty('color', `var(${testVar})`);
      const computed = getComputedStyle(testElement).color;

      if (computed === 'rgba(0, 0, 0, 0)' || computed === '') {
        checks.push(`❌ CSS variable ${testVar} not available`);
      } else {
        checks.push(`✓ CSS variable ${testVar} working`);
      }

      // Check 2: Verify a Tailwind utility class exists in the stylesheet
      const testEl = document.createElement('div');
      testEl.className = 'min-h-screen';
      document.body.appendChild(testEl);
      const styles = getComputedStyle(testEl);
      const minHeight = styles.minHeight;
      document.body.removeChild(testEl);

      if (minHeight === 'auto' || minHeight === '0px') {
        checks.push('❌ Tailwind utilities not applied');
      } else {
        checks.push('✓ Tailwind utilities working');
      }

      // Check 3: Check if globals.css is loaded
      const stylesheets = Array.from(document.styleSheets);
      const hasGlobals = stylesheets.some(sheet => {
        try {
          return sheet.href && sheet.href.includes('globals.css');
        } catch (e) {
          return false; // CORS restriction
        }
      });

      if (hasGlobals) {
        checks.push('✓ globals.css loaded');
      } else {
        checks.push('❌ globals.css not found');
      }

      // Log results in development
      if (process.env.NODE_ENV === 'development') {
        console.group('🎨 CSS Health Check');
        checks.forEach(msg => console.log(msg));
        console.groupEnd();

        const failures = checks.filter(msg => msg.startsWith('❌'));
        if (failures.length > 0) {
          console.warn('%c⚠️  Styles may not be loading correctly!',
            'color: #f59e0b; font-weight: bold; font-size: 14px;');
          console.log('🔧 Quick fixes (try in order):');
          console.log('   1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R');
          console.log('   2. Clear Next cache: npm run clean');
          console.log('   3. Restart dev server: npm run dev:fresh');
          console.log('   4. Check console above for specific errors');
        }
      }
    };

    // Run immediately after unregistering service workers
    unregisterServiceWorkers().then(() => {
      // Run after a short delay to ensure stylesheets are loaded
      const timer = setTimeout(runHealthCheck, 1000);

      // Also run on visibility change (when user returns to tab)
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          setTimeout(runHealthCheck, 500);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    });
  }, []);

  return null;
}
