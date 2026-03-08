'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from './ThemeContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
