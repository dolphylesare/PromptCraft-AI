/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SidebarTab } from '../types';
import { Sparkles, Image, Heart, Grid, Settings, Brain, Zap } from 'lucide-react';

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  favoritesCount: number;
  profilePhoto: string | null;
}

export default function Sidebar({ activeTab, setActiveTab, favoritesCount, profilePhoto }: SidebarProps) {
  const mainNavItems: { id: SidebarTab; label: string; icon: React.FC<any> }[] = [
    { id: 'Prompt Creator', label: 'Prompt Creator', icon: Sparkles },
    { id: 'Poster Creator', label: 'Poster Creator', icon: Image },
    { id: 'My Favorites', label: 'My Favorites', icon: Heart },
    { id: 'Categories', label: 'Categories', icon: Grid },
    { id: 'Settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside id="sidebar-container" className="w-64 bg-[#11121d] border-r border-[#1e2030] flex flex-col justify-between h-screen sticky top-0 text-gray-400 select-none z-10">
      {/* Top Section */}
      <div className="flex flex-col pt-6">
        {/* Logo Container */}
        <div className="flex flex-col items-center justify-center gap-2 mb-8 px-6">
          <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#1b1c31] to-[#121324] rounded-2xl border border-[#2e1d52]/50 shadow-lg shadow-purple-950/20">
            {/* Brain Outline with Custom Lightning Bolt */}
            <Brain className="w-9 h-9 text-purple-400" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_8px_#06b6d4]">
              <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400" />
            </div>
          </div>
          <span className="font-display font-bold text-lg bg-gradient-to-r from-white via-purple-300 to-indigo-200 bg-clip-text text-transparent tracking-wide">
            Prompt<span className="text-[#927cf1]">Craft AI</span>
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5 px-3">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[14px] font-medium transition-all duration-300 relative group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#211d3d] to-[#1a172e] text-white border-l-4 border-purple-500 shadow-md shadow-purple-950/20 font-semibold'
                    : 'hover:bg-[#181a29] hover:text-gray-200'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-purple-400' : 'text-gray-400 group-hover:text-[#a0c4ff]'
                }`} />
                <span>{item.label}</span>

                {/* Badge for Favorites */}
                {item.id === 'My Favorites' && favoritesCount > 0 && (
                  <span className="ml-auto bg-purple-600 text-[10px] font-bold text-white px-2 py-0.5 rounded-full animate-pulse">
                    {favoritesCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-[#1e2030]/60 space-y-2.5">
        {/* Profile Avatar Section in Sidebar */}
        <div id="sidebar-profile-card" className="mx-1.5 p-2.5 bg-[#171827]/60 border border-[#23253b]/40 rounded-2xl flex items-center gap-2.5 transition-all">
          <div className="relative shrink-0 select-none">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile avatar"
                className="w-10 h-10 rounded-full object-cover border border-purple-500/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white border border-purple-500/20 shadow-inner">
                PD
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#11121d] rounded-full" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[12px] font-bold text-white truncate">Prompt Designer</p>
            <p className="text-[9.5px] text-slate-500 font-mono truncate">dolphylesarej2002@gmail.com</p>
          </div>
        </div>

        <button
          id="sidebar-bottom-settings"
          onClick={() => setActiveTab('Settings')}
          className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-[14px] font-medium text-gray-400 hover:bg-[#181a29] hover:text-gray-200 transition-all duration-300 group cursor-pointer"
        >
          <Settings className="w-[18px] h-[18px] text-gray-400 group-hover:text-purple-400 group-hover:rotate-45 transition-all duration-500" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
