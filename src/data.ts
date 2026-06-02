/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PromptCard } from './types';

export const INITIAL_PROMPT_CARDS: PromptCard[] = [
  {
    id: '1',
    title: 'AI Course Promo',
    description: 'AI Course Promo avike up hr consectetur adipiscing elit Moden and lover to harget ati and rutiors, and prolloosional...',
    fullPrompt: 'Write a high-converting promotional copy for a new AI-powered programming course. Highlight modules like advanced system neural networks, vector databases, and real-time LLM caching. The target audience represents senior software architects and technical leads. Maintain an authoritative yet inspiring, instructional tone.',
    category: 'Digital Marketing',
    isFavorite: false,
    author: 'PrompterAI'
  },
  {
    id: '2',
    title: 'Instagram Caption',
    description: "Instagram caption is as 'inetemized pomose your, writs in your hamv instagram with your badicnover!",
    fullPrompt: 'Draft an engaging, humorous Instagram caption for a newly launched tech startup. Structure it as a bulleted list containing humorous facts about late-night coding, coffee dependency, and deployment anxiety. Include trending hashtags like #StartupLife, #CodeLife, and #AIInception.',
    category: 'Social Media',
    isFavorite: true,
    author: 'GramGen'
  },
  {
    id: '3',
    title: 'AI Contact Info',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam renoimed tempor deneurootim-cotume et bime...',
    fullPrompt: 'Develop a professional email auto-responder layout representing a regional AI consulting firm. It should gracefully manage clients thanking them for contacting us, setting expectations for a response within 4 hours, and outlining team operational details with clear next steps.',
    category: 'Website Content',
    isFavorite: false,
    author: 'SyncCorp'
  },
  {
    id: '4',
    title: 'Instagram Caption',
    description: 'Your prompt mean is codated and mairer subnres your Instagram caption...',
    fullPrompt: 'Create alternative professional Instagram photo captions summarizing a tech workshop event. Ensure to emphasize active dynamic teamwork, real-world APIs, and hands-on laboratory experiences. Tone: dynamic, approachable, professional.',
    category: 'Social Media',
    isFavorite: false,
    author: 'GramGen'
  },
  {
    id: '5',
    title: 'Copywriting',
    description: "Create a prenate lizar' content. 'Copywriting can help prevento. social content.",
    fullPrompt: 'Construct an elegant landing page sales copy promoting an AI-driven grammar enhancer tool. Focus on emphasizing time efficiency, reducing copywriting fatigue, and keeping consistent vocabulary across various multi-channel team accounts.',
    category: 'Copywriting',
    isFavorite: false,
    author: 'CopyElite'
  },
  {
    id: '6',
    title: 'AI Course Promo',
    description: 'I irrtveruce an inion to reesign and creative incusion and prompts..eotsrencing...',
    fullPrompt: 'Design an attractive email campaign sequence designed to re-engage past graduates of our software design bootcamps. Pitch them our new specialty course: AI Prompt Engineering & Cognitive Architecture optimization.',
    category: 'Digital Marketing',
    isFavorite: false,
    author: 'PrompterAI'
  }
];

export const AVAILABLE_CATEGORIES = [
  'Digital Marketing',
  'Social Media',
  'Website Content',
  'Copywriting',
  'Art Inspiration'
];
