'use client';

import React, { useState } from 'react';
import { usePython } from 'react-py';
import { Play } from 'lucide-react';

export const CodeSandbox = ({ initialCode }: { initialCode: string }) => {
  const [code, setCode] = useState(initialCode);
  const { runPython, stdout, stderr, isLoading, isRunning } = usePython();

  const handleRun = () => {
    runPython(code);
  };

  return (
    <div className="flex flex-col gap-4 w-full border-2 border-gray-200 rounded-xl p-4 bg-white shadow-sm">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-40 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-lg outline-none resize-none shadow-inner"
        spellCheck="false"
      />
      
      <button 
        onClick={handleRun}
        disabled={isLoading || isRunning}
        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-extrabold py-3 px-6 rounded-xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50"
      >
        <Play size={20} fill="currentColor" />
        {isLoading ? 'Loading Engine...' : isRunning ? 'Running...' : 'Run Code'}
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
