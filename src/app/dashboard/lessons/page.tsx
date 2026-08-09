'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function SyllabusBuilder() {
  const [units, setUnits] = useState([{ id: 1, title: 'Unit 1: Python Basics' }]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Syllabus Builder</h1>
        <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={20} />
          Add Unit
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {units.map((unit) => (
          <div key={unit.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">{unit.title}</h2>
            <div className="mt-4 flex flex-col gap-2 pl-4 border-l-2 border-gray-100">
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                <Plus size={16} /> Add Module
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
