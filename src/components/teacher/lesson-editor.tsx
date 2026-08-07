import { useState } from 'react';
import { Lesson, ContentBlock } from '@/types';
import { motion } from 'framer-motion';
import { Save, X, Plus, Trash2, FileText, Code } from 'lucide-react';

interface LessonEditorProps {
  lesson: any; 
  onSave: (updatedLesson: any) => void;
  onCancel: () => void;
}

export function LessonEditor({ lesson, onSave, onCancel }: LessonEditorProps) {
  const [formData, setFormData] = useState<any>(JSON.parse(JSON.stringify(lesson)));

  const handleBlockChange = (index: number, field: string, value: string) => {
    const newBlocks = [...formData.contentBlocks];
    newBlocks[index] = { ...newBlocks[index], [field]: value };
    setFormData({ ...formData, contentBlocks: newBlocks });
  };

  const handleAddBlock = (type: string) => {
    const newBlocks = [...formData.contentBlocks, { type, content: '' }];
    setFormData({ ...formData, contentBlocks: newBlocks });
  };

  const handleRemoveBlock = (index: number) => {
    const newBlocks = [...formData.contentBlocks];
    newBlocks.splice(index, 1);
    setFormData({ ...formData, contentBlocks: newBlocks });
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-[#1C1D2033] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b-2 border-[#1C1D2033] bg-[#F8F8F8] flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-[#1C1D20]">Edit Lesson</h2>
        <div className="flex gap-2">
          <button 
            onClick={onCancel}
            className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-[#1C1D20] hover:bg-[#1C1D2033] rounded-xl transition"
          >
            <X size={16} /> Cancel
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-white bg-[#0ba2b3] hover:bg-[#1e91a3] rounded-xl border-b-4 border-[#1e91a3] active:border-b-0 active:translate-y-1 transition"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#1C1D20] uppercase tracking-wider mb-2">Title</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border-2 border-[#1C1D2033] rounded-xl p-3 font-bold text-[#1C1D20] focus:border-[#0ba2b3] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#1C1D20] uppercase tracking-wider mb-2">XP Reward</label>
            <input 
              type="number" 
              value={formData.xpReward} 
              onChange={(e) => setFormData({...formData, xpReward: parseInt(e.target.value)})}
              className="w-full border-2 border-[#1C1D2033] rounded-xl p-3 font-bold text-[#1C1D20] focus:border-[#0ba2b3] outline-none"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-bold text-[#1C1D20] uppercase tracking-wider mb-2">Lesson Type</label>
            <select 
              value={formData.lessonType} 
              onChange={(e) => setFormData({...formData, lessonType: e.target.value})}
              className="w-full border-2 border-[#1C1D2033] rounded-xl p-3 font-bold text-[#1C1D20] focus:border-[#0ba2b3] outline-none bg-white cursor-pointer"
            >
              <option value="code_fix">Code Fix</option>
              <option value="fill_blanks">Fill Blanks</option>
              <option value="multiple_choice">Multiple Choice</option>
            </select>
          </div>
        </div>

        {/* Content Blocks */}
        <div>
          <label className="block text-xs font-bold text-[#1C1D20] uppercase tracking-wider mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2"><FileText size={16} /> Content Blocks</span>
            <div className="flex gap-2">
              <button onClick={() => handleAddBlock('text')} className="text-[#0ba2b3] hover:bg-[#F0F8FF] px-2 py-1 rounded text-xs">+ Text</button>
              <button onClick={() => handleAddBlock('code')} className="text-[#0ba2b3] hover:bg-[#F0F8FF] px-2 py-1 rounded text-xs">+ Code</button>
              <button onClick={() => handleAddBlock('image')} className="text-[#0ba2b3] hover:bg-[#F4EAF9] px-2 py-1 rounded text-xs">+ Image</button>
              <button onClick={() => handleAddBlock('video')} className="text-[#FF9600] hover:bg-[#FFF4E5] px-2 py-1 rounded text-xs">+ Video</button>
            </div>
          </label>
          
          <div className="space-y-4">
            {formData.contentBlocks.map((block: ContentBlock, idx: number) => (
              <div key={idx} className="border-2 border-[#1C1D2033] rounded-xl p-4 relative group">
                <button 
                  onClick={() => handleRemoveBlock(idx)}
                  className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 size={16} />
                </button>
                <div className="flex gap-2 mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0ba2b3] bg-[#F4EAF9] px-2 py-0.5 rounded-full">
                    {block.type}
                  </span>
                </div>
                {(block.type === 'image' || block.type === 'video') ? (
                  <div className="space-y-2 mb-2 bg-white border-2 border-[#1C1D2033] p-3 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-[#1C1D20] mb-2">Upload File (Max 2MB)</p>
                      <input
                        type="file"
                        accept={block.type === 'image' ? 'image/*' : 'video/*'}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              alert('File is too large! Please select a file smaller than 2MB to prevent browser storage limits.');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              handleBlockChange(idx, 'content', reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-sm font-semibold text-[#1C1D20] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#0ba2b3] file:text-white hover:file:bg-[#1e91a3] file:cursor-pointer"
                      />
                    </div>
                    
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-[#1C1D2033]"></div>
                      <span className="flex-shrink-0 mx-4 text-[#1C1D20] text-xs font-bold">OR USE LINK</span>
                      <div className="flex-grow border-t border-[#1C1D2033]"></div>
                    </div>

                    <textarea
                      value={block.content}
                      onChange={(e) => handleBlockChange(idx, 'content', e.target.value)}
                      placeholder={block.type === 'image' ? 'Enter Image URL...' : 'Enter YouTube/Video URL...'}
                      className="w-full border-2 border-[#F8F8F8] bg-[#F8F8F8] rounded-xl p-3 text-sm font-semibold text-[#1C1D20] focus:border-[#1C1D2033] focus:bg-white outline-none min-h-[60px]"
                    />
                  </div>
                ) : (
                  <textarea
                    value={block.content}
                    onChange={(e) => handleBlockChange(idx, 'content', e.target.value)}
                    placeholder={`Enter ${block.type} content...`}
                    className="w-full border-2 border-[#F8F8F8] bg-[#F8F8F8] rounded-xl p-3 text-sm font-semibold text-[#1C1D20] focus:border-[#1C1D2033] focus:bg-white outline-none min-h-[80px] mb-2"
                  />
                )}
                {(block.type === 'image' || block.type === 'video') && (
                  <input
                    type="text"
                    value={block.caption || ''}
                    onChange={(e) => handleBlockChange(idx, 'caption', e.target.value)}
                    placeholder="Enter caption (optional)..."
                    className="w-full border-2 border-[#F8F8F8] bg-[#F8F8F8] rounded-xl p-3 text-sm font-semibold text-[#1C1D20] focus:border-[#1C1D2033] focus:bg-white outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Exercise Specific Data */}
        <div className="pt-4 border-t-2 border-[#1C1D2033]">
          <label className="block text-xs font-bold text-[#1C1D20] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Code size={16} /> Exercise Configuration
          </label>
          
          {formData.lessonType === 'code_fix' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#1C1D20] mb-1">Initial Code</label>
                <textarea 
                  value={formData.initialCode || ''} 
                  onChange={(e) => setFormData({...formData, initialCode: e.target.value})}
                  className="w-full bg-gray-900 text-green-400 p-4 rounded-xl text-sm font-mono outline-none min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#1C1D20] mb-1">Expected Output (Exact match)</label>
                <textarea 
                  value={formData.expectedOutput || ''} 
                  onChange={(e) => setFormData({...formData, expectedOutput: e.target.value})}
                  className="w-full bg-[#E8F5E9] text-[#2E7D32] border border-green-200 p-4 rounded-xl text-sm font-mono outline-none"
                />
              </div>
            </div>
          )}

          {formData.lessonType === 'multiple_choice' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#1C1D20] mb-1">Question text</label>
                <textarea 
                  value={formData.question || ''} 
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  className="w-full bg-[#F8F8F8] border-2 border-[#1C1D2033] p-4 rounded-xl text-sm font-semibold outline-none focus:bg-white min-h-[80px]"
                  placeholder="e.g. Which keyword declares a constant?"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#1C1D20] mb-1">Options (one per line)</label>
                <textarea 
                  value={(formData.options || []).join('\n')} 
                  onChange={(e) => setFormData({...formData, options: e.target.value.split('\n')})}
                  className="w-full bg-[#F8F8F8] border-2 border-[#1C1D2033] p-4 rounded-xl text-sm font-semibold outline-none focus:bg-white min-h-[100px]"
                  placeholder="var&#10;let&#10;const"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#1C1D20] mb-1">Correct Option Index (0-based)</label>
                <input 
                  type="number"
                  min="0"
                  value={formData.correctIndex ?? 0}
                  onChange={(e) => setFormData({...formData, correctIndex: parseInt(e.target.value) || 0})}
                  className="w-full border-2 border-[#1C1D2033] rounded-xl p-3 font-bold outline-none"
                />
              </div>
            </div>
          )}

          {formData.lessonType === 'fill_blanks' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#1C1D20] mb-1">Code Template (use _BLANK_)</label>
                <textarea 
                  value={(formData.codeTemplate || []).join('\n')} 
                  onChange={(e) => setFormData({...formData, codeTemplate: e.target.value.split('\n')})}
                  className="w-full bg-gray-900 text-green-400 p-4 rounded-xl text-sm font-mono outline-none min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#1C1D20] mb-1">Correct Tokens (comma separated)</label>
                <input 
                  value={(formData.correctTokens || []).join(', ')} 
                  onChange={(e) => setFormData({...formData, correctTokens: e.target.value.split(',').map((s: string) => s.trim())})}
                  className="w-full border-2 border-[#1C1D2033] rounded-xl p-3 font-bold outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#1C1D20] mb-1">Token Pool (comma separated)</label>
                <input 
                  value={(formData.tokenPool || []).join(', ')} 
                  onChange={(e) => setFormData({...formData, tokenPool: e.target.value.split(',').map((s: string) => s.trim())})}
                  className="w-full border-2 border-[#1C1D2033] rounded-xl p-3 font-bold outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
