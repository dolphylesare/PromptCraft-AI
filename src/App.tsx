/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PosterCreatorPanel from './components/PosterCreatorPanel';
import PosterPasteStudio from './components/PosterPasteStudio';
import PosterDesignStudio from './components/PosterDesignStudio';
import PromptCreatorStudio from './components/PromptCreatorStudio';
import PromptCardComponent from './components/PromptCardComponent';
import NewPromptForm from './components/NewPromptForm';
import { PromptCard, SidebarTab } from './types';
import { INITIAL_PROMPT_CARDS, AVAILABLE_CATEGORIES } from './data';
import { Search, Sparkles, Sliders, Play, RotateCcw, ShieldCheck, Cpu, Key, HelpCircle, Tags, ListFilter, Trash2, Heart, User, PlusCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<SidebarTab>('Prompt Creator');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem('prompt_craft_profile_photo');
    } catch (e) {
      console.warn('Profile image local retrieve fail', e);
      return null;
    }
  });

  const handleUpdateProfilePhoto = (photo: string | null) => {
    setProfilePhoto(photo);
    try {
      if (photo) {
        localStorage.setItem('prompt_craft_profile_photo', photo);
      } else {
        localStorage.removeItem('prompt_craft_profile_photo');
      }
    } catch (e) {
      console.warn('Profile photo write to storage error', e);
    }
  };

  const handleSettingsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          handleUpdateProfilePhoto(result);
          handleAddNotification('Updated profile photo in account Settings!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [transferredPrompt, setTransferredPrompt] = useState('');
  const [transferredRatio, setTransferredRatio] = useState('4:5');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [promptCards, setPromptCards] = useState<PromptCard[]>(() => {
    // Lazy initialisation with optional fallback and LocalStorage support
    try {
      const saved = localStorage.getItem('prompt_craft_cards');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('LocalStorage is disabled or unavailable.');
    }
    return INITIAL_PROMPT_CARDS;
  });

  // Track notifications or event telemetry securely log
  const [userLogs, setUserLogs] = useState<string[]>([
    'PromptCraft AI Workspace initialized.',
    'Loaded 6 default engineering templates.'
  ]);

  // System Health details from Express proxy route
  const [systemOnline, setSystemOnline] = useState<boolean | null>(null);
  const [geminiEnabled, setGeminiEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    // Call our Express API health endpoint
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setSystemOnline(true);
        setGeminiEnabled(data.hasGemini);
      })
      .catch((err) => {
        console.error('System health check error:', err);
        setSystemOnline(false);
      });
  }, []);

  // Sync cards with local storage when altered
  useEffect(() => {
    try {
      localStorage.setItem('prompt_craft_cards', JSON.stringify(promptCards));
    } catch (e) {
      // safe ignore in iframe environment constraints
    }
  }, [promptCards]);

  const handleToggleFavorite = (id: string) => {
    setPromptCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
    );
  };

  const handleAddCard = (newCard: PromptCard) => {
    setPromptCards((prev) => [newCard, ...prev]);
  };

  const handleAddNotification = (text: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setUserLogs((prev) => [`[${timestamp}] ${text}`, ...prev.slice(0, 49)]);
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to restore the default prompt templates? This will overwrite your current workspace.')) {
      setPromptCards(INITIAL_PROMPT_CARDS);
      handleAddNotification('Restored default workspace prompt cards.');
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to remove all custom and default prompt cards in this view?')) {
      setPromptCards([]);
      handleAddNotification('Cleared workspace templates.');
    }
  };

  // Determine which list to render based on filtering and activeTab
  const filteredCards = promptCards.filter((card) => {
    // 1. Favorites tab filter
    if (activeTab === 'My Favorites' && !card.isFavorite) {
      return false;
    }

    // 2. Clickable tag category filtering
    if (selectedTag && card.category !== selectedTag) {
      return false;
    }

    // 3. Search text query matching title, category, description, and detailed fullPrompt
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        card.title.toLowerCase().includes(query) ||
        card.category.toLowerCase().includes(query) ||
        card.description.toLowerCase().includes(query) ||
        card.fullPrompt.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const favoritesCount = promptCards.filter((c) => c.isFavorite).length;

  return (
    <div
      id="app-viewport"
      className={`min-h-screen flex selection:bg-purple-500/30 selection:text-white transition-colors duration-500 ${
        theme === 'dark' ? 'bg-[#0a0b12] text-gray-200' : 'bg-[#f4f4f8] text-gray-800'
      }`}
    >
      {/* Sidebar Navigation Panel on the left */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} favoritesCount={favoritesCount} profilePhoto={profilePhoto} />

      {/* Main Container workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header bar */}
        <Header 
          currentTitle={activeTab} 
          theme={theme} 
          setTheme={setTheme} 
          profilePhoto={profilePhoto} 
          onUpdateProfilePhoto={handleUpdateProfilePhoto}
          onAddNotification={handleAddNotification}
        />

        {/* Content Body Grid */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* PROMPT CREATOR VIEW (Advanced specifications form) */}
          {activeTab === 'Prompt Creator' && (
            <div className="max-w-7xl mx-auto py-2 font-sans animate-in fade-in duration-300">
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className={`font-display font-extrabold text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Prompt Creator Studio
                  </h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Describe poster metadata parameters and let Gemini AI synthesize hyper-optimized visual prompts.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('Poster Creator')}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-xl cursor-pointer border transition-all ${
                    theme === 'dark' 
                      ? 'border-[#2d2f4d] hover:bg-[#1a1b32] text-gray-300' 
                      : 'border-gray-200 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Go to Poster Studio
                </button>
              </div>

              {/* Advanced Prompt spec form studio */}
              <PromptCreatorStudio 
                onAddNotification={handleAddNotification}
                onTransferToPoster={(prompt, ratio) => {
                  setTransferredPrompt(prompt);
                  setTransferredRatio(ratio);
                  setActiveTab('Poster Creator');
                  handleAddNotification('Transferred formulated prompt to active execution canvas.');
                }}
                theme={theme}
              />
            </div>
          )}

          {/* POSTER CREATOR VIEW (Rendering Studio Canvas) */}
          {activeTab === 'Poster Creator' && (
            <div className="max-w-7xl mx-auto py-2 font-sans animate-in fade-in duration-300">
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className={`font-display font-extrabold text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Poster Creator Studio
                  </h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-650'}`}>
                    Synthesize visual blueprints or render high-definition drawings for your marketing channels.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('Prompt Creator')}
                  className={`px-4 py-2.5 text-xs font-semibold rounded-xl cursor-pointer border transition-all ${
                    theme === 'dark' 
                      ? 'border-[#2d2f4d] hover:bg-[#1a1b32] text-gray-300' 
                      : 'border-gray-200 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Back to Prompt Creator
                </button>
              </div>

              {/* Seamless advanced composite studio */}
              <PosterDesignStudio 
                onAddNotification={handleAddNotification} 
                transferredPrompt={transferredPrompt}
                transferredRatio={transferredRatio}
                theme={theme}
              />
            </div>
          )}

          {/* FAVORITES VIEW */}
          {activeTab === 'My Favorites' && (
            <div className="animate-in fade-in duration-300 max-w-5xl mx-auto">
              <div className="mb-6">
                <h3 className="font-display font-bold text-2xl text-white">Saved Favorites</h3>
                <p className="text-xs text-gray-400">Review your compiled set of saved engineering prompt cards.</p>
              </div>

              {filteredCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                  {filteredCards.map((card) => (
                    <PromptCardComponent
                      key={card.id}
                      card={card}
                      onToggleFavorite={handleToggleFavorite}
                      onAddNotification={handleAddNotification}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-[#121324]/40 border border-[#21233e]/50 p-12 text-center text-gray-400 rounded-3xl max-w-lg mx-auto my-12">
                  <Heart className="w-12 h-12 text-red-500/30 mx-auto mb-4 animate-bounce" />
                  <p className="text-sm font-semibold text-white mb-1">Your Favorites is Empty</p>
                  <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                    Browse the prompt library and click the heart icon on any card to save it here for fast retrieval.
                  </p>
                  <button
                    onClick={() => setActiveTab('Generate Prompts')}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold text-white rounded-xl shadow cursor-pointer"
                  >
                    Discover Prompts
                  </button>
                </div>
              )}
            </div>
          )}

          {/* CATEGORIES VIEW */}
          {activeTab === 'Categories' && (
            <div className="animate-in fade-in duration-300 max-w-5xl mx-auto">
              <div className="mb-8">
                <h3 className="font-display font-bold text-2xl text-white">Categories Explorer</h3>
                <p className="text-xs text-gray-400">Browse template collections grouped by industry application.</p>
              </div>

              {/* Grid of beautifully designed visual category cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-12 select-none">
                {AVAILABLE_CATEGORIES.map((cat, i) => {
                  const count = promptCards.filter((c) => c.category === cat).length;
                  const icons = [Tags, ListFilter, Sparkles, Cpu, Sliders];
                  const IconComponent = icons[i % icons.length];
                  const colors = [
                    'from-[#c084fc]/20 border-[#c084fc]/30 text-purple-300',
                    'from-[#38bdf8]/20 border-[#38bdf8]/30 text-cyan-300',
                    'from-[#f472b6]/20 border-[#f472b6]/30 text-[#f472b6]',
                    'from-[#fb923c]/20 border-[#fb923c]/30 text-[#fb923c]',
                    'from-[#4ade80]/20 border-[#4ade80]/30 text-[#4ade80]'
                  ];
                  const colorStyle = colors[i % colors.length];

                  return (
                    <div
                      key={cat}
                      onClick={() => {
                        setSelectedTag(cat);
                        setActiveTab('Generate Prompts');
                        handleAddNotification(`Filtered template search by category: "${cat}".`);
                      }}
                      className={`h-44 rounded-3xl p-6 bg-gradient-to-b ${colorStyle} bg-[#121324] border hover:border-purple-500/60 transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1 flex flex-col justify-between group`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-[#0c0d18]/80 rounded-2xl border border-gray-800/40">
                          <IconComponent className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-[10px] bg-black/60 px-2.5 py-1 rounded-full text-gray-300 tracking-wider uppercase font-semibold">
                          {count} Presets
                        </span>
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-[#e4e4e7] text-lg mb-1">{cat}</h4>
                        <p className="text-xs text-gray-400">Click to focus and customize related prompt templates.</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SETTINGS VIEW */}
          {activeTab === 'Settings' && (
            <div className="animate-in fade-in duration-300 max-w-3xl mx-auto font-sans">
              <div className="mb-6">
                <h3 className="font-display font-semibold text-2xl text-white">System Settings</h3>
                <p className="text-xs text-gray-400">Audit connectivity modules, system models, and active secrets configurations.</p>
              </div>

              {/* Settings layout cards */}
              <div className="space-y-6">
                {/* Profile Settings Card */}
                <div id="settings-profile-card" className="bg-[#121324] border border-[#20223b] p-6 rounded-3xl animate-in fade-in duration-300">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" />
                    User Account & Profile Customization
                  </h4>

                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-[#0c0d18] border border-[#1e2034] rounded-2xl">
                    {/* Avatar Display */}
                    <div className="relative group shrink-0 select-none">
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt="Profile preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-purple-500/50 shadow-lg shadow-purple-500/10"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white border-2 border-purple-500/20 shadow-lg select-none">
                          PD
                        </div>
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex-1 text-center sm:text-left space-y-3.5">
                      <div>
                        <h5 className="text-sm font-bold text-white uppercase tracking-wider">Prompt Designer</h5>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono">dolphylesarej2002@gmail.com</p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                        <label className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all inline-flex items-center gap-1.5 shadow">
                          <PlusCircle className="w-3.5 h-3.5" />
                          Upload Photo
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                            className="hidden"
                            onChange={handleSettingsFileChange}
                          />
                        </label>
                        {profilePhoto && (
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateProfilePhoto(null);
                              handleAddNotification('Removed profile photo from Settings.');
                            }}
                            className="px-4 py-2 bg-red-950/20 hover:bg-red-955/40 border border-red-800/30 text-red-300 text-[11.5px] font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 font-sans"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove Photo
                          </button>
                        )}
                      </div>

                      <p className="text-[10px] text-gray-500">
                        Supports JPEG, PNG, or SVG formatted images. Your image is saved in Local Storage so it remains persistent.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connection Health info */}
                <div className="bg-[#121324] border border-[#20223d] p-6 rounded-3xl">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    Cloud Ingress & Integration Health
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#0c0d18] border border-[#1e2034] p-4 rounded-2xl flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-400">Express API Gateway</span>
                      <span className="text-xs font-bold font-mono text-green-400 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block animate-pulse" />
                        ONLINE
                      </span>
                    </div>

                    <div className="bg-[#0c0d18] border border-[#1e2034] p-4 rounded-2xl flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-400">Google Gemini Integration</span>
                      <span className={`text-xs font-bold font-mono flex items-center gap-1.5 ${geminiEnabled ? 'text-[#a27efc]' : 'text-yellow-500'}`}>
                        {geminiEnabled ? (
                          <>
                            <span className="w-2.5 h-2.5 rounded-full bg-[#a27efc] inline-block animate-pulse" />
                            GEMINI ACTIVE
                          </>
                        ) : (
                          <>
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
                            FALLBACK MODE (No Key)
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-500 mt-4 leading-relaxed">
                    By default, if the <strong className="text-gray-300">GEMINI_API_KEY</strong> environment variable is registered via settings secrets under AI Studio, the application will securely route real generative prompt refinements on server-side. If absent, the Express gateway automatically provides highly engineered fallback models safely.
                  </p>
                </div>

                {/* Model Choices configuration */}
                <div className="bg-[#121324] border border-[#20223d] p-6 rounded-3xl">
                  <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    Active Model Hierarchy
                  </h4>

                  <div className="space-y-3.5">
                    <div className="bg-[#0c0d18] p-4 rounded-2xl border border-[#1d1e36]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Cpu className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-semibold text-white">Default Assistant LLM</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">
                        Currently running <code className="text-cyan-400">gemini-3.5-flash</code> as recommended for high-speed, general-purpose text refining tasks.
                      </p>
                    </div>

                    <div className="bg-[#0c0d18] p-4 rounded-2xl border border-[#1d1e36]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Key className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs font-semibold text-white">Credential Management</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        To add or update your secret credentials, please locate the <strong className="text-gray-300">Settings &gt; Secrets</strong> panel in Google AI Studio interface. The application securely binds secrets server-side protecting client traffic.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reset & Storage Cleanup option */}
                <div className="bg-[#121324] border border-red-950/40 p-6 rounded-3xl">
                  <h4 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Workspace Maintenance & Storage Cleanup
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    If you wish to clear your custom templates stored in LocalStorage, or restore the default initial layout matching the visual screenshot, use the system repair actions below.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      id="btn-restore-defaults"
                      onClick={handleResetDefaults}
                      className="px-4 py-2.5 bg-[#17182b] hover:bg-[#20223b] border border-[#2d2f4d] text-gray-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                    >
                      Restore Base Presets
                    </button>
                    <button
                      id="btn-wipe-storage"
                      onClick={handleClearAll}
                      className="px-4 py-2.5 bg-red-950/20 hover:bg-red-950/40 border border-red-800/30 text-red-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                    >
                      Clear All Library
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
