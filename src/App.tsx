/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { JobProfile, CandidateResult } from './types';
import { ProfileManager } from './components/ProfileManager';
import { RequirementsForm } from './components/RequirementsForm';
import { FileUpload } from './components/FileUpload';
import { CandidateCard } from './components/CandidateCard';
import { analyzeCV } from './services/geminiService';
import { Briefcase, Users, FileText, Moon, Sun } from 'lucide-react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profiles, setProfiles] = useState<JobProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [currentRequirements, setCurrentRequirements] = useState({
    field: '',
    experience: '',
    skills: '',
    otherRequirements: ''
  });
  const [results, setResults] = useState<CandidateResult[]>([]);

  // Load profiles from local storage
  useEffect(() => {
    const saved = localStorage.getItem('hr-profiles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfiles(parsed);
        if (parsed.length > 0) {
          setActiveProfileId(parsed[0].id);
          setCurrentRequirements(parsed[0]);
        }
      } catch (e) {
        console.error('Failed to parse profiles', e);
      }
    }
  }, []);

  // Save profiles to local storage
  useEffect(() => {
    localStorage.setItem('hr-profiles', JSON.stringify(profiles));
  }, [profiles]);

  // Handle dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleProfileSelect = (id: string) => {
    setActiveProfileId(id);
    const profile = profiles.find(p => p.id === id);
    if (profile) {
      setCurrentRequirements({
        field: profile.field,
        experience: profile.experience,
        skills: profile.skills,
        otherRequirements: profile.otherRequirements
      });
    }
  };

  const handleSaveProfile = (name: string) => {
    const newProfile: JobProfile = {
      id: crypto.randomUUID(),
      name,
      ...currentRequirements
    };
    setProfiles([...profiles, newProfile]);
    setActiveProfileId(newProfile.id);
  };

  const handleUpdateProfile = () => {
    if (!activeProfileId) return;
    setProfiles(profiles.map(p => p.id === activeProfileId ? { ...p, ...currentRequirements } : p));
  };

  const handleDeleteProfile = (id: string) => {
    const newProfiles = profiles.filter(p => p.id !== id);
    setProfiles(newProfiles);
    if (activeProfileId === id) {
      setActiveProfileId(newProfiles.length > 0 ? newProfiles[0].id : null);
      if (newProfiles.length > 0) {
        setCurrentRequirements(newProfiles[0]);
      } else {
        setCurrentRequirements({ field: '', experience: '', skills: '', otherRequirements: '' });
      }
    }
  };

  const handleFilesSelected = async (files: File[]) => {
    if (!activeProfileId) {
      alert('Please select or create a job profile first.');
      return;
    }

    const newResults: CandidateResult[] = files.map(file => ({
      id: crypto.randomUUID(),
      profileId: activeProfileId,
      fileName: file.name,
      name: 'Analyzing...',
      score: 0,
      strengths: [],
      summary: '',
      status: 'pending',
      file: file
    }));

    setResults(prev => [...newResults, ...prev]);
    
    // Process files
    for (const result of newResults) {
      setResults(prev => prev.map(r => r.id === result.id ? { ...r, status: 'analyzing' } : r));
      
      try {
        const fileBase64 = await fileToBase64(result.file as File);
        const mimeType = (result.file as File).type || 'application/pdf';
        
        const analysis = await analyzeCV(fileBase64, mimeType, currentRequirements);
        
        setResults(prev => prev.map(r => r.id === result.id ? {
          ...r,
          status: 'success',
          name: analysis.name,
          score: analysis.score,
          strengths: analysis.strengths,
          summary: analysis.summary
        } : r));
      } catch (error: any) {
        setResults(prev => prev.map(r => r.id === result.id ? {
          ...r,
          status: 'error',
          errorMessage: error.message || 'Failed to analyze CV'
        } : r));
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let encoded = reader.result?.toString().replace(/^data:(.*,)?/, '');
        if ((encoded?.length ?? 0) % 4 > 0) {
          encoded += '='.repeat(4 - (encoded?.length ?? 0) % 4);
        }
        resolve(encoded || '');
      };
      reader.onerror = error => reject(error);
    });
  };

  const activeResults = results.filter(r => r.profileId === activeProfileId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100 transition-colors selection:bg-violet-200 dark:selection:bg-violet-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-4 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3 text-violet-600 dark:text-violet-400">
          <div className="p-2 bg-violet-100 dark:bg-violet-500/20 rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
            HR ScreenAI
          </h1>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all duration-200 cursor-pointer active:scale-95"
          title="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Profiles & Requirements */}
        <div className="lg:col-span-4 space-y-6">
          <ProfileManager 
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSelect={handleProfileSelect}
            onSave={handleSaveProfile}
            onUpdate={handleUpdateProfile}
            onDelete={handleDeleteProfile}
            hasChanges={false}
          />
          
          <RequirementsForm 
            requirements={currentRequirements}
            onChange={setCurrentRequirements}
          />
        </div>

        {/* Right Column: Upload & Results */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 sm:p-6 transition-colors">
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              Upload CVs {activeProfileId && <span className="text-slate-500 dark:text-slate-400 font-normal text-sm">— {profiles.find(p => p.id === activeProfileId)?.name}</span>}
            </h2>
            {activeProfileId ? (
              <FileUpload onFilesSelected={handleFilesSelected} />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
                <div className="w-12 h-12 mb-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-base font-medium text-slate-900 dark:text-white mb-1">No Profile Selected</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Please select an existing job profile from the sidebar or create a new one to start analyzing CVs.
                </p>
              </div>
            )}
          </div>

          {activeResults.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white px-1">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                Candidate Results
                <span className="ml-2 py-0.5 px-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-medium">
                  {activeResults.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {activeResults.map(result => (
                  <CandidateCard key={result.id} result={result} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
