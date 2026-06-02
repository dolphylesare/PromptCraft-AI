/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bell, Sun, Moon, Sparkles, User, Info, Check, Plus, Trash } from 'lucide-react';
import React, { useState } from 'react';

interface HeaderProps {
  currentTitle: string;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  profilePhoto: string | null;
  onUpdateProfilePhoto: (photo: string | null) => void;
  onAddNotification: (text: string) => void;
}

export default function Header({ 
  currentTitle, 
  theme, 
  setTheme, 
  profilePhoto, 
  onUpdateProfilePhoto,
  onAddNotification 
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New "AI Course Promo" template added.', read: false, time: '2 mins ago' },
    { id: 2, text: 'Poster design generated using Ultra Realistic style.', read: true, time: '1 hour ago' },
    { id: 3, text: 'Synced 6 offline templates with Google Cloud.', read: true, time: '1 day ago' }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header id="header-container" className="flex items-center justify-between px-8 py-5 border-b border-[#1e2030]/60 bg-[#0c0d18] sticky top-0 z-20 select-none">
      {/* Page Title */}
      <h1 id="header-page-title" className="font-display font-bold text-2xl text-white tracking-tight flex items-center gap-2">
        <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          {currentTitle}
        </span>
      </h1>

      {/* Right Toolbar */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <div className="relative">
          <button
            id="header-notification-button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="w-10 h-10 bg-[#161726] hover:bg-[#202238] rounded-xl border border-[#272944] text-gray-300 flex items-center justify-center transition-all duration-300 pointer-events-auto relative cursor-pointer"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span id="notification-badge" className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-sans text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0c0d18] animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-[#141527] border border-[#272944] rounded-2xl shadow-xl shadow-black/80 p-4 z-50 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-[#20223b] mb-2">
                <span className="font-semibold text-xs text-white">System Logs & Updates</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[10px] text-purple-400 hover:text-purple-300 font-medium cursor-pointer">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-xl transition-all duration-200 text-xs border ${
                      notif.read
                        ? 'bg-[#181a30]/30 border-[#1f213a] text-gray-400'
                        : 'bg-[#1e1a3b] border-purple-900/60 text-gray-200 hover:bg-[#221c44]'
                    }`}
                  >
                    <p className="leading-tight mb-1">{notif.text}</p>
                    <span className="text-[9px] text-[#8e8fa3]">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Profile */}
        <div className="relative">
          <button
            id="header-profile-button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center justify-center p-0.5 rounded-full bg-gradient-to-tr from-purple-500 via-cyan-400 to-indigo-500 cursor-pointer pointer-events-auto transition-all duration-300 hover:scale-105"
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="User profile photo"
                className="w-9 h-9 rounded-full object-cover border-2 border-[#121325]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#1b1c31] text-purple-400 text-[11px] font-extrabold flex items-center justify-center border-2 border-[#121325] select-none shadow-inner font-sans">
                PD
              </div>
            )}
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-72 bg-[#141527] border border-[#272944] rounded-2xl shadow-xl shadow-black/80 p-4.5 z-50 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="flex flex-col items-center text-center pb-4 border-b border-[#20223b]/80 mb-3 space-y-3">
                <div className="relative group select-none">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/80 shadow"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-lg font-bold text-white border-2 border-purple-500/20 shadow">
                      PD
                    </div>
                  )}
                  
                  {/* Invisible hover overlay to let users upload photo by clicking direct on image container */}
                  <label className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer text-white font-bold text-[9px] uppercase tracking-wider">
                    Change
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const result = ev.target?.result as string;
                            if (result) {
                              onUpdateProfilePhoto(result);
                              onAddNotification('Brand new profile photo uploaded and stored in Local Storage!');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-white">Prompt Designer</h4>
                  <p className="text-[10px] text-gray-400 font-mono">dolphylesarej2002@gmail.com</p>
                </div>

                {/* Account Actions: Upload & Remove */}
                <div className="flex gap-2 w-full pt-1">
                  <label className="flex-1 py-1.5 px-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[9px] uppercase tracking-wider text-center rounded-xl cursor-pointer transition-all inline-flex items-center justify-center gap-1">
                    <Plus className="w-3 h-3" />
                    Upload
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const result = ev.target?.result as string;
                            if (result) {
                              onUpdateProfilePhoto(result);
                              onAddNotification('Uploaded profile photo successfully.');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {profilePhoto && (
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateProfilePhoto(null);
                        onAddNotification('Removed profile photo successfully.');
                      }}
                      className="py-1.5 px-2 bg-red-950/20 hover:bg-red-955/40 border border-red-800/30 text-red-300 font-bold text-[9px] uppercase tracking-wider rounded-xl cursor-pointer transition-all inline-flex items-center justify-center gap-1 font-sans"
                    >
                      <Trash className="w-3 h-3" />
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-gray-400 p-2 rounded-lg hover:bg-[#1b1c34]">
                  <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5 text-yellow-400" /> Subscription</span>
                  <span className="text-[10px] bg-purple-950 text-purple-400 px-2 py-0.5 rounded-full border border-purple-900/60 font-semibold">AI PRO</span>
                </div>
                <div className="flex items-center justify-between text-gray-400 p-2 rounded-lg hover:bg-[#1b1c34]">
                  <span className="flex items-center gap-2"><Info className="w-3.5 h-3.5 text-cyan-400" /> Current Mode</span>
                  <span className="text-[10px] text-gray-300">Client + Server</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle in Top Right */}
        <div className="flex items-center gap-2 bg-[#141527] border border-[#272944] p-1 rounded-2xl shadow-inner shadow-black/40">
          <button
            id="theme-toggle-light"
            onClick={() => setTheme('light')}
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
              theme === 'light' ? 'bg-gradient-to-r from-amber-500 to-orange-400 text-[#0c0d18] shadow' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            id="theme-toggle-dark"
            onClick={() => setTheme('dark')}
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
              theme === 'dark' ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
