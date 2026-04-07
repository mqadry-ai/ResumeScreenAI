import { JobProfile } from '../types';

interface Props {
  requirements: Omit<JobProfile, 'id' | 'name'>;
  onChange: (req: Omit<JobProfile, 'id' | 'name'>) => void;
}

export function RequirementsForm({ requirements, onChange }: Props) {
  const handleChange = (field: keyof typeof requirements, value: string | number) => {
    onChange({ ...requirements, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
      <h2 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white">Job Requirements</h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Field / Role</label>
          <input 
            type="text"
            value={requirements.field}
            onChange={e => handleChange('field', e.target.value)}
            placeholder="e.g. Software Engineering, Marketing"
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Required Experience</label>
          <div className="flex gap-4">
            <input 
              type="text"
              value={requirements.experience}
              onChange={e => handleChange('experience', e.target.value)}
              placeholder="e.g. 3-5 years, Senior level"
              className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
            />
            <input 
              type="number"
              value={requirements.weightExperience}
              onChange={e => handleChange('weightExperience', parseInt(e.target.value))}
              placeholder="Weight (0-10)"
              className="w-24 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Required Skills</label>
          <div className="flex gap-4">
            <textarea 
              value={requirements.skills}
              onChange={e => handleChange('skills', e.target.value)}
              placeholder="e.g. React, Node.js, Project Management"
              rows={3}
              className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all resize-none"
            />
            <input 
              type="number"
              value={requirements.weightSkills}
              onChange={e => handleChange('weightSkills', parseInt(e.target.value))}
              placeholder="Weight (0-10)"
              className="w-24 h-[100px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Other Requirements</label>
          <textarea 
            value={requirements.otherRequirements}
            onChange={e => handleChange('otherRequirements', e.target.value)}
            placeholder="e.g. Willing to relocate, Bilingual"
            rows={2}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}
