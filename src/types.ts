/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PromptCard {
  id: string;
  title: string;
  description: string;
  fullPrompt: string;
  category: string;
  isFavorite: boolean;
  author?: string;
}

export interface PosterConfig {
  companyName: string;
  courseName: string;
  contactInfo: string;
  posterStyle: 'Ultra Realistic' | 'Cartoon' | 'Minimalist' | string;
}

export type SidebarTab = 'Dashboard' | 'Prompt Creator' | 'Poster Creator' | 'My Favorites' | 'Categories' | 'Settings';
