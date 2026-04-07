import React, { useCallback, useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface Props {
  onFilesSelected: (files: File[]) => void;
}

export function FileUpload({ onFilesSelected }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type === 'application/pdf' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'text/plain'
      ) as File[];
      if (files.length > 0) {
        onFilesSelected(files);
      } else {
        alert('Please upload PDF, DOCX, or TXT files.');
      }
    }
  }, [onFilesSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      onFilesSelected(files);
      e.target.value = '';
    }
  };

  return (
    <div 
      className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
        isDragging 
          ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-900/10 scale-[0.99]' 
          : 'border-slate-300 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-slate-50 dark:hover:bg-slate-800/30'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className={`mx-auto w-12 h-12 mb-3 rounded-full flex items-center justify-center transition-colors duration-300 ${
        isDragging ? 'bg-violet-100 dark:bg-violet-500/20' : 'bg-slate-100 dark:bg-slate-800'
      }`}>
        <UploadCloud className={`w-6 h-6 transition-colors duration-300 ${
          isDragging ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'
        }`} />
      </div>
      
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
        {isDragging ? 'Drop files now' : 'Drag & drop CVs here'}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-xs mx-auto">
        Supports PDF, DOCX, and TXT files. You can upload multiple files at once.
      </p>
      
      <label className="relative inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 cursor-pointer transition-all active:scale-95 shadow-sm hover:shadow">
        Browse Files
        <input 
          type="file" 
          className="hidden" 
          multiple 
          accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
