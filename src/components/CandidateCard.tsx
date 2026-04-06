import { CandidateResult } from '../types';
import { CheckCircle2, XCircle, Loader2, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  result: CandidateResult;
}

export function CandidateCard({ result }: Props) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30';
    if (score >= 60) return 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 border-amber-200 dark:border-amber-500/30';
    return 'text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-500/20 border-rose-200 dark:border-rose-500/30';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-800 p-6 flex flex-col h-full transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-5">
        <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate mb-1.5">
            {result.status === 'success' ? result.name : result.fileName}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 w-fit px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700/50">
            <FileText className="w-3.5 h-3.5" />
            <span className="truncate max-w-[180px]">{result.fileName}</span>
          </div>
        </div>
        
        {result.status === 'success' && (
          <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 shadow-sm ${getScoreColor(result.score)}`}>
            <span className="text-lg font-bold leading-none">{result.score}</span>
          </div>
        )}
        {result.status === 'analyzing' && (
          <div className="w-14 h-14 flex items-center justify-center bg-violet-50 dark:bg-violet-500/10 rounded-full">
            <Loader2 className="w-6 h-6 text-violet-600 dark:text-violet-400 animate-spin" />
          </div>
        )}
        {result.status === 'pending' && (
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-700" />
        )}
        {result.status === 'error' && (
          <div className="w-14 h-14 flex items-center justify-center bg-rose-50 dark:bg-rose-500/10 rounded-full">
            <XCircle className="w-6 h-6 text-rose-500 dark:text-rose-400" />
          </div>
        )}
      </div>

      {result.status === 'success' && (
        <div className="flex-1 flex flex-col gap-5">
          <div>
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Key Strengths</h4>
            <ul className="space-y-2.5">
              {result.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Summary</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {result.summary}
            </p>
          </div>
        </div>
      )}

      {result.status === 'error' && (
        <div className="text-sm text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 p-4 rounded-xl mt-2">
          <p className="font-medium mb-1">Analysis Failed</p>
          <p className="opacity-90">{result.errorMessage}</p>
        </div>
      )}
      
      {result.status === 'analyzing' && (
        <div className="flex-1 flex flex-col items-center justify-center text-sm text-slate-500 dark:text-slate-400 py-8 gap-3">
          <div className="w-32 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 w-1/2 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
          </div>
          Analyzing candidate profile...
        </div>
      )}
    </motion.div>
  );
}
