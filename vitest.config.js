// src/test/setup.ts

/**
 * Global test setup for Vitest
 * - Compatible with Vitest v4
 * - Compatible with React Testing Library
 * - Works with `globals: false`
 * - No global fake timers (must be enabled per-test if needed)
 */

import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

/**
 * Cleanup the DOM after each test to avoid side effects
 */
afterEach(() => {
  cleanup();
});