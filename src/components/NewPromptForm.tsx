/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Sparkles, Loader2, Check, ArrowRight } from 'lucide-react';
import { PromptCard } from '../types';
import { AVAILABLE_CATEGORIES } from '../data';

interface NewPromptFormProps {
  onAddCard: (card: PromptCard) => void;
  onAddNotification: (text: string) => void;
}

export default function NewPromptForm({ onAddCard, onAddNotification }: NewPromptFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(AVAILABLE_CATEGORIES[0]);
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !topic.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/refine-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promptTopic: topic }),
      });

      let refinedResult = '';
      if (response.ok) {
        const data = await response.json();
        refinedResult = data.prompt;
      } else {
        throw new Error('Fallback called due to response issue');
      }

      const generatedCard: PromptCard = {
        id: String(Date.now()),
        title: title.trim(),
        description: refinedResult.length > 100 ? refinedResult.substring(0, 100) + '...' : refinedResult,
        fullPrompt: refinedResult,
        category: category,
        isFavorite: false,
        author: 'Gemini AI',
      };

      onAddCard(generatedCard);
      onAddNotification(`Drafted brand new "${title}" template using Gemini.`);

      // Reset Form State
      setTitle('');
      setTopic('');
      setIsOpen(false);
    } catch (err) {
      // Fallback
      const genericRefinement = `Act as an expert content developer. Please construct a comprehensive strategy regarding "${topic}" that optimizes target audience click-through rate, details brand voice consistency, and scales multi-channel engagement effectively.`;
      const generatedCard: PromptCard = {
        id: String(Date.now()),
        title: title.trim(),
        description: genericRefinement.substring(0, 100) + '...',
        fullPrompt: genericRefinement,
        category: category,
        isFavorite: false,
        author: 'System Prompt',
      };
      onAddCard(generatedCard);
      onAddNotification(`Created manual "${title}" template successfully.`);
      setTitle('');
      setTopic('');
      setIsOpen(false);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="new-prompt-form-section" className="mb-6 font-sans select-none">
      {!isOpen ? (
        <button
          id="btn-open-prompt-draft-panel"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3 text-xs font-semibold bg-gradient-to-r from-purple-950/40 via-purple-900/40 to-indigo-950/40 border border-[#3e245a] hover:border-purple-500 rounded-xl text-purple-200 hover:text-white transition-all duration-300 shadow-md shadow-black/20 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-purple-400" />
          <span>Draft New Template with Gemini AI</span>
        </button>
      ) : (
        <div className="bg-[#141527] border border-[#2b1f4c] rounded-2xl p-5 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between pb-3 border-b border-[#20223b] mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Draft New AI Prompt Template</h4>
            </div>
            <button
              id="btn-close-prompt-draft-panel"
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-500 hover:text-gray-300 font-medium cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Prompt Title */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Template Title</label>
                <input
                  id="draft-title"
                  type="text"
                  required
                  placeholder="e.g. Email Newsletter Copy"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-[#1a1b32] border border-[#272944] rounded-xl text-white outline-none focus:border-purple-500 transition-all duration-300"
                />
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Select Category</label>
                <select
                  id="draft-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs bg-[#1a1b32] border border-[#272944] rounded-xl text-white outline-none focus:border-purple-500 transition-all duration-300 cursor-pointer appearance-none"
                >
                  {AVAILABLE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#141527] text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prompt Concept */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Prompt Concept / Brief Topic</label>
              <textarea
                id="draft-topic"
                required
                rows={2}
                placeholder="Describe what Gemini should engineer (e.g. 'Generate an email pitch for a pet shop promoting high-quality chew toys')"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-[#1a1b32] border border-[#272944] rounded-xl text-white outline-none focus:border-purple-500 transition-all duration-300 resize-none font-mono"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-1">
              <button
                id="btn-submit-prompt-draft"
                type="submit"
                disabled={isGenerating}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all duration-300"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-200" />
                    <span>Refining Prompt...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-purple-200 animate-pulse" />
                    <span>Refined by Gemini</span>
                    <ArrowRight className="w-3.5 h-3.5 text-purple-200 ml-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
