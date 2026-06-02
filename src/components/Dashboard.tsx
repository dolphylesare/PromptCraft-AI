/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Download, 
  BookOpen, 
  Check, 
  Copy, 
  Trash2, 
  ArrowRight, 
  Zap, 
  Users, 
  Globe, 
  Tag, 
  RefreshCw,
  PlusCircle,
  FileText,
  Play
} from 'lucide-react';
import { SidebarTab } from '../types';

interface Template {
  id: string;
  category: string;
  title: string;
  companyName: string;
  targetAudience: string;
  keyFeatures: string;
  contactInfo: string;
  websiteUrl: string;
  designStyle: string;
  colorTheme: string;
  ctaText: string;
  description: string;
}

const CURATED_TEMPLATES: Template[] = [
  {
    id: 'tpl-ai',
    category: 'AI Courses',
    title: 'Advanced Generative AI Masterclass',
    companyName: 'NeuralNexus Labs',
    targetAudience: 'Tech leads, software architects, AI researchers',
    keyFeatures: 'Step-by-step LLM tuning, Vector DB architectures, prompt caching optimization, interactive coding labs',
    contactInfo: 'learn@neuralnexus.ai',
    websiteUrl: 'neuralnexus.ai/masterclass',
    designStyle: 'Creative futuristic synthwave',
    colorTheme: 'Dark cosmic violet & cyan',
    ctaText: 'Apply Today',
    description: 'Master large language models with intensive, hands-on architectural design blueprints.'
  },
  {
    id: 'tpl-dm',
    category: 'Digital Marketing',
    title: 'Hyper-Growth Marketing Bootcamp',
    companyName: 'BrandScale AI',
    targetAudience: 'Growth hackers, marketing directors, remote founders',
    keyFeatures: 'Conversion copywriting pipelines, programmatic SEO channels, generative ad creatives, real-time analytics dashboards',
    contactInfo: 'grow@brandscale.ai',
    websiteUrl: 'brandscale.ai/bootcamp',
    designStyle: 'Cyberpunk neon grid',
    colorTheme: 'Warm twilight amber sunset orange',
    ctaText: 'Enroll Now',
    description: 'Deploy advanced copy frameworks and generative tools to scale user acquisition metrics.'
  },
  {
    id: 'tpl-edu',
    category: 'Education',
    title: 'Cognitive Science & Pedagogy Seminar',
    companyName: 'Synapse Academy',
    targetAudience: 'Educators, school deans, cognitive psychologists',
    keyFeatures: 'Neuroplastic learning loops, hybrid curriculum designs, interactive virtual classrooms, student retention heuristics',
    contactInfo: 'seminar@synapse.edu',
    websiteUrl: 'synapse.edu/cognitive2026',
    designStyle: 'Elegant editorial editorial serif',
    colorTheme: 'Royal cobalt blue & silver highlight',
    ctaText: 'Reserve Seat',
    description: 'Optimize classroom retention methodologies with behavioral cognition models.'
  },
  {
    id: 'tpl-rest',
    category: 'Restaurant',
    title: 'Gastronomy & Ambient Dining Launch',
    companyName: 'Umami Bistro',
    targetAudience: 'Food lovers, culinary critics, local gourmands',
    keyFeatures: 'Artisanal dry-aged wagyu, organic microgreen garnishes, signature mixology pairings, warm ambient candlelit tables',
    contactInfo: 'tables@umamibistro.com',
    websiteUrl: 'umamibistro.com/reserve',
    designStyle: 'Retro Swiss typography pop art',
    colorTheme: 'Warm twilight amber sunset orange',
    ctaText: 'Book Table',
    description: 'Savor Michelin-inspired artisanal dishes paired with curated modern mixology.'
  },
  {
    id: 'tpl-re',
    category: 'Real Estate',
    title: 'Aura Premium Skyline Residencies',
    companyName: 'Apex Living',
    targetAudience: 'Luxury property investors, urban professionals',
    keyFeatures: 'Floor-to-ceiling panoramic glass walls, private rooftop infinity pool, intelligent voice-enabled home automation, lush terrace gardens',
    contactInfo: 'living@apexskyline.com',
    websiteUrl: 'apexskyline.com/aura',
    designStyle: 'Modern minimalist corporate',
    colorTheme: 'Golden luxury black & deep charcoal',
    ctaText: 'View Suites',
    description: 'Experience futuristic luxury living high above the metropolis in an automated smart suite.'
  },
  {
    id: 'tpl-hc',
    category: 'Healthcare',
    title: 'Precision Genomics & Lifespan Symposium',
    companyName: 'HelixCare Diagnostics',
    targetAudience: 'Oncologists, genetics researchers, biotech entrepreneurs',
    keyFeatures: 'CRISPR-powered targeted therapies, epigenetic longevity bio-markers, real-time DNA sequencing interfaces, machine-learning diagnostics',
    contactInfo: 'symposium@helixcare.org',
    websiteUrl: 'helixcare.org/precision2026',
    designStyle: 'Draft sketch blueprint tech',
    colorTheme: 'Bioluminescent emerald green & mint',
    ctaText: 'Register Live',
    description: 'Explore the frontiers of longevity biotechnology and targeted molecular medicine.'
  },
  {
    id: 'tpl-evt',
    category: 'Events',
    title: 'Sonic Wave Electronic Music Festival',
    companyName: 'Pulse Events',
    targetAudience: 'Techno enthusiasts, audio engineers, festival goers',
    keyFeatures: 'High-power spatial sound arrays, retro-futuristic laser art directions, outdoor lakeside amphitheater, multi-stage curated soundscapes',
    contactInfo: 'tickets@sonicwave.com',
    websiteUrl: 'sonicwavefestival.com',
    designStyle: 'Creative futuristic synthwave',
    colorTheme: 'Dark cosmic violet & cyan',
    ctaText: 'Get Tickets',
    description: 'Dance under the summer skies to a 48-hour curated showcase of ambient and techno pioneers.'
  },
  {
    id: 'tpl-corp',
    category: 'Corporate',
    title: 'Decentralized Venture Capital Summit',
    companyName: 'Synergy Capital',
    targetAudience: 'Angel investors, blockchain venture partners, fintech developer leads',
    keyFeatures: 'Cross-chain liquidity pools, yield-bearing real-world tokenization, decentralized risk insurance panels, global regulatory frameworks roundtable',
    contactInfo: 'summit@synergycap.io',
    websiteUrl: 'synergy.capital/venturesummit2026',
    designStyle: 'Modern minimalist corporate',
    colorTheme: 'Royal cobalt blue & silver highlight',
    ctaText: 'Access Pass',
    description: 'Architecting decentralized funding strategies and tokenized real-world infrastructure parameters.'
  }
];

