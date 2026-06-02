/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Eraser, 
  ArrowRight, 
  Check, 
  HelpCircle, 
  Info, 
  AlertCircle,
  Loader2,
  FileText,
  BadgeAlert,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface PromptCreatorStudioProps {
  onAddNotification: (text: string) => void;
  onTransferToPoster: (promptText: string, ratio: string) => void;
  theme: 'dark' | 'light';
}

export default function PromptCreatorStudio({ 
  onAddNotification, 
  onTransferToPoster,
  theme 
}: PromptCreatorStudioProps) {
  // Input fields
  const [posterTitle, setPosterTitle] = useState('Cybernetic Ocean Energy Summit');
  const [companyName, setCompanyName] = useState('Aether Aqua Corp');
  const [targetAudience, setTargetAudience] = useState('Clean-tech investors, marine engineers, environmentalists');
  const [keyFeatures, setKeyFeatures] = useState('Deep seafloor turbine generator rendering, electric neon bioluminescence, zero-carbon promise');
  const [contactInfo, setContactInfo] = useState('summit@aetheraqua.io');
  const [websiteUrl, setWebsiteUrl] = useState('aetheraqua.io/summit2026');
  const [designStyle, setDesignStyle] = useState('Creative futuristic synthwave');
  const [colorTheme, setColorTheme] = useState('Dark cosmic violet & cyan');
  const [aspectRatio, setAspectRatio] = useState('4:5');

  // Generated prompt state
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const stylePresets = [
    'Creative futuristic synthwave',
    'Cyberpunk neon grid',
    'Modern minimalist corporate',
    'Clean flat vector illustration',
    'Elegant editorial editorial serif',
    'Retro Swiss typography pop art',
    'Draft sketch blueprint tech'
  ];

  const colorPresets = [
    'Dark cosmic violet & cyan',
    'Golden luxury black & deep charcoal',
    'Warm twilight amber sunset orange',
    'Bioluminescent emerald green & mint',
    'Royal cobalt blue & silver highlight',
    'Cool slate grey & coral red accents'
  ];

  const ratioOptions = [
    { value: '1:1', label: 'Square (1:1)', suggestion: 'Instagram, feed posts' },
    { value: '4:5', label: 'Portrait (4:5)', suggestion: 'Social ads, Pinterest' },
    { value: '16:9', label: 'Landscape (16:9)', suggestion: 'Web banner, headers' },
    { value: '9:16', label: 'Story (9:16)', suggestion: 'Mobile stories, Reels' }
  ];

  const handleGenerate = async () => {
    if (!posterTitle.trim() || !companyName.trim()) {
      alert('Poster Title and Company Name are required to generate a prompt.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-poster-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          posterTitle,
          companyName,
          targetAudience,
          keyFeatures,
          contactInfo,
          websiteUrl,
          designStyle,
          colorTheme,
          aspectRatio
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedPrompt(data.prompt);
        onAddNotification('Refined a beautiful professional poster prompt using Gemini AI.');
      } else {
        throw new Error('API server returned error');
      }
    } catch (err) {
      // High-fidelity fallback generation if backend is unavailable or fails
      const fallbackPrompt = `A high-performance promotional poster in "${designStyle}" style, advertising "${posterTitle}" for brand "${companyName}". Color theme is dominated by gorgeous "${colorTheme}". Focal composition features clean high-contrast visual cues with text placements for keywords: "${keyFeatures || 'Eco-Power Turbine Technology'}". Target audience: "${targetAudience || 'tech enthusiasts'}". Registration info and contact points nested seamlessly at bottom layout margin: Web: "${websiteUrl || 'summit.io'}" | Support: "${contactInfo || 'info@summit.io'}". Optimized layout suited for a "${aspectRatio}" canvas format.`;
      
      setGeneratedPrompt(fallbackPrompt);
      onAddNotification('Assembled optimal visual layout prompt using local fallback parser.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    onAddNotification('Copied engineered prompt to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setPosterTitle('');
    setCompanyName('');
    setTargetAudience('');
    setKeyFeatures('');
    setContactInfo('');
    setWebsiteUrl('');
    setGeneratedPrompt('');
    onAddNotification('Cleared specifications form.');
  };

  // Preset loading clicker
  const handleLoadDemo = () => {
    setPosterTitle('Artificial Intelligence & Human Synergy Symposium');
    setCompanyName('NeuralNexus Labs');
    setTargetAudience('Tech researchers, cognitive science academics, builders');
    setKeyFeatures('Pristine golden holographic wireframe human hand interacting with glowing neural fiber node network, deep light beams');
    setContactInfo('symposium@neuralnexus.ai');
    setWebsiteUrl('neuralnexus.ai/symposium');
    setDesignStyle('Modern minimalist corporate');
    setColorTheme('Golden luxury black & deep charcoal');
    setAspectRatio('1:1');
    onAddNotification('Loaded NeuralNexus AI Symposium sample values.');
  };

  const isDark = theme === 'dark';

  return (
    <div id="prompt-creator-studio-container" className="space-y-8 animate-in fade-in duration-300">
      
      {/* Intro section with Quick actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-purple-900/10 via-indigo-950/10 to-transparent p-5 rounded-3xl border border-purple-500/10 mb-2">
        <div className="space-y-1">
          <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'} flex items-center gap-2 font-display`}>
            <Sparkles className="w-5 h-5 text-purple-400" />
            AI Prompt Generation Studio
          </h4>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Enter campaign metadata parameters below to let Gemini compose structured, high-focal image prompts.
          </p>
        </div>
        
        <button
          onClick={handleLoadDemo}
          className={`py-2 px-3 text-xs font-semibold rounded-lg cursor-pointer transition-all border ${
            isDark 
              ? 'bg-[#181a30] hover:bg-[#222445] text-purple-300 border-[#2f325c]' 
              : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
          }`}
        >
          Load Demo Preset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left specifications form - Col 7 */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`p-6 rounded-3xl border shadow-xl ${
            isDark ? 'bg-[#121324] border-[#222543] shadow-[#07080f]' : 'bg-white border-gray-200 shadow-gray-100'
          }`}>
            <h5 className={`text-xs font-bold uppercase tracking-wider mb-5 flex items-center gap-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Info className="w-4 h-4 text-cyan-400" />
              1. Document Poster Properties
            </h5>

            <div className="space-y-5">
              {/* Dual inputs: Poster Title & Company Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Poster Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Clean Energy Summit"
                    value={posterTitle}
                    onChange={(e) => setPosterTitle(e.target.value)}
                    className={`w-full px-4 py-2.5 text-xs rounded-xl outline-none transition-all duration-300 border ${
                      isDark 
                        ? 'bg-[#090a12] border-[#21233d] text-white focus:border-purple-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-600'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Company / Brand Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aether Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={`w-full px-4 py-2.5 text-xs rounded-xl outline-none transition-all duration-300 border ${
                      isDark 
                        ? 'bg-[#090a12] border-[#21233d] text-white focus:border-purple-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-600'
                    }`}
                  />
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Target Audience
                </label>
                <input
                  type="text"
                  placeholder="Describe your ideal viewers (e.g. Tech students, design professionals, gamers)"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className={`w-full px-4 py-2.5 text-xs rounded-xl outline-none transition-all duration-300 border ${
                    isDark 
                      ? 'bg-[#090a12] border-[#21233d] text-white focus:border-purple-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-600'
                  }`}
                />
              </div>

              {/* Key Features/Highlights */}
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Key Features / Core Highlights
                </label>
                <textarea
                  rows={2}
                  placeholder="Key items, illustrations, or taglines to emphasize in the graphic (e.g. seafloor turbines, holographic nodes)"
                  value={keyFeatures}
                  onChange={(e) => setKeyFeatures(e.target.value)}
                  className={`w-full px-4 py-2.5 text-xs rounded-xl outline-none transition-all duration-300 border leading-relaxed ${
                    isDark 
                      ? 'bg-[#090a12] border-[#21233d] text-white focus:border-purple-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-600'
                  }`}
                />
              </div>

              {/* Contact Information & Website URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Contact Information
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. register@cleanenergy.com"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className={`w-full px-4 py-2.5 text-xs rounded-xl outline-none transition-all duration-300 border ${
                      isDark 
                        ? 'bg-[#090a12] border-[#21233d] text-white focus:border-purple-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-600'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Website URL
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. cleanenergy.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className={`w-full px-4 py-2.5 text-xs rounded-xl outline-none transition-all duration-300 border ${
                      isDark 
                        ? 'bg-[#090a12] border-[#21233d] text-white focus:border-purple-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-600'
                    }`}
                  />
                </div>
              </div>

              {/* Selection Grids: Design Style & Color Theme */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Design Style
                  </label>
                  <select
                    value={designStyle}
                    onChange={(e) => setDesignStyle(e.target.value)}
                    className={`w-full px-3 py-2.5 text-xs rounded-xl outline-none transition-all duration-300 border cursor-pointer ${
                      isDark 
                        ? 'bg-[#090a12] border-[#21233d] text-white focus:border-purple-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-600'
                    }`}
                  >
                    {stylePresets.map(preset => (
                      <option key={preset} value={preset} className={isDark ? 'bg-[#121324] text-white' : 'bg-white text-gray-900'}>
                        {preset}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Color Theme Palette
                  </label>
                  <select
                    value={colorTheme}
                    onChange={(e) => setColorTheme(e.target.value)}
                    className={`w-full px-3 py-2.5 text-xs rounded-xl outline-none transition-all duration-300 border cursor-pointer ${
                      isDark 
                        ? 'bg-[#090a12] border-[#21233d] text-white focus:border-purple-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-purple-600'
                    }`}
                  >
                    {colorPresets.map(preset => (
                      <option key={preset} value={preset} className={isDark ? 'bg-[#121324] text-white' : 'bg-white text-gray-900'}>
                        {preset}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Aspect Ratio selector suggestions */}
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2.5 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Aspect Ratio Target
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {ratioOptions.map((opt) => {
                    const isSelected = aspectRatio === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAspectRatio(opt.value)}
                        className={`p-2 text-left rounded-lg transition-all border duration-300 cursor-pointer ${
                          isSelected
                            ? 'bg-purple-950/20 border-purple-500 text-purple-300'
                            : isDark
                              ? 'bg-[#090a12] border-[#21233d] hover:border-[#383b63] text-gray-400'
                              : 'bg-gray-50 border-gray-200 hover:border-gray-400 text-gray-600'
                        }`}
                      >
                        <div className="text-[10px] font-bold font-mono">{opt.value}</div>
                        <div className="text-[8px] text-[#8e8fa3] truncate leading-tight">{opt.suggestion}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons row */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleClear}
                  className={`px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all border ${
                    isDark 
                      ? 'bg-[#181a2f] hover:bg-red-950/20 text-gray-400 hover:text-red-400 border-[#2b2d4f]' 
                      : 'bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 border-gray-200'
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Clear Form</span>
                </button>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || !posterTitle.trim() || !companyName.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-505 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-40"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Synthesizing engineered prompt...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
                      <span>Generate Professional Prompt</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Right side prompt view area - Col 5 */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-6 rounded-3xl border shadow-xl flex flex-col h-full justify-between ${
            isDark ? 'bg-[#121324] border-[#222543] shadow-[#07080f]' : 'bg-white border-gray-200 shadow-gray-100'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#20223b] mb-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <h5 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    2. AI Engineered Prompt Output
                  </h5>
                </div>
              </div>

              {!generatedPrompt ? (
                <div className={`p-8 rounded-2xl border border-dashed text-center space-y-3 my-4 ${
                  isDark ? 'bg-[#090a12]/50 border-gray-800 text-gray-500' : 'bg-gray-50/50 border-gray-200 text-gray-400'
                }`}>
                  <AlertCircle className="w-10 h-10 mx-auto text-purple-300 animate-pulse" />
                  <div className="text-xs font-semibold">Prompt is not yet generated</div>
                  <p className="text-[10px] leading-relaxed max-w-xs mx-auto">
                    Fill in the form on the left and hit the "Generate Professional Prompt" button to create an optimized layout description string.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 animate-in duration-300 slide-in-from-bottom-2">
                  <label className={`block text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Generated visual prompt formula (Fully Editable):
                  </label>
                  
                  <textarea
                    id="crafted-prompt-editable-area"
                    value={generatedPrompt}
                    onChange={(e) => setGeneratedPrompt(e.target.value)}
                    rows={12}
                    className={`w-full p-4 text-xs font-mono rounded-xl leading-relaxed outline-none border focus:border-purple-500 resize-none select-text ${
                      isDark 
                        ? 'bg-[#080911] border-[#242646] text-[#e0e0f3]' 
                        : 'bg-gray-105 border-gray-200 text-gray-800'
                    }`}
                  />
                  
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <button
                      onClick={handleCopy}
                      className={`py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${
                        isDark 
                          ? 'bg-[#181a2f] hover:bg-[#202245] border-[#2d2f4f] text-purple-300 hover:text-white' 
                          : 'bg-gray-50 hover:bg-purple-50 border-gray-200 text-purple-700'
                      }`}
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400 animate-bounce" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
                    </button>

                    <button
                      onClick={() => onTransferToPoster(generatedPrompt, aspectRatio)}
                      className="py-3 px-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow"
                    >
                      <span>Transfer to Creator</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className={`mt-6 text-[10px] leading-relaxed p-3.5 rounded-xl border ${
              isDark ? 'bg-purple-950/10 border-purple-500/10 text-gray-400' : 'bg-purple-50/50 border-purple-100 text-gray-600'
            }`}>
              <div className="font-semibold text-purple-400 flex items-center gap-1 mb-1">
                <Info className="w-3.5 h-3.5 inline" /> Tips for High Intensity Prompts
              </div>
              Once you hit "Transfer to Creator", this prompt is prepared and piped immediately into the Poster Studio canvas model on the next screen where you can synthesize and compile assets cleanly.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
