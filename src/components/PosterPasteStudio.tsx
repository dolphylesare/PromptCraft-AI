/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Copy, Download, Trash2, Sparkles, Loader2, FileText, Check, ArrowRight } from 'lucide-react';

interface PosterPasteStudioProps {
  onAddNotification: (text: string) => void;
}

export default function PosterPasteStudio({ onAddNotification }: PosterPasteStudioProps) {
  const [content, setContent] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('prompt_craft_poster_draft');
      return saved || 'Paste your dynamic poster prompt or raw guidelines here... \n\nExample:\nDraft a minimalist technical poster for NeuralCorp showcasing "Advanced Distributed Systems Course". Contact at courses@neuralcorp.ai.';
    } catch {
      return '';
    }
  });

  const [copied, setCopied] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('prompt_craft_poster_draft', content);
    } catch {
      // Safe ignore
    }
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    onAddNotification('Copied workspace poster prompt draft.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'poster_prompt_workspace.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onAddNotification('Downloaded workspace draft as TXT.');
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the paste workspace?')) {
      setContent('');
      onAddNotification('Cleared copy and paste area.');
    }
  };

  const handlePolish = async () => {
    if (!content.trim() || content.startsWith('Paste your dynamic poster')) {
      alert('Please paste some text/concepts to polish first.');
      return;
    }

    setIsPolishing(true);
    try {
      const res = await fetch('/api/refine-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptTopic: `Transform this raw poster draft into a professional AI poster design prompt: "${content}"` }),
      });

      if (res.ok) {
        const data = await res.json();
        setContent(data.prompt);
        onAddNotification('Polished poster prompt using Gemini AI.');
      } else {
        throw new Error('Refine API fallback');
      }
    } catch {
      // Friendly local formatting fallback
      const polished = `[AI POLISHED] A visually cinematic modern advertising design. "${content.replace(/\n/g, ' ')}" styled with dramatic studio lighting, 8k resolution, modern corporate gradients, centered branding layout.`;
      setContent(polished);
      onAddNotification('Applied quick system formatting to your draft.');
    } finally {
      setIsPolishing(false);
    }
  };

  return (
    <div id="poster-paste-studio-root" className="bg-[#121324] border border-[#231b40]/80 p-6 rounded-3xl shadow-xl shadow-black/50 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-[#20223b]">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          <h3 className="font-display font-bold text-base text-white tracking-wide">Copy & Paste Area</h3>
        </div>
        <button
          id="btn-clear-paste-area"
          onClick={handleClear}
          title="Clear Area"
          className="p-2 hover:bg-[#1f213a] hover:text-red-400 rounded-xl transition-all text-gray-500 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed font-sans">
        This is your dedicated workspace. Paste raw prompts, design guidelines, or copy-pasted concepts here to manually refine them before rendering.
      </p>

      {/* Text Area Box */}
      <div className="relative">
        <textarea
          id="poster-paste-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={11}
          placeholder="Paste or write anything here..."
          className="w-full p-4 text-xs font-mono bg-[#0c0d18] border border-[#21233e] rounded-2xl text-gray-200 outline-none focus:border-purple-500 hover:border-[#35385e] transition-all leading-relaxed resize-y select-text min-h-[220px]"
        />
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <button
          id="btn-copy-paste-content"
          onClick={handleCopy}
          className="py-3 px-4 bg-[#6349ed] hover:bg-[#523ad6] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-purple-950/20"
        >
          {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4 text-purple-200" />}
          <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
        </button>

        <button
          id="btn-download-paste-content"
          onClick={handleDownload}
          className="py-3 px-4 bg-[#17182b] hover:bg-[#20223b] border border-[#2d2f4d] text-gray-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-gray-400" />
          <span>Download TXT</span>
        </button>

        <button
          id="btn-polish-paste-content"
          onClick={handlePolish}
          disabled={isPolishing}
          className="py-3 px-4 bg-gradient-to-r from-purple-950/40 via-purple-900/40 to-indigo-950/40 border border-[#3e245a] hover:border-purple-500 text-purple-200 hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
        >
          {isPolishing ? (
            <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
          ) : (
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          )}
          <span>Gemini Polish</span>
        </button>
      </div>
    </div>
  );
}
