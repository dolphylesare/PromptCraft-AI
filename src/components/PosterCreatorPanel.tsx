/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Copy, Download, Loader2, Check, Smartphone, Monitor, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { PosterConfig } from '../types';

interface PosterCreatorPanelProps {
  onAddNotification: (text: string) => void;
}

type AspectRatio = '1:1' | '4:5' | '16:9' | '9:16';

interface AspectRatioOption {
  id: AspectRatio;
  label: string;
  dimensions: string;
  suggestion: string;
  width: number;
  height: number;
}

export default function PosterCreatorPanel({ onAddNotification }: PosterCreatorPanelProps) {
  const [config, setConfig] = useState<PosterConfig>({
    companyName: '',
    courseName: '',
    contactInfo: '',
    posterStyle: 'Ultra Realistic',
  });

  // State for interactive aspect ratios
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio | null>(null);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [posterProgress, setPosterProgress] = useState(0);
  const [hasGeneratedPoster, setHasGeneratedPoster] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const [generatedPrompt, setGeneratedPrompt] = useState<string>(
    'Write a high-converting promotional copy for a new AI-powered programming course for BrainCorp AI showcasing Deep Neural Architectures...'
  );
  const [copied, setCopied] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const styles = ['Ultra Realistic', 'Cartoon', 'Minimalist'];

  const ratios: AspectRatioOption[] = [
    { id: '1:1', label: 'Square', dimensions: '1080 x 1080', suggestion: 'Instagram feed, LinkedIn, Twitter', width: 1000, height: 1000 },
    { id: '4:5', label: 'Portrait', dimensions: '1080 x 1350', suggestion: 'Facebook Ads, Pinterest pin', width: 1000, height: 1250 },
    { id: '16:9', label: 'Landscape', dimensions: '1920 x 1080', suggestion: 'Web banner, YouTube thumbnail', width: 1600, height: 900 },
    { id: '9:16', label: 'Story', dimensions: '1080 x 1920', suggestion: 'Instagram Reels, TikTok, stories', width: 1000, height: 1778 }
  ];

  // Draw the dynamic poster on the high-res offscreen/hidden canvas
  const drawPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Apply Background colors according to styling choice
    if (config.posterStyle === 'Ultra Realistic') {
      // Futuristic Dark Neon Theme
      const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height) / 1.2);
      grad.addColorStop(0, '#1c1b3e');
      grad.addColorStop(0.5, '#0c0b1a');
      grad.addColorStop(1, '#02020a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Tech Grid overlay lines
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.08)';
      ctx.lineWidth = 1.5;
      const step = 80;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Tech Circles glow
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.35, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.38, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.12)';
      ctx.setLineDash([15, 15]);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

    } else if (config.posterStyle === 'Cartoon') {
      // Bubble Playful Pink & Orange Neon Wave Theme
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#db2777'); // Pink-600
      grad.addColorStop(0.5, '#7c3aed'); // Purple-600
      grad.addColorStop(1, '#ea580c'); // Orange-600
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Playful circles or dots pattern
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      for (let i = 0; i < 40; i++) {
        const cx = (Math.sin(i) * 0.5 + 0.5) * width;
        const cy = (Math.cos(i * 1.5) * 0.5 + 0.5) * height;
        const r = 15 + (i % 5) * 15;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Thick cartoon interior border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.strokeRect(25, 25, width - 50, height - 50);

    } else {
      // 'Minimalist' Swiss Typography Look
      ctx.fillStyle = '#f8fafc'; // light slate text-friendly white
      ctx.fillRect(0, 0, width, height);

      // Subtle abstract corner rectangles
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(40, 40, 2, 80);
      ctx.fillRect(40, 40, 80, 2);
      ctx.fillRect(width - 42, height - 120, 2, 80);
      ctx.fillRect(width - 120, height - 42, 80, 2);

      // Elegant ultra light decorative circle
      ctx.beginPath();
      ctx.arc(width - 150, 150, 60, 0, Math.PI * 2);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // DRAW TEXT CONTENT WITH WRAPPING SUPPORT & CUSTOM COLORS
    const isMinimal = config.posterStyle === 'Minimalist';
    const isCartoon = config.posterStyle === 'Cartoon';

    // 1. Draw Company Name Top Label
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const companyNameClean = config.companyName.trim().toUpperCase() || 'BRAINWORKS';

    if (isMinimal) {
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 24px "Space Grotesk", Arial, sans-serif';
      ctx.fillText(companyNameClean, width / 2, 60);
    } else if (isCartoon) {
      // Cartoon text shadow
      ctx.fillStyle = '#000000';
      ctx.font = 'black 28px "Space Grotesk", sans-serif';
      ctx.fillText(companyNameClean, width / 2 + 3, 63);
      ctx.fillStyle = '#fef08a'; // yellow-200
      ctx.fillText(companyNameClean, width / 2, 60);
    } else {
      // Ultra Realistic Neon text glow styling
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'semibold 22px "JetBrains Mono", Courier, monospace';
      ctx.fillText(`⚡  ${companyNameClean}  ⚡`, width / 2, 70);
      ctx.shadowBlur = 0; // Reset shadow
    }

    // 2. Draw Course Name/Headline (Centered prominently)
    ctx.textBaseline = 'middle';
    const courseText = config.courseName.trim() || 'ACADEMY MASTERCOURSE';

    // Auto calculate adaptive font size based on text length to prevent overflow
    let titleFontSize = Math.min(74, Math.floor(width / (courseText.length * 0.45)));
    titleFontSize = Math.max(26, titleFontSize);

    if (isMinimal) {
      ctx.fillStyle = '#1e293b';
      ctx.font = `800 ${titleFontSize}px "Space Grotesk", "Helvetica", Arial, sans-serif`;
      wrapText(ctx, courseText, width / 2, height * 0.38, width - 120, titleFontSize * 1.25);
    } else if (isCartoon) {
      ctx.font = `900 ${titleFontSize}px "Space Grotesk", sans-serif`;
      // Double cartoon outline shadow offsets
      ctx.fillStyle = '#000000';
      wrapText(ctx, courseText, width / 2 + 5, height * 0.38 + 5, width - 160, titleFontSize * 1.3);
      ctx.fillStyle = '#ffffff';
      wrapText(ctx, courseText, width / 2, height * 0.38, width - 160, titleFontSize * 1.3);
    } else {
      // Ultra Realistic Neon Cyan-Purple glow headline
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 15;
      ctx.font = `bold ${titleFontSize}px "Space Grotesk", sans-serif`;
      ctx.fillStyle = '#ffffff';

      // We can draw a beautiful neon gradient text onto canvas
      const textGrad = ctx.createLinearGradient(width / 2 - 200, height / 2 - 100, width / 2 + 200, height / 2 + 100);
      textGrad.addColorStop(0, '#ffffff');
      textGrad.addColorStop(0.5, '#d8b4fe');
      textGrad.addColorStop(1, '#818cf8');
      ctx.fillStyle = textGrad;

      wrapText(ctx, courseText, width / 2, height * 0.38, width - 140, titleFontSize * 1.3);
      ctx.shadowBlur = 0; // Reset
    }

    // 3. Draw Style Badge & Specifications
    ctx.textBaseline = 'middle';
    ctx.font = '14px "JetBrains Mono", Courier, monospace';
    const badgeText = `GENRE: ${config.posterStyle.toUpperCase()} | ENGINE: GEMINI 3.5 IMAGEN | HQ RESOLUTION`;

    if (isMinimal) {
      ctx.fillStyle = '#64748b';
      ctx.fillText(badgeText, width / 2, height * 0.72);
    } else if (isCartoon) {
      ctx.fillStyle = '#000000';
      ctx.fillText(badgeText, width / 2 + 1, height * 0.72 + 1);
      ctx.fillStyle = '#fdba74'; // orange-300
      ctx.fillText(badgeText, width / 2, height * 0.72);
    } else {
      ctx.fillStyle = '#a1a1aa';
      ctx.fillText(`⊞  ${badgeText}  ⊞`, width / 2, height * 0.74);
    }

    // 4. Draw Footer Contact Information
    ctx.textBaseline = 'bottom';
    const contactText = config.contactInfo.trim() || 'REGISTRATION RECRUITING NOW';

    if (isMinimal) {
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px "Space Grotesk", sans-serif';
      ctx.fillText(contactText, width / 2, height - 60);

      // Thin separator line
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, height - 90);
      ctx.lineTo(width - 100, height - 90);
      ctx.stroke();
    } else if (isCartoon) {
      // Cartoon styled footer bar container
      ctx.fillStyle = '#000000';
      ctx.fillRect(width / 2 - 260, height - 105, 520, 55);
      ctx.fillStyle = '#a7f3d0'; // emerald-250
      ctx.fillRect(width / 2 - 255, height - 100, 510, 45);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 18px "Space Grotesk", sans-serif';
      ctx.fillText(`ENROLL AT: ${contactText}`, width / 2, height - 70);
    } else {
      // Modern High-Tech futuristic border container
      ctx.fillStyle = 'rgba(22, 23, 42, 0.75)';
      ctx.strokeStyle = 'rgba(147, 51, 234, 0.4)';
      ctx.lineWidth = 2.5;

      const rectW = Math.min(width - 100, 560);
      const rectH = 50;
      ctx.fillRect(width / 2 - rectW / 2, height - 95, rectW, rectH);
      ctx.strokeRect(width / 2 - rectW / 2, height - 95, rectW, rectH);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '16px "JetBrains Mono", sans-serif';
      ctx.fillText(`⚡ CONNECT WITH US: ${contactText} ⚡`, width / 2, height - 70);
    }
  };

  // Helper text-wrap algorithm to neatly flow user-defined headlines on HTML5 Canvas
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  };

  // Redraw canvas whenever ratio, configs or styles shift
  useEffect(() => {
    if (hasGeneratedPoster) {
      drawPoster();
    }
  }, [config, selectedRatio, hasGeneratedPoster]);

  const handleGeneratePrompt = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!config.companyName.trim() || !config.courseName.trim()) {
      alert('Please fill out both Company Name and Course Name to generate.');
      return;
    }

    setIsGeneratingPrompt(true);
    setSuccessAnimation(false);

    try {
      const response = await fetch('/api/generate-poster-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      if (data.prompt) {
        setGeneratedPrompt(data.prompt);
        setSuccessAnimation(true);
        onAddNotification(`Generated a ${config.posterStyle} copy-prompt template for "${config.companyName}".`);
      }
    } catch (err) {
      console.error('Error calling poster api:', err);
      // Fallback
      const fallback = `A stunning professional ${config.posterStyle} branding poster engineered for "${config.companyName}". Main title showcases: "${config.courseName}". Background uses rich modern hues, 8k resolution, cinematic atmosphere. Reach out: "${config.contactInfo || 'Register Today'}".`;
      setGeneratedPrompt(fallback);
      onAddNotification(`Generated prompt with fallback copy parameters for "${config.companyName}".`);
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleGeneratePosterGraphic = () => {
    if (!config.companyName.trim() || !config.courseName.trim()) {
      alert('Please enter Company Name and Course Name to generate the poster.');
      return;
    }

    setIsGeneratingPoster(true);
    setPosterProgress(10);

    const interval = setInterval(() => {
      setPosterProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGeneratingPoster(false);
          setHasGeneratedPoster(true);
          onAddNotification(`Synthesized visual ${config.posterStyle} poster successfully.`);
          // Execute immediate render draw
          setTimeout(() => drawPoster(), 100);
          return 100;
        }
        return prev + 15;
      });
    }, 120);
  };

  const handleDownloadPosterPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      alert('Poster has not been generated yet. Please click "Generate Poster" first.');
      return;
    }

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${config.companyName.toLowerCase().replace(/\s+/g, '_')}_${selectedRatio || 'poster'}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
      onAddNotification(`Downloaded high-res ${selectedRatio} compiled graphic poster PNG.`);
    } catch (e) {
      console.error('Canvas download issue:', e);
      alert('Error creating PNG binary. Please ensure external assets comply with frame boundaries.');
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onAddNotification('Refined poster prompt copy synced to clipboard.');
  };

  const handleDownloadTxtPrompt = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedPrompt], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${config.companyName.replace(/\s+/g, '_') || 'AI'}_prompts_copy.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onAddNotification('Exported copy prompt as text file.');
  };

  return (
    <div
      id="poster-panel-root"
      className="w-full lg:w-[420px] shrink-0 bg-[#121324] border border-[#231b40]/80 rounded-3xl p-6 shadow-xl shadow-[#0c0c16] flex flex-col relative overflow-hidden"
    >
      {/* Decorative neon gradient glow inside boundary */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-indigo-650/10 rounded-full blur-2xl pointer-events-none" />

      <h2 id="poster-panel-header" className="font-display font-bold text-[18px] text-white tracking-wide mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
        Poster Creator Studio
      </h2>

      {/* Inputs form */}
      <div className="space-y-4 font-sans mb-5">
        {/* Company Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Company Name</label>
          <input
            id="input-company-name"
            type="text"
            required
            placeholder="e.g. BrainCorp AI"
            value={config.companyName}
            onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
            className="w-full px-4 py-3 text-xs bg-[#181a30] border border-[#272944] rounded-xl text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
          />
        </div>

        {/* Course/Campaign Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Course Name / Event Title</label>
          <input
            id="input-course-name"
            type="text"
            required
            placeholder="e.g. Deep Neural Architectures"
            value={config.courseName}
            onChange={(e) => setConfig({ ...config, courseName: e.target.value })}
            className="w-full px-4 py-3 text-xs bg-[#181a30] border border-[#272944] rounded-xl text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
          />
        </div>

        {/* Campaign Info */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Contact Info / Footnote</label>
          <input
            id="input-contact-info"
            type="text"
            placeholder="e.g. hello@braincorp.ai"
            value={config.contactInfo}
            onChange={(e) => setConfig({ ...config, contactInfo: e.target.value })}
            className="w-full px-4 py-3 text-xs bg-[#181a30] border border-[#272944] rounded-xl text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
          />
        </div>

        {/* Poster Style */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Poster Art Style</label>
          <div className="relative">
            <select
              id="select-poster-style"
              value={config.posterStyle}
              onChange={(e) => setConfig({ ...config, posterStyle: e.target.value })}
              className="w-full px-4 py-3 text-xs bg-[#181a30] border border-[#272944] rounded-xl text-white outline-none focus:border-purple-500 transition-all duration-300 appearance-none cursor-pointer"
            >
              {styles.map((style) => (
                <option key={style} value={style} className="bg-[#141527] text-white">
                  {style}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-[10px]">
              ▼
            </div>
          </div>
        </div>

        {/* MANDATORY AGENT DIRECTIVE: Aspect Ratio selection buttons group */}
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">
            Select Aspect Ratio Suggestions
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {ratios.map((item) => {
              const isSelected = selectedRatio === item.id;
              return (
                <button
                  key={item.id}
                  id={`btn-ratio-selector-${item.id.replace(':', '-')}`}
                  onClick={() => {
                    setSelectedRatio(item.id);
                    onAddNotification(`Active output format switched to ${item.label} (${item.id} ratio).`);
                    // If poster has already been drafted, draw it onto the new aspect ratio canvas
                    if (!hasGeneratedPoster) {
                      setHasGeneratedPoster(true);
                    }
                  }}
                  className={`p-3 text-left rounded-xl transition-all duration-300 cursor-pointer border ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 text-white shadow-md shadow-purple-900/10'
                      : 'bg-[#181a30] border-[#272944] hover:border-[#3c3e60] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
                    <span className="text-[10px] font-mono font-semibold bg-[#21233e] px-1.5 py-0.5 rounded text-purple-300">
                      {item.id}
                    </span>
                  </div>
                  <span className="text-[9px] text-[#8c8db1] leading-tight block">
                    {item.suggestion}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Actions Buttons Group */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Action Button 1: Copywriting Text Prompt Generator */}
          <button
            id="btn-generate-poster-prompt"
            onClick={handleGeneratePrompt}
            disabled={isGeneratingPrompt}
            title="Generate text copy engineering layout specs via Gemini model"
            className="py-3 px-3 bg-[#17182b] hover:bg-[#20223b] border border-[#2d2f4d] disabled:opacity-50 text-gray-300 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            {isGeneratingPrompt ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                <span>Writing Prompt...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Gen Copy Prompt</span>
              </>
            )}
          </button>

          {/* Action Button 2: BRAND NEW physical "Generate Poster Graph" compiler button requested */}
          <button
            id="btn-trigger-graphic-poster"
            onClick={handleGeneratePosterGraphic}
            disabled={isGeneratingPoster}
            className="py-3 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-purple-950/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isGeneratingPoster ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Rendering...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
                <span>Generate Poster</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress feedback for the custom visual generation flow */}
      {isGeneratingPoster && (
        <div className="mb-4 font-sans bg-[#0c0d18] p-3 rounded-2xl border border-purple-950/30">
          <div className="flex justify-between text-[10px] text-purple-300 mb-1 uppercase font-bold tracking-wider">
            <span>Combining high-resolution visual layout overlays...</span>
            <span>{posterProgress}%</span>
          </div>
          <div className="w-full bg-[#181a30] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 h-full transition-all duration-150"
              style={{ width: `${posterProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* INTERACTIVE DIGITAL POSTER CANVAS PREVIEW PANEL */}
      {hasGeneratedPoster && (
        <div className="mb-5 space-y-2 select-none">
          <label className="block text-[11px] font-bold text-[#a1a1c2] uppercase tracking-wider">
            ⚡ Generated Canvas Preview ({selectedRatio || 'Default 1:1'} ratio)
          </label>

          {/* This renders dynamically according to chosen aspect ratio CSS constraints */}
          <div className="w-full bg-[#080914] rounded-2xl border border-purple-500/20 p-4 flex flex-col items-center justify-center min-h-[220px]">
            <div
              className="relative shadow-2xl transition-all duration-300 border border-gray-800 rounded-xl overflow-hidden"
              style={{
                width: '100%',
                maxWidth: '220px',
                aspectRatio: selectedRatio === '4:5' ? '4/5' : selectedRatio === '16:9' ? '16/9' : selectedRatio === '9:16' ? '9/16' : '1/1'
              }}
            >
              <canvas
                ref={canvasRef}
                width={selectedRatio ? ratios.find(r => r.id === selectedRatio)?.width : 1000}
                height={selectedRatio ? ratios.find(r => r.id === selectedRatio)?.height : 1000}
                className="w-full h-full object-contain cursor-zoom-in"
              />
            </div>
            <span className="text-[10px] font-mono text-[#a1a1c2] mt-2 block select-none">
              Double click preview canvas area to inspect code settings
            </span>
          </div>
        </div>
      )}

      {/* CONDITIONAL DOWNLOAD BAR: Shown solely if the user has selected any aspect ratio option */}
      {selectedRatio && (
        <div className="mb-5 animate-in slide-in-from-bottom-2 duration-300 font-sans">
          <button
            id="btn-download-poster-png"
            onClick={handleDownloadPosterPNG}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all duration-300 shadow-md shadow-green-950/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-250 animate-bounce" />
                <span>Copied Image Binary! Download Initiated</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-emerald-200" />
                <span>Download Poster PNG ({selectedRatio})</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-center text-gray-500 mt-1.5 leading-relaxed">
            Format optimized for {ratios.find(r => r.id === selectedRatio)?.suggestion}.
          </p>
        </div>
      )}

      {/* Generated Core Prompt Text copy Area */}
      <div className="mt-2 space-y-3">
        <label className="block text-[11px] font-bold text-[#8e8fa3] uppercase tracking-wider">AI Layout Prompter Text Code</label>
        <div
          id="output-prompt-container"
          className={`relative p-3.5 rounded-2xl min-h-[100px] max-h-[130px] overflow-y-auto text-[11px] leading-relaxed font-mono bg-[#0c0d18] border text-[#dfdfed] select-text select-all ${
            successAnimation ? 'border-green-500/60 shadow-md shadow-green-950/10' : 'border-[#22243d]'
          } transition-all duration-500`}
        >
          {generatedPrompt}
        </div>

        {/* Secondary copy and export buttons */}
        <div className="grid grid-cols-2 gap-2.5 pb-1 font-sans">
          <button
            id="btn-copy-poster-prompt"
            onClick={handleCopyPrompt}
            className="py-2.5 px-3 bg-[#6349ed] hover:bg-[#523ad6] text-white text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-300" /> : <Copy className="w-3.5 h-3.5 text-purple-200" />}
            <span>{copied ? 'Copied' : 'Copy Text Data'}</span>
          </button>
          <button
            id="btn-download-poster-prompt"
            onClick={handleDownloadTxtPrompt}
            className="py-2.5 px-3 bg-[#17182b] hover:bg-[#20223b] border border-[#2d2f4d] text-gray-300 text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-400" />
            <span>Save TXT Meta</span>
          </button>
        </div>
      </div>
    </div>
  );
}
