import React, { useState, useEffect } from 'react';
import { BookOpen, Type, Bold, Italic } from 'lucide-react';

interface BackstoryEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const BackstoryEditor: React.FC<BackstoryEditorProps> = ({ 
  value, 
  onChange, 
  disabled = false 
}) => {
  const [charCount, setCharCount] = useState(0);
  const [focused, setFocused] = useState(false);
  
  const MAX_CHARS = 2000;
  const MIN_CHARS = 50;

  useEffect(() => {
    setCharCount(value.length);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_CHARS) {
      onChange(newValue);
    }
  };

  const insertFormatting = (format: 'bold' | 'italic') => {
    const textarea = document.getElementById('backstory-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let formattedText = '';
    if (format === 'bold') {
      formattedText = `**${selectedText}**`;
    } else if (format === 'italic') {
      formattedText = `*${selectedText}*`;
    }

    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + (format === 'bold' ? 2 : 1),
        start + (format === 'bold' ? 2 : 1) + selectedText.length
      );
    }, 0);
  };

  const getCharCountColor = () => {
    if (charCount < MIN_CHARS) return 'text-amber-400';
    if (charCount > MAX_CHARS * 0.9) return 'text-red-400';
    return 'text-green-400';
  };

  const renderPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-sm font-medium text-slate-300">
          <BookOpen className="w-4 h-4" />
          <span>Character Backstory</span>
        </label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => insertFormatting('bold')}
            disabled={disabled}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/70 text-slate-300 hover:text-white transition-all duration-300 disabled:opacity-50"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('italic')}
            disabled={disabled}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/70 text-slate-300 hover:text-white transition-all duration-300 disabled:opacity-50"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={`relative border rounded-xl transition-all duration-300 ${
        focused 
          ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
          : 'border-slate-600 hover:border-slate-500'
      }`}>
        <textarea
          id="backstory-textarea"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder="Tell your character's story... Where did they come from? What drives them? What secrets do they carry? Use **bold** and *italic* for emphasis."
          className="w-full h-48 bg-slate-700/70 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-400 resize-none focus:outline-none focus:bg-slate-700 transition-all duration-300 backdrop-blur-sm"
          style={{ minHeight: '12rem' }}
        />
        
        <div className="absolute bottom-3 right-3 flex items-center space-x-3">
          <div className={`text-xs font-medium ${getCharCountColor()}`}>
            {charCount}/{MAX_CHARS}
          </div>
          {charCount < MIN_CHARS && (
            <div className="text-xs text-amber-400">
              {MIN_CHARS - charCount} more characters recommended
            </div>
          )}
        </div>
      </div>

      {value && (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center space-x-2">
            <Type className="w-4 h-4" />
            <span>Preview</span>
          </h4>
          <div 
            className="text-slate-200 text-sm leading-relaxed prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        </div>
      )}

      <div className="text-xs text-slate-400 space-y-1">
        <p>• Use **text** for bold and *text* for italic formatting</p>
        <p>• Minimum {MIN_CHARS} characters recommended for AI integration</p>
        <p>• Your backstory will be used by the AI Dungeon Master to create personalized adventures</p>
      </div>
    </div>
  );
};

export default BackstoryEditor;