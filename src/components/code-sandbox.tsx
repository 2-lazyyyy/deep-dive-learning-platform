'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play } from 'lucide-react';

export const CodeSandbox = ({ initialCode }: { initialCode: string }) => {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [stdout, setStdout] = useState('');
  const [stderr, setStderr] = useState('');

  const handleRun = () => {
    setIsRunning(true);
    setStdout('');
    setStderr('');
    
    // Simulating submitting to FastAPI and polling for result
    console.log("POST /api/v1/submissions (mock)");
    
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      console.log(`GET /api/v1/submissions/sub_999 (mock poll attempt ${attempts})`);
      
      // Simulate completion after 2 polls (4 seconds)
      if (attempts >= 2) {
        clearInterval(interval);
        setStdout('Hello World\nMock execution completed successfully.');
        setIsRunning(false);
      }
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-4 w-full border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm">
      <div className="h-64 border rounded-lg overflow-hidden border-gray-300">
        <Editor
          height="100%"
          defaultLanguage="python"
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
      
      <button 
        onClick={handleRun}
        disabled={isRunning}
        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-extrabold py-3 px-6 rounded-xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50"
      >
        <Play size={20} fill="currentColor" />
        {isRunning ? 'Running (Polling...)' : 'Run Code'}
      </button>

      {(stdout || stderr) && (
        <div className="p-4 bg-gray-100 border-2 border-gray-200 rounded-xl mt-2 font-mono text-sm shadow-sm">
          <p className="text-gray-500 mb-2 font-bold uppercase text-xs tracking-wider">Console Output:</p>
          <pre className="text-gray-800 whitespace-pre-wrap">{stdout}</pre>
          <pre className="text-red-500 whitespace-pre-wrap">{stderr}</pre>
        </div>
      )}
    </div>
  );
};
