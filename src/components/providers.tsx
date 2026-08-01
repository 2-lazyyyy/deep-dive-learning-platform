'use client';
import { PythonProvider } from 'react-py';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <PythonProvider packages={{ micropip: ['pyodide-http'] }}>
      {children}
    </PythonProvider>
  );
};