interface DashboardProps {
  onAddNotification: (text: string) => void;
  onSelectTemplate: (template: Template) => void;
  onModifyPrompt: (promptText: string) => void;
  setActiveTab: (tab: SidebarTab) => void;
  theme?: 'dark' | 'light';
}

interface PromptHistoryItem {
  id: string;
  promptText: string;
  createdAt: string;
}

export default function Dashboard({ 
  onAddNotification, 
  onSelectTemplate, 
  onModifyPrompt, 
  setActiveTab,
  theme = 'dark'
}: DashboardProps) {
  const isDark = theme === 'dark';

  // Stats LocalStorage Sync
  const [stats, setStats] = useState({
    totalPostersCreated: 0,
    totalPromptsGenerated: 0,
    templatesUsed: 0,
    downloadsCount: 0
  });

  // Prompt History Sync
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load stats and history on mount
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem('prompt_craft_dashboard_stats_v2');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      } else {
        // Mock start stats for attractive dashboard feel
        const defaultStats = {
          totalPostersCreated: 8,
          totalPromptsGenerated: 24,
          templatesUsed: 4,
          downloadsCount: 6
        };
        localStorage.setItem('prompt_craft_dashboard_stats_v2', JSON.stringify(defaultStats));
        setStats(defaultStats);
      }

      const savedHistory = localStorage.getItem('prompt_craft_history_v2');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      } else {
        // Fallback demo histories
        const defaultHistory: PromptHistoryItem[] = [
          { 
            id: 'hist-1', 
            promptText: 'Write a high-converting promotional copy for a new AI-powered programming course for BrainCorp AI. Highlight vector databases and neon lines.', 
            createdAt: new Date(Date.now() - 3600000).toLocaleTimeString() 
          },
          { 
            id: 'hist-2', 
            promptText: 'A gorgeous high-resolution editorial style marketing layout representing global medical genomics under Apex Longevity.', 
            createdAt: new Date(Date.now() - 7200000).toLocaleTimeString() 
          }
        ];
        localStorage.setItem('prompt_craft_history_v2', JSON.stringify(defaultHistory));
        setHistory(defaultHistory);
      }
    } catch (e) {
      console.warn('LocalStorage error loading dashboard specs', e);
    }
  }, []);

  // Update statistics helper
  const incrementStat = (key: keyof typeof stats) => {
    setStats(prev => {
      const updated = { ...prev, [key]: prev[key] + 1 };
      try {
        localStorage.setItem('prompt_craft_dashboard_stats_v2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Select Curated Template Action
  const handleSelectTemplate = (tpl: Template) => {
    incrementStat('templatesUsed');
    onSelectTemplate(tpl);
    onAddNotification(`Auto-filled workspaces using the professional "${tpl.category}" template.`);
  };

  // Copy History Text
  const handleCopyHistory = (item: PromptHistoryItem) => {
    navigator.clipboard.writeText(item.promptText);
    setCopiedId(item.id);
    onAddNotification('Copied past engineered prompt to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Delete History Item
  const handleDeleteHistory = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem('prompt_craft_history_v2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    onAddNotification('Deleted prompt from history.');
  };

  // Reuse History Item (piping to workspace)
  const handleReuseHistory = (promptText: string) => {
    onModifyPrompt(promptText);
    onAddNotification('Refocused the selected prompt in the workspace.');
    setActiveTab('Prompt Creator');
  };

  // Edit History Item Inline
  const handleStartEdit = (item: PromptHistoryItem) => {
    setEditingHistoryId(item.id);
    setEditingText(item.promptText);
  };

  const handleSaveEdit = (id: string) => {
    setHistory(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, promptText: editingText } : item);
      try {
        localStorage.setItem('prompt_craft_history_v2', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setEditingHistoryId(null);
    onAddNotification('Saved edited promt in history.');
  };

  return (
    <div id="dashboard-viewport-root" className="space-y-8 animate-in fade-in duration-300">
      
      {/* Visual SaaS Hero Jumbotron */}
      <div className={`p-8 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-r from-purple-950/20 via-indigo-950/20 to-transparent border-purple-500/10' 
          : 'bg-gradient-to-r from-purple-50 via-[#f8fafc] to-white border-purple-200'
      }`}>
        {/* Subtle decorative glowing background layers */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2.5 max-w-xl text-left select-none">
          <div className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-purple-500/20 shadow-md">
            <Zap className="w-3.5 h-3.5 inline animate-pulse" />
            Active SaaS Portfolio Suite
          </div>
          <h2 className={`font-display font-extrabold text-2xl lg:text-3xl tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Supercharge Your Visual Copywriting Architecture
          </h2>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-650'}`}>
            Generate hyper-refined AI prompts using server-side Gemini models, compose stunning marketing flyers with customizable branding overlays, and export high-resolution canvases optimized and ready for deployment.
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('Prompt Creator')}
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-505 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-lg hover:-translate-y-0.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            Creator Studio
          </button>
          <button
            onClick={() => setActiveTab('Poster Creator')}
            className={`px-5 py-3 border font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all hover:-translate-y-0.5 cursor-pointer ${
              isDark 
                ? 'bg-[#181a30] hover:bg-[#20223f] border-[#292b4a] text-purple-300 hover:text-white' 
                : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            Blended Canvas
          </button>
        </div>
      </div>

      {/* Modern High-End Executive SaaS Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        {/* Stat 1 */}
        <div className={`p-5 rounded-2xl border transition-all hover:border-purple-500/30 flex items-center gap-4 ${
          isDark ? 'bg-[#121324] border-[#1e213b] text-gray-200' : 'bg-white border-gray-200 text-gray-800'
        }`}>
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400 font-bold shrink-0">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">Posters Synthesized</span>
            <span className="block text-xl font-extrabold font-mono tracking-tight text-white mt-1">
              {stats.totalPostersCreated}
            </span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className={`p-5 rounded-2xl border transition-all hover:border-purple-500/30 flex items-center gap-4 ${
          isDark ? 'bg-[#121324] border-[#1e213b] text-gray-200' : 'bg-white border-gray-200 text-gray-800'
        }`}>
          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400 font-bold shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">Prompts Refined</span>
            <span className="block text-xl font-extrabold font-mono tracking-tight text-white mt-1">
              {stats.totalPromptsGenerated}
            </span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className={`p-5 rounded-2xl border transition-all hover:border-purple-500/30 flex items-center gap-4 ${
          isDark ? 'bg-[#121324] border-[#1e213b] text-gray-200' : 'bg-white border-gray-200 text-gray-800'
        }`}>
          <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 text-[#fb923c] font-bold shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">Templates Loaded</span>
            <span className="block text-xl font-extrabold font-mono tracking-tight text-white mt-1">
              {stats.templatesUsed}
            </span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className={`p-5 rounded-2xl border transition-all hover:border-purple-500/30 flex items-center gap-4 ${
          isDark ? 'bg-[#121324] border-[#1e213b] text-gray-200' : 'bg-white border-gray-200 text-gray-800'
        }`}>
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-[#4ade80] font-bold shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div className="text-left">
            <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">High-Res Downloads</span>
            <span className="block text-xl font-extrabold font-mono tracking-tight text-white mt-1">
              {stats.downloadsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Curved Workspace Layout Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Curated Template Library Grid Panel - Left Col 8 */}
        <div className="xl:col-span-8 flex flex-col justify-between">
          <div className={`p-6 rounded-3xl border h-full flex flex-col ${
            isDark ? 'bg-[#121324] border-[#1e213b]/80 shadow-[#07080f]' : 'bg-white border-gray-200 shadow-gray-100'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-[#20223b] mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <h3 className={`font-display font-extrabold text-[15px] ${isDark ? 'text-white' : 'text-gray-900'}`}>Curated Dynamic Templates Library</h3>
              </div>
              <span className="text-[10px] font-mono text-gray-400">8 Curated Presets ready to deploy</span>
            </div>

            {/* Template Library Rows/Cards list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
              {CURATED_TEMPLATES.map((item) => {
                return (
                  <div 
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
                      isDark 
                        ? 'bg-[#090a12]/80 hover:bg-[#15172a] border-[#22243d] hover:border-purple-500/30' 
                        : 'bg-gray-50 hover:bg-purple-50/20 border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {item.category}
                        </span>
                        <div className="flex gap-1">
                          <span className="text-[8px] font-mono text-gray-400">{item.designStyle.split(' ')[1] || item.designStyle}</span>
                        </div>
                      </div>
                      <h4 className={`text-xs font-black uppercase tracking-normal leading-tight line-clamp-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {item.title}
                      </h4>
                      <p className="text-[10.5px] leading-relaxed text-gray-400 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/5 font-sans">
                      <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest">{item.companyName}</span>
                      <button
                        onClick={() => handleSelectTemplate(item)}
                        className="p-1 px-3 bg-purple-600/80 hover:bg-purple-600 text-white font-extrabold text-[10px] uppercase rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                      >
                        Load Template
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Prompt History List Panel - Right Col 4 */}
        <div className="xl:col-span-4 flex flex-col justify-between">
          <div className={`p-6 rounded-3xl border h-full flex flex-col ${
            isDark ? 'bg-[#121324] border-[#1e213b]/80 shadow-[#07080f]' : 'bg-white border-gray-250 shadow-gray-100'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-[#20223b] mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400 animate-pulse" />
                <h3 className={`font-display font-extrabold text-[15px] ${isDark ? 'text-white' : 'text-gray-900'}`}>Workspace Log & History</h3>
              </div>
              <button 
                onClick={() => {
                  if (confirm('Clear entire history log?')) {
                    setHistory([]);
                    try { localStorage.setItem('prompt_craft_history_v2', '[]'); } catch(e) {}
                    onAddNotification('Cleared local prompt history log.');
                  }
                }}
                className="text-[10px] text-gray-400 hover:text-red-400 font-mono flex items-center gap-1 cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* History Logs Content */}
            <div className="space-y-3.5 overflow-y-auto max-h-[460px] pr-1 flex-1">
              {history.length > 0 ? (
                history.map((item) => {
                  const isEditing = editingHistoryId === item.id;
                  return (
                    <div 
                      key={item.id}
                      className={`p-3 rounded-xl border flex flex-col justify-between ${
                        isDark ? 'bg-[#090a12]/85 border-[#21233e]' : 'bg-gray-50 border-gray-200'
                      } hover:border-purple-500/20 transition-all font-sans relative group`}
                    >
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="w-full text-[10.5px] p-2 bg-[#121324] border border-[#2b2e55] outline-none text-white rounded font-mono resize-none"
                          />
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => setEditingHistoryId(null)}
                              className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 bg-gray-800 text-gray-400 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 bg-green-950 text-green-400 rounded hover:bg-green-900/50"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 select-text">
                          <p className="text-[11px] font-mono leading-relaxed text-[#dfdfed] select-text">
                            {item.promptText}
                          </p>
                          <div className="flex items-center justify-between text-[8.5px] text-gray-400 mt-2">
                            <span>{item.createdAt}</span>
                            <div className="flex gap-2 opacity-100 xl:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleCopyHistory(item)}
                                className="text-purple-400 hover:text-purple-300 font-mono"
                              >
                                {copiedId === item.id ? 'Copied' : 'Copy'}
                              </button>
                              <button
                                onClick={() => handleStartEdit(item)}
                                className="text-cyan-400 hover:text-cyan-300 font-mono"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleReuseHistory(item.promptText)}
                                className="text-yellow-400 hover:text-yellow-300 font-mono"
                              >
                                Reuse
                              </button>
                              <button
                                onClick={() => handleDeleteHistory(item.id)}
                                className="text-red-500 hover:text-red-400 font-mono"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-gray-500 text-[11px] space-y-1 select-none">
                  <Play className="w-6 h-6 mx-auto text-purple-500/20 rotate-90" />
                  <p className="font-semibold">No Recent Prompts Refined</p>
                  <p className="text-gray-400">Your refined prompts history log will show up here.</p>
                </div>
              )}
            </div>
            
            {/* Guide Info */}
            <div className={`mt-4 text-[10px] leading-relaxed p-3.5 rounded-xl border ${
              isDark ? 'bg-purple-950/10 border-purple-500/10 text-gray-400' : 'bg-purple-50/50 border-purple-100 text-gray-600'
            }`}>
              Click <strong>Reuse</strong> next to any prompt to pipe it back into the active workspace editor instantly!
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
