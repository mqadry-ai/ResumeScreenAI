import { useState } from 'react';
import { JobProfile } from '../types';
import { Save, Plus, Trash2, Check } from 'lucide-react';

interface Props {
  profiles: JobProfile[];
  activeProfileId: string | null;
  onSelect: (id: string) => void;
  onSave: (name: string) => void;
  onUpdate: () => void;
  onDelete: (id: string) => void;
  hasChanges: boolean;
}

export function ProfileManager({ profiles, activeProfileId, onSelect, onSave, onUpdate, onDelete }: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  const handleSaveNew = () => {
    if (newProfileName.trim()) {
      onSave(newProfileName.trim());
      setNewProfileName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Job Profiles</h2>
        <button 
          onClick={() => setIsCreating(true)}
          className="text-sm flex items-center gap-1.5 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium cursor-pointer transition-colors px-2 py-1 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-500/10"
        >
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      {isCreating && (
        <div className="flex items-center gap-2 mb-6 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          <input 
            type="text"
            value={newProfileName}
            onChange={e => setNewProfileName(e.target.value)}
            placeholder="e.g. Senior Frontend"
            className="flex-1 text-sm bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleSaveNew()}
          />
          <button onClick={handleSaveNew} className="p-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors shadow-sm cursor-pointer">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={() => setIsCreating(false)} className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer">
            Cancel
          </button>
        </div>
      )}

      <div className="space-y-2.5">
        {profiles.length === 0 && !isCreating && (
          <div className="text-center py-6 px-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">No profiles saved yet.</p>
          </div>
        )}
        {profiles.map(profile => (
          <div 
            key={profile.id}
            className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
              activeProfileId === profile.id 
                ? 'border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 shadow-sm' 
                : 'border-slate-200 dark:border-slate-700/60 hover:border-violet-300 dark:hover:border-violet-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
            onClick={() => onSelect(profile.id)}
          >
            <span className={`font-medium text-sm truncate pr-2 transition-colors ${
              activeProfileId === profile.id ? 'text-violet-900 dark:text-violet-100' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
            }`}>
              {profile.name}
            </span>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {activeProfileId === profile.id && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onUpdate(); }}
                  className="p-1.5 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-500/20 rounded-lg transition-colors cursor-pointer"
                  title="Update profile with current requirements"
                >
                  <Save className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(profile.id); }}
                className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                title="Delete profile"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
