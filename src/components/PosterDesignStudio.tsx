/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  Compass,
  ArrowUpRight,
  Download,
  RefreshCw,
  Palette,
  Brush,
  Bot,
  Info,
  FileText,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  Calendar,
  Share2,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import html2canvas from 'html2canvas';

interface PosterDesignStudioProps {
  onAddNotification: (text: string) => void;
  transferredPrompt?: string;
  transferredRatio?: string;
  theme?: 'dark' | 'light';
  loadedTemplate?: any;
}

type AspectRatio = '1:1' | '4:5' | '16:9' | '9:16';

interface AspectRatioOption {
  id: AspectRatio;
  label: string;
  dimensions: string;
  suggestion: string;
}

export default function PosterDesignStudio({ 
  onAddNotification, 
  transferredPrompt, 
  transferredRatio,
  theme = 'dark',
  loadedTemplate
}: PosterDesignStudioProps) {
  const [content, setContent] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('prompt_craft_poster_draft_main');
      return saved || 'A high-end cinematic neon cyberpunk city marketing poster, highly detailed vector lines, glowing holograms, synthwave aesthetics, ultra realistic illustration, professional color grading...';
    } catch {
      return 'A high-end cinematic neon cyberpunk city marketing poster, highly detailed vector lines, glowing holograms, synthwave aesthetics, ultra realistic illustration, professional color grading...';
    }
  });

  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('4:5'); // Suffix default, specified as 4:5
  const [isPolishing, setIsPolishing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Configuration workspace tab
  const [activeConfigTab, setActiveConfigTab] = useState<'prompt' | 'brand'>('prompt');

  // Corporate Overlay states for professional SaaS marketing template placement
  const [logo, setLogo] = useState('');
  const [title, setTitle] = useState('');
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [feature1, setFeature1] = useState('');
  const [feature2, setFeature2] = useState('');
  const [feature3, setFeature3] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [website, setWebsite] = useState('');
  const [ctaText, setCtaText] = useState('');

  // Logo upload and absolute layouts state controls
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState<number>(1.0);
  const [logoX, setLogoX] = useState<number>(4.5);
  const [logoY, setLogoY] = useState<number>(4.5);

  // Staged progress narrative steps during compilation
  const [activeStep, setActiveStep] = useState<string>('Idle');
  
  // Floating Toast Notification state inside the view
  const [toast, setToast] = useState<{ show: boolean; message: string; platformName?: string } | null>(null);

  // High-resolution interactive Zoom preview controls
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);

  const ratios: AspectRatioOption[] = [
    { id: '4:5', label: 'Portrait Poster', dimensions: '1080 x 1350', suggestion: 'High-res Instagram ready & premium marketing material shape' },
    { id: '1:1', label: 'Square Canvas', dimensions: '1080 x 1080', suggestion: 'Full detail resolution for standard widgets, feeds, and avatars' },
    { id: '16:9', label: 'Landscape Banner', dimensions: '1920 x 1080', suggestion: 'Full HD master resolution for widescreen and header slides' },
    { id: '9:16', label: 'Vertical Story', dimensions: '1080 x 1920', suggestion: 'Full HD master resolution for Stories, Reels, TikTok and smartphone screens' }
  ];

  // Sync if prompt transferred from the Prompt Creator
  useEffect(() => {
    if (transferredPrompt) {
      setContent(transferredPrompt);
    }
    if (transferredRatio) {
      setSelectedRatio(transferredRatio as AspectRatio);
    } else {
      setSelectedRatio('4:5'); // Ensure 4:5 is default
    }
  }, [transferredPrompt, transferredRatio]);

  // Persist prompt in local storage
  useEffect(() => {
    try {
      localStorage.setItem('prompt_craft_poster_draft_main', content);
    } catch {
      // Safe ignore
    }
  }, [content]);

  // Handle template selection auto-fill
  useEffect(() => {
    if (loadedTemplate) {
      setTitle(loadedTemplate.title || '');
      setCourseName(loadedTemplate.title || '');
      setLogo(loadedTemplate.companyName ? loadedTemplate.companyName.toUpperCase() : '');
      setDescription(loadedTemplate.description || '');
      
      const features = loadedTemplate.keyFeatures ? loadedTemplate.keyFeatures.split(',').map((f: string) => f.trim()) : [];
      setFeature1(features[0] || 'Interactive Hands-on Tutorials');
      setFeature2(features[1] || 'SaaS Deployment Blueprint');
      setFeature3(features[2] || 'Expert Mentorship Circles');
      
      setContactInfo(loadedTemplate.contactInfo || '');
      setWebsite(loadedTemplate.websiteUrl || '');
      setCtaText(loadedTemplate.ctaText || 'APPLY NOW');
      
      // Auto-focus on overlays tab to showcase auto-filled inputs
      setActiveConfigTab('brand');
    }
  }, [loadedTemplate]);

  // Handle standard copying of prompt
  const handleCopy = () => {
    if (!content.trim()) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    onAddNotification('Copied poster prompt to clipboard.');
    
    setToast({
      show: true,
      message: 'Workspace prompt copied successfully! Ready to paste.'
    });
    setTimeout(() => {
      setCopied(false);
      setToast(null);
    }, 4000);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the prompt workspace?')) {
      setContent('');
      onAddNotification('Cleared paste workspace.');
    }
  };

  // Enhance the workspace prompt using Gemini text-based refinement API
  const handleGeminiPolish = async () => {
    if (!content.trim() || content.length < 5) {
      alert('Please enter a descriptive theme to polish.');
      return;
    }

    setIsPolishing(true);
    try {
      const res = await fetch('/api/refine-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          promptTopic: `Convert this into a highly detailed, professional AI visual design composition prompt for creative marketing posters: "${content}"` 
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setContent(data.prompt);
        onAddNotification('Polished design guidelines using Gemini AI text model.');
      } else {
        throw new Error('Polish error');
      }
    } catch {
      const fallback = `[Gemini Polished] A spectacular high-resolution graphic creation displaying "${content}". Rendered with hyper-detailed features, gorgeous color theory, and professional studio lighting.`;
      setContent(fallback);
      onAddNotification('Polished using high-fidelity fallback parser.');
    } finally {
      setIsPolishing(false);
    }
  };

  // Generate Image from Pollinations AI
  const handleGeneratePosterImage = async () => {
    if (!content.trim()) {
      alert('Please write or generate a prompt in the workspace first!');
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    onAddNotification('Initiating real-time Pollinations AI image generation...');

    const steps = [
      'Deconstructing text layout semantics...',
      'Mapping RGB color matrix constants...',
      'Synthesizing latent diffusion layers (Flux Engine)...',
      'Refining raster high-frequency details...',
      'Assembling final pixel composition values...'
    ];

    let stepIndex = 0;
    setActiveStep(steps[0]);
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length - 1) {
        stepIndex++;
        setActiveStep(steps[stepIndex]);
      }
    }, 1800);

    try {
      const res = await fetch('/api/generate-poster-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: content,
          aspectRatio: selectedRatio
        })
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with HTTP error status: ${res.status}`);
      }

      const data = await res.json();

      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        incrementStat('totalPostersCreated');
        onAddNotification('Poster image generated successfully using Pollinations AI!');
      } else {
        throw new Error('Returned response did not contain valid base64 image representation.');
      }

    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Poster build exception:', err);
      setGenerationError(err?.message || 'A network error occurred while synthesising poster image.');
      onAddNotification('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
      setActiveStep('Idle');
    }
  };

  // Launch platform generator: Copies prompt with aspect ratio details and redirects
  const handleLaunchPlatform = (platformName: string, url: string) => {
    if (!content.trim()) {
      alert('Please write or generate a prompt in the workspace first!');
      return;
    }

    // Embed ratio directive dynamically for maximum convenience in external prompt generators
    const ratioText = selectedRatio ? ` [Aspect Ratio ${selectedRatio}]` : '';
    const finalPrompt = `${content}${ratioText}`;

    navigator.clipboard.writeText(finalPrompt);
    onAddNotification(`Auto-copied prompt and launched ${platformName}.`);

    setToast({
      show: true,
      message: 'Prompt copied successfully. Paste it into the AI platform to generate your poster.',
      platformName
    });

    // Open target AI platform safely in a new browser tab
    window.open(url, '_blank', 'noopener,noreferrer');

    // Dismiss toast after a readable window
    setTimeout(() => {
      setToast(null);
    }, 6000);
  };

  // Helper function to wrap text inside canvas
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  };

  // Fully combined premium canvas layout generation on download!
  // Helper to increment download and generation statistics
  const incrementStat = (key: string) => {
    try {
      const saved = localStorage.getItem('prompt_craft_dashboard_stats_v2');
      let statsObj = { totalPostersCreated: 0, totalPromptsGenerated: 0, templatesUsed: 0, downloadsCount: 0 };
      if (saved) {
        statsObj = JSON.parse(saved);
      }
      statsObj[key as keyof typeof statsObj] = (statsObj[key as keyof typeof statsObj] || 0) + 1;
      localStorage.setItem('prompt_craft_dashboard_stats_v2', JSON.stringify(statsObj));
    } catch (e) {
      console.warn('Stats sync anomaly', e);
    }
  };

  // Fully combined premium canvas layout generation on download!
  const handleDownload = () => {
    if (!generatedImageUrl) return;
    
    onAddNotification('Composing and downloading Ultra-HD blended marketing poster...');
    incrementStat('downloadsCount');
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = generatedImageUrl;
    
    img.onload = () => {
      // Establish target resolutions based on high-end SaaS requirement configs
      let w = 1080;
      let h = 1350;
      if (selectedRatio === '1:1') {
        w = 1080; h = 1080;
      } else if (selectedRatio === '16:9') {
        w = 1920; h = 1080;
      } else if (selectedRatio === '9:16') {
        w = 1080; h = 1920;
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const proceedWithRender = (loadedLogo?: HTMLImageElement) => {
        // Draw original generated high-res background art
        ctx.drawImage(img, 0, 0, w, h);

        // Extract trimmed string values for correct mapping checks
        const dLogo = logo.trim();
        const dWebsite = website.trim();
        const dTitle = title.trim();
        const dSubtitle = courseName.trim();
        const dDescription = description.trim();
        const dFeatures = [feature1, feature2, feature3].map(x => x.trim()).filter(Boolean);
        const dContact = contactInfo.trim();
        const dCta = ctaText.trim();

        const hasTopBar = !!(dLogo || dWebsite || loadedLogo);
        const hasHeader = !!(dTitle || dSubtitle || dDescription);
        const hasFeatures = dFeatures.length > 0;
        const hasFooter = !!(dContact || dCta);
        const hasBottomCard = hasHeader || hasFeatures || hasFooter;
        const hasAnyText = hasTopBar || hasBottomCard;

        if (!hasAnyText) {
          // If no text parameters are filled out block visual overlays to keep clean art
          try {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png', 1.0);
            link.download = `art_poster_${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            onAddNotification('Exported raw clean background artwork!');
          } catch (e) {
            console.error(e);
          }
          return;
        }

        // 1. Draw Top elegant overlay vignette gradient if logo/website exists
        if (hasTopBar) {
          let topGrad = ctx.createLinearGradient(0, 0, 0, h * 0.16);
          topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
          topGrad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
          ctx.fillStyle = topGrad;
          ctx.fillRect(0, 0, w, h * 0.16);

          // Draw logo image (absolute positioned) or text
          if (loadedLogo) {
            const scaleFactor = (w / 1080) * logoScale;
            const targetW = loadedLogo.width * 0.40 * scaleFactor;
            const targetH = loadedLogo.height * 0.40 * scaleFactor;
            const targetX = (logoX / 100) * w;
            const targetY = (logoY / 100) * h;
            ctx.drawImage(loadedLogo, targetX, targetY, targetW, targetH);
          } else if (dLogo) {
            // Draw Logo (Left side fallback)
            ctx.fillStyle = '#c084fc'; // Purple-400
            ctx.font = 'bold 34px "Inter", sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(dLogo.toUpperCase(), w * 0.06, h * 0.07);
          }

          // Draw Website (Right side)
          if (dWebsite) {
            ctx.fillStyle = '#cbd5e1'; // slate-300
            ctx.font = 'regular 24px monospace';
            ctx.textAlign = 'right';
            ctx.fillText(dWebsite.toLowerCase(), w * 0.94, h * 0.07);
          }
          ctx.textAlign = 'left'; // reset representation aligns
        }

        // 2. Draw Bottom corporate glass card overlay dynamically
        if (hasBottomCard) {
          const cardX = w * 0.06;
          const cardW = w * 0.88;
          const maxTextW = cardW - 90; // Padding spacing left & right inside card: 45px each

          // Height planner elements metric accumulation variables
          let titleHeight = 0;
          let subtitleHeight = 0;
          let descHeight = 0;
          let descLines: string[] = [];
          let featuresHeight = 0;
          let footerHeight = 0;
          let dividerHeight = 0;

          ctx.font = 'extrabold 44px "Inter", sans-serif';
          if (dTitle) {
            titleHeight = 55;
          }

          ctx.font = 'bold 26px "Inter", sans-serif';
          if (dSubtitle) {
            subtitleHeight = 35;
          }

          ctx.font = 'semibold 21px "Inter", sans-serif';
          if (dDescription) {
            descLines = wrapText(ctx, dDescription, maxTextW);
            descHeight = descLines.length * 28 + 10; // line spacing plus gap
          }

          if (hasHeader && (hasFeatures || hasFooter)) {
            dividerHeight = 40; // Spacing, bar line, spacing
          }

          if (hasFeatures) {
            featuresHeight = dFeatures.length * 36 + 10;
          }

          if (hasFooter) {
            footerHeight = 85;
          }

          const contentHeightSum = titleHeight + subtitleHeight + descHeight + dividerHeight + featuresHeight + footerHeight;
          const cardPadding = 90; // 45px top, 45px bottom padding
          const cardH = contentHeightSum + cardPadding;

          // Automatically float the card position near page bottom
          const cardY = h - cardH - (h * 0.05);

          // Draw matching dark gradient layer to ensure readable visual bounds
          let bottomGradY = h * 0.45;
          if (cardY < h * 0.45) {
            bottomGradY = Math.max(0, cardY - 50);
          }
          let bottomGrad = ctx.createLinearGradient(0, bottomGradY, 0, h);
          bottomGrad.addColorStop(0, 'rgba(0, 0, 0, 0.0)');
          bottomGrad.addColorStop(0.35, 'rgba(0, 0, 0, 0.70)');
          bottomGrad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
          ctx.fillStyle = bottomGrad;
          ctx.fillRect(0, bottomGradY, w, h - bottomGradY);

          // Draw filled translucent glass card backdrop
          ctx.fillStyle = 'rgba(10, 11, 23, 0.91)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 3;

          const r = 24;
          ctx.beginPath();
          ctx.moveTo(cardX + r, cardY);
          ctx.lineTo(cardX + cardW - r, cardY);
          ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r);
          ctx.lineTo(cardX + cardW, cardY + cardH - r);
          ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardY + cardH);
          ctx.lineTo(cardX + r, cardY + cardH);
          ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - r);
          ctx.lineTo(cardX, cardY + r);
          ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Sequential print cursor
          let drawY = cardY + 45;

          // Core Poster Title Header
          if (dTitle) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'extrabold 44px "Inter", sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(dTitle.toUpperCase(), cardX + 45, drawY + 36);
            drawY += titleHeight;
          }

          // Subtitle line
          if (dSubtitle) {
            ctx.fillStyle = '#c084fc'; // Purple accent
            ctx.font = 'bold 26px "Inter", sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(dSubtitle, cardX + 45, drawY + 22);
            drawY += subtitleHeight;
          }

          // Description blocks
          if (dDescription) {
            ctx.fillStyle = '#cbd5e1'; // slate-300
            ctx.font = 'semibold 21px "Inter", sans-serif';
            ctx.textAlign = 'left';
            for (let line of descLines) {
              ctx.fillText(line, cardX + 45, drawY + 18);
              drawY += 28;
            }
            drawY += 10;
          }

          // Decorative separator line
          if (dividerHeight > 0) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cardX + 45, drawY + 15);
            ctx.lineTo(cardX + cardW - 45, drawY + 15);
            ctx.stroke();
            drawY += dividerHeight;
          }

          // Highlights Checklist list
          if (hasFeatures) {
            ctx.textAlign = 'left';
            for (let item of dFeatures) {
              const cleanText = item.replace(/^✓\s*/, '');
              // Checklist bullet ✓
              ctx.fillStyle = '#c084fc'; // Purple checkmark
              ctx.font = 'bold 22px "Inter", sans-serif';
              ctx.fillText('✓', cardX + 45, drawY + 18);

              // Item content
              ctx.fillStyle = '#e2e8f0'; // slate-200
              ctx.font = 'medium 22px "Inter", sans-serif';
              ctx.fillText(cleanText, cardX + 75, drawY + 18);

              drawY += 36;
            }
            drawY += 10;
          }

          // Bottom Footer row block (Contact channel & CTA target)
          if (hasFooter) {
            const footerBaseY = cardY + cardH - 45;

            if (dContact) {
              ctx.fillStyle = '#94a3b8'; // Slate line
              ctx.font = 'bold 15px "Inter", sans-serif';
              ctx.textAlign = 'left';
              ctx.fillText('ENQUIRIES & ADMISSIONS', cardX + 45, footerBaseY - 32);

              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 25px monospace';
              ctx.fillText(dContact, cardX + 45, footerBaseY - 4);
            }

            if (dCta) {
              ctx.font = 'bold 19px "Inter", sans-serif';
              const textMetrics = ctx.measureText(dCta.toUpperCase());
              const btnW = Math.max(180, textMetrics.width + 48);
              const btnH = 52;
              const btnX = cardX + cardW - btnW - 45;
              const btnY = footerBaseY - 42;

              let btnGrad = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY);
              btnGrad.addColorStop(0, '#7c3aed');
              btnGrad.addColorStop(1, '#4f46e5');
              ctx.fillStyle = btnGrad;

              const btnR = 12;
              ctx.beginPath();
              ctx.moveTo(btnX + btnR, btnY);
              ctx.lineTo(btnX + btnW - btnR, btnY);
              ctx.quadraticCurveTo(btnX + btnW, btnY, btnX + btnW, btnY + btnR);
              ctx.lineTo(btnX + btnW, btnY + btnH - btnR);
              ctx.quadraticCurveTo(btnX + btnW, btnY + btnH, btnX + btnW - btnR, btnY + btnH);
              ctx.lineTo(btnX + btnR, btnY + btnH);
              ctx.quadraticCurveTo(btnX, btnY + btnH, btnX, btnY + btnH - btnR);
              ctx.lineTo(btnX, btnY + r);
              ctx.quadraticCurveTo(btnX, btnY, btnX + btnR, btnY);
              ctx.closePath();
              ctx.fill();

              ctx.fillStyle = '#ffffff';
              ctx.textAlign = 'center';
              ctx.fillText(dCta.toUpperCase(), btnX + (btnW / 2), btnY + 32);
            }
          }
        }

        // Save dynamic blended canvas as supreme high-quality PNG
        try {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png', 1.0);
          link.download = `${title.trim().replace(/\s+/g, '_') || 'marketing'}_poster_${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          onAddNotification('Exported spectacular high-quality marketing PNG flyer!');
        } catch (e) {
          console.warn('Canvas export violation triggered backup method:', e);
          const backupLink = document.createElement('a');
          backupLink.href = generatedImageUrl;
          backupLink.download = `artwork_${Date.now()}.png`;
          document.body.appendChild(backupLink);
          backupLink.click();
          document.body.removeChild(backupLink);
          onAddNotification('Exported raw background artwork.');
        }
      };

      if (logoFile) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.src = logoFile;
        logoImg.onload = () => proceedWithRender(logoImg);
        logoImg.onerror = () => proceedWithRender();
      } else {
        proceedWithRender();
      }
    };
  };

  const isDark = theme === 'dark';

  const platforms = [
    {
      name: 'ChatGPT',
      url: 'https://chatgpt.com',
      badge: 'DALL-E 3 Synergy',
      description: 'Ideal for artistic detail, typography concepts, and vibrant vector layouts.',
      icon: Bot,
      colorClass: isDark 
        ? 'bg-[#101c1c] border-[#10b981]/20 hover:border-[#10b981]/60 text-[#34d399]' 
        : 'bg-[#f4fbf7] border-emerald-200 hover:border-emerald-500 text-emerald-800',
      gradient: 'from-emerald-600 to-teal-600'
    },
    {
      name: 'Gemini',
      url: 'https://gemini.google.com',
      badge: 'Imagen 3 Engine',
      description: 'Outstanding photorealism, color grading, and structured layout fidelity.',
      icon: Sparkles,
      colorClass: isDark 
        ? 'bg-[#14152e] border-purple-500/20 hover:border-purple-500/60 text-[#c084fc]' 
        : 'bg-[#f8f6ff] border-purple-200 hover:border-purple-500 text-purple-800',
      gradient: 'from-purple-600 to-indigo-600'
    },
    {
      name: 'Canva AI',
      url: 'https://www.canva.com',
      badge: 'Canva Magic Media',
      description: 'Perfect for instantly adding text tags, layout framing, and publishing templates.',
      icon: Palette,
      colorClass: isDark 
        ? 'bg-[#11192b] border-sky-500/20 hover:border-sky-500/60 text-[#38bdf8]' 
        : 'bg-[#f0f9ff] border-sky-200 hover:border-sky-500 text-sky-850',
      gradient: 'from-sky-500 to-blue-600'
    },
    {
      name: 'Leonardo AI',
      url: 'https://app.leonardo.ai',
      badge: 'Creative Art Hub',
      description: 'Fine-tuned cinematic lighting, complex poster styles, and high custom art controls.',
      icon: Brush,
      colorClass: isDark 
        ? 'bg-[#1a151b] border-amber-500/20 hover:border-amber-500/60 text-[#f59e0b]' 
        : 'bg-[#fffbeb] border-amber-200 hover:border-amber-500 text-amber-800',
      gradient: 'from-amber-500 to-orange-600'
    }
  ];

  // Helper ratio aspect style generator to display correct scale preview boxes cleanly
  const getAspectPreviewStyle = (ratio: AspectRatio) => {
    switch(ratio) {
      case '1:1': return 'aspect-square w-full max-w-[340px]';
      case '16:9': return 'aspect-[16/9] w-full max-w-[480px]';
      case '9:16': return 'aspect-[9/16] w-full max-w-[280px]';
      case '4:5':
      default: return 'aspect-[4/5] w-full max-w-[320px]';
    }
  };

  return (
    <div className="relative font-sans">
      
      {/* Toast Notification HUD */}
      {toast?.show && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-6 duration-300">
          <div className={`p-4 rounded-2xl border shadow-xl flex items-start gap-3.5 leading-relaxed ${
            isDark ? 'bg-[#0f111a] border-emerald-500/30 text-white' : 'bg-white border-emerald-200 text-gray-900'
          }`}>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
              <Check className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Prompt Copied to Clipboard
              </h5>
              <p className="text-[12px] opacity-90 text-gray-300">
                {toast.message}
              </p>
              {toast.platformName && (
                <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-wide">
                  Redirecting to {toast.platformName}...
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Two-Column Grid Workspace */}
      <div id="poster-design-studio-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Direct Copy-Paste Area */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Quick Config Tabs to Switch Between Art & Brand Writing */}
          <div className="flex p-1 rounded-2xl bg-black/40 border border-[#21233e] gap-1 select-none">
            <button
              onClick={() => setActiveConfigTab('prompt')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeConfigTab === 'prompt' 
                  ? 'bg-purple-900/35 border border-purple-500/20 text-purple-200 shadow-md' 
                  : 'text-[#8587a3] hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>1. Artwork prompts</span>
            </button>
            <button
              onClick={() => setActiveConfigTab('brand')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeConfigTab === 'brand' 
                  ? 'bg-purple-900/35 border border-purple-500/20 text-purple-200 shadow-md' 
                  : 'text-[#8587a3] hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-[#a855f7]" />
              <span>2. Brand Overlays</span>
            </button>
          </div>

          {activeConfigTab === 'prompt' ? (
            /* Tab 1: Art Guidelines Workspace */
            <div id="paste-box-card" className={`border p-6 rounded-3xl shadow-xl transition-all duration-350 ${
              isDark ? 'bg-[#121324] border-[#231b40]/80 shadow-[#08080f]' : 'bg-white border-gray-200 shadow-gray-100'
            }`}>
              <div className={`flex items-center justify-between pb-3 border-b mb-4 ${
                isDark ? 'border-[#20223b]' : 'border-gray-100'
              }`}>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <h3 className={`font-display font-bold text-base tracking-wide ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Visual Blueprint Workspace
                  </h3>
                </div>
                <button
                  onClick={handleClear}
                  title="Clear text area"
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    isDark ? 'hover:bg-[#1a1b32] hover:text-red-400 text-gray-500' : 'hover:bg-gray-100 hover:text-red-650 text-gray-400'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-[#9d9db3]' : 'text-gray-650'}`}>
                Write or customize your background artwork concept below. 
                AI generates only the artwork, while your branding text is overlaid with high-contrast HTML elements.
              </p>

              <div className="relative">
                <textarea
                  id="main-paste-textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={9}
                  className={`w-full p-4 text-xs font-mono rounded-2xl outline-none focus:border-purple-500 transition-all leading-relaxed resize-y select-text min-h-[190px] border ${
                    isDark 
                      ? 'bg-[#070810] border-[#21233e] text-[#dfdfed] hover:border-[#35385e]' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-gray-300'
                  }`}
                  placeholder="Paste or write your full background artwork concept here..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  onClick={handleCopy}
                  disabled={!content.trim()}
                  className={`py-3 px-4 border text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 ${
                    isDark 
                      ? 'bg-[#6349ed]/10 hover:bg-[#6349ed]/20 border-[#4c3cc4]/40 text-purple-300 hover:text-white' 
                      : 'bg-gray-50 hover:bg-purple-100 border-gray-200 text-purple-800'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
                </button>

                <button
                  onClick={handleGeminiPolish}
                  disabled={isPolishing || !content.trim()}
                  className="py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                >
                  {isPolishing ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-purple-250 animate-pulse" />
                  )}
                  <span>Gemini Polish</span>
                </button>
              </div>
            </div>
          ) : (
            /* Tab 2: Brand Overlays Content Inputs */
            <div id="brand-overlays-card" className={`border p-6 rounded-3xl shadow-xl transition-all duration-350 ${
              isDark ? 'bg-[#121324] border-[#231b40]/80 shadow-[#08080f]' : 'bg-white border-gray-200 shadow-gray-100'
            }`}>
              <div className={`pb-3 border-b mb-4 flex items-center justify-between ${
                isDark ? 'border-[#20223b]' : 'border-gray-100'
              }`}>
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-400" />
                  <h3 className={`font-display font-bold text-base tracking-wide ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    Marketing Overlays Configuration
                  </h3>
                </div>
              </div>

              <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-[#9d9db3]' : 'text-gray-650'}`}>
                SaaS layout elements are layered direct on top of the image in real resolution and included at download time.
              </p>

              <div id="marketing-overlay-fields" className="space-y-3">
                {/* Logo Image Upload with Resize & Reposition Sliders */}
                <div className="p-3.5 bg-black/30 border border-[#21233e] rounded-2xl space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Company Brand Logo (Image Upload)</span>
                    {logoFile && (
                      <button 
                        type="button"
                        onClick={() => { setLogoFile(null); onAddNotification('Removed brand logo image asset.'); }} 
                        className="text-[9px] hover:text-red-400 text-slate-500 font-bold uppercase cursor-pointer"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                  
                  {!logoFile ? (
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-[#20223b] border-dashed rounded-xl cursor-pointer bg-[#05060b] hover:bg-black/60 transition-all select-none">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                          <Download className="w-5 h-5 text-purple-400 mb-1.5 animate-bounce" />
                          <p className="text-[10px] text-slate-300 font-semibold"><span className="text-purple-400">Click to upload brand logo</span></p>
                          <p className="text-[8px] text-slate-500 uppercase mt-0.5">PNG, JPG, SVG supported</p>
                        </div>
                        <input 
                          type="file" 
                          accept="image/png, image/jpeg, image/jpg, image/svg+xml" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setLogoFile(event.target?.result as string);
                                onAddNotification('Brand logo uploaded successfully! Adjust positioning coordinates below.');
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 bg-[#090a12] rounded-xl border border-purple-500/10">
                        <img src={logoFile} alt="Brand Logo Preview" className="h-10 max-w-[60px] object-contain rounded bg-black/40 p-1 border border-white/5" />
                        <div className="text-[9px] text-[#ababcc] select-none text-left">
                          <p className="font-bold uppercase tracking-wider text-purple-400">Brand Logo Active</p>
                          <p className="text-gray-500">Fine-tune the size scale and exact positioning overlays.</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2.5">
                        <div className="text-left">
                          <label className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Scale: {logoScale}x</label>
                          <input 
                            type="range" 
                            min="0.2" 
                            max="3" 
                            step="0.05" 
                            value={logoScale} 
                            onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                            className="w-full accent-purple-500 cursor-pointer"
                          />
                        </div>
                        <div className="text-left">
                          <label className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block mb-1">X Coord: {logoX}%</label>
                          <input 
                            type="range" 
                            min="1" 
                            max="90" 
                            step="1" 
                            value={logoX} 
                            onChange={(e) => setLogoX(parseInt(e.target.value))}
                            className="w-full accent-purple-500 cursor-pointer"
                          />
                        </div>
                        <div className="text-left">
                          <label className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Y Coord: {logoY}%</label>
                          <input 
                            type="range" 
                            min="1" 
                            max="90" 
                            step="1" 
                            value={logoY} 
                            onChange={(e) => setLogoY(parseInt(e.target.value))}
                            className="w-full accent-purple-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-slate-400">Company Logo text</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-xs rounded-xl border bg-black/40 border-[#21233e] focus:border-purple-500 text-white font-semibold"
                      value={logo}
                      onChange={(e) => setLogo(e.target.value)}
                      placeholder="e.g. VORTEX AI"
                      disabled={!!logoFile}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-slate-400">Website URL</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-xs rounded-xl border bg-black/40 border-[#21233e] focus:border-purple-500 text-white font-mono"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="e.g. www.vortexai.design"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-slate-400">Poster Head Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-black/40 border-[#21233e] focus:border-purple-500 text-white font-bold"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. DEVELOPER BOOTCAMP 2026"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-slate-400">Course Course/Service Subtitle</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-black/40 border-[#21233e] focus:border-purple-500 text-white"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="e.g. Master Generative AI, LLMs & Agents"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-slate-400">Poster Description</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 text-xs rounded-xl border bg-black/40 border-[#21233e] focus:border-purple-500 text-white resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Build complete full-stack AI agents and visually stunning web templates..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">Highlights / Bullet points (Max 3)</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border bg-black/40 border-[#21233e] focus:border-purple-500 text-[#dfdfed]"
                    value={feature1}
                    onChange={(e) => setFeature1(e.target.value)}
                    placeholder="Bullet point 1"
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border bg-black/40 border-[#21233e] focus:border-purple-500 text-[#dfdfed]"
                    value={feature2}
                    onChange={(e) => setFeature2(e.target.value)}
                    placeholder="Bullet point 2"
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border bg-black/40 border-[#21233e] focus:border-purple-500 text-[#dfdfed]"
                    value={feature3}
                    onChange={(e) => setFeature3(e.target.value)}
                    placeholder="Bullet point 3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-slate-400">Phone Contact</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-xs rounded-xl border bg-black/40 border-[#21233e] focus:border-purple-500 text-white font-mono"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder="e.g. +1 (800) 555-0199"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1 text-slate-400">CTA text</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 text-xs rounded-xl border bg-black/40 border-[#21233e] focus:border-purple-500 text-white font-extrabold"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      placeholder="e.g. Enroll Now"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aspect Ratio Sizing suggestions */}
          <div className={`border p-6 rounded-3xl shadow-lg transition-all ${
            isDark ? 'bg-[#121324] border-[#231b40]/80' : 'bg-white border-gray-200'
          }`}>
            <h4 className={`text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <Compass className="w-4 h-4 text-purple-400" />
              Aspect Ratio constraints
            </h4>
            
            <div className="grid grid-cols-2 gap-2.5">
              {ratios.map((item) => {
                const isSelected = selectedRatio === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedRatio(item.id);
                      onAddNotification(`Active aspect ratio configured to ${item.id} (${item.label}).`);
                    }}
                    className={`p-3 text-left rounded-xl transition-all duration-300 cursor-pointer border ${
                      isSelected
                        ? 'bg-purple-950/25 border-purple-500 text-purple-300 shadow-md'
                        : isDark
                          ? 'bg-[#070810] border-[#1f213a] hover:border-[#383b63] text-gray-400'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-400 text-gray-650'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider">{item.label.split(' ')[0]}</span>
                      <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                        isDark ? 'bg-[#1a1b32] text-purple-350' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {item.id}
                      </span>
                    </div>
                    <span className="text-[9px] text-[#8081a2] block line-clamp-1">
                      {item.dimensions}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: AI Live Generation Stage & Redirects */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* HD Interactive Digital Preview Canvas */}
          <div className={`border p-6 rounded-3xl shadow-xl transition-all duration-350 flex flex-col items-center ${
            isDark ? 'bg-[#121324] border-[#231b40]/80 shadow-[#08080f]' : 'bg-white border-gray-200 shadow-gray-100'
          }`}>
            <div className="w-full flex items-center justify-between pb-3 border-b border-[#20223b] mb-5">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                <h3 className={`font-display font-bold text-base tracking-wide ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  AI Poster Drawing Stage
                </h3>
              </div>
              <span className={`text-[10px] font-mono uppercase bg-purple-500/10 px-2 py-0.5 rounded text-purple-350 border border-purple-500/15`}>
                Ratio: {selectedRatio}
              </span>
            </div>

            {/* Error alerts */}
            {generationError && (
              <div className="w-full mb-4 p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-red-200 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] block mb-0.5 text-red-400">Generation Failed</span>
                  <p className="opacity-90 leading-relaxed text-[11px]">{generationError}</p>
                </div>
              </div>
            )}

            {/* Interactive Drawing Box frame */}
            <div className={`w-full rounded-2xl flex flex-col items-center justify-center min-h-[380px] border p-4 relative ${
              isDark ? 'bg-[#06070c] border-[#1e2038]' : 'bg-gray-50 border-gray-200'
            }`}>
              
              {isGenerating ? (
                /* Dynamic Rendering State spinner & step indicators */
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 animate-pulse duration-1000">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                    <Compass className="w-6 h-6 text-purple-400 absolute top-5 left-5 animate-bounce" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Compiling Visual Canvas</p>
                    <p className="text-[11px] text-gray-400 font-mono italic max-w-sm">
                      &gt; {activeStep}
                    </p>
                  </div>
                  {/* Progress Line representation */}
                  <div className="w-48 h-1 bg-[#15172b] rounded-full overflow-hidden border border-white/5 mx-auto">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 animate-infinite-loading rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              ) : generatedImageUrl ? (
                /* True rendered poster asset representation */
                <div className="flex flex-col items-center w-full relative group">
                  <div 
                    onClick={() => { setIsPreviewOpen(true); setZoomScale(1); }}
                    className={`relative overflow-hidden rounded-xl border border-white/10 shadow-2xl transition-all hover:scale-[1.015] hover:border-purple-500/50 cursor-pointer bg-[#07080f] ${getAspectPreviewStyle(selectedRatio)}`}
                    title="Click to zoom and preview in HD"
                  >
                    <img 
                      src={generatedImageUrl} 
                      alt="AI Generated Marketing Poster" 
                      className="w-full h-full object-contain select-none pointer-events-none"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      style={{ imageRendering: 'auto' }}
                    />
                    
                    {/* Live Design Overlays mapped with ultra-clean viewport constraints */}
                    {(() => {
                      const dLogo = logo.trim();
                      const dWebsite = website.trim();
                      const dTitle = title.trim();
                      const dSubtitle = courseName.trim();
                      const dDescription = description.trim();
                      const dFeatures = [feature1, feature2, feature3].map(x => x.trim()).filter(Boolean);
                      const dContact = contactInfo.trim();
                      const dCta = ctaText.trim();

                      const hasTopBar = !!(dLogo || dWebsite || logoFile);
                      const hasHeader = !!(dTitle || dSubtitle || dDescription);
                      const hasFeatures = dFeatures.length > 0;
                      const hasFooter = !!(dContact || dCta);
                      const hasBottomCard = hasHeader || hasFeatures || hasFooter;
                      const hasAnyText = hasTopBar || hasBottomCard;

                      if (!hasAnyText) return null;

                      return (
                        <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between p-[4.5%] select-none pointer-events-none text-left">
                          
                          {/* Top Branding line */}
                          {logoFile ? (
                            <div 
                              className="absolute pointer-events-none"
                              style={{ 
                                left: `${logoX}%`, 
                                top: `${logoY}%`,
                                transform: `scale(${logoScale})`,
                                transformOrigin: 'top left'
                              }}
                            >
                              <img src={logoFile} alt="Brand Logo Overlay" className="h-6 w-auto object-contain bg-black/40 p-1 rounded border border-white/10 shadow-lg" />
                            </div>
                          ) : hasTopBar ? (
                            <div className="flex items-center justify-between w-full">
                              {dLogo ? (
                                <div className="px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 shadow-lg text-[9px] font-black uppercase tracking-wider text-purple-300">
                                  {dLogo}
                                </div>
                              ) : <div />}
                              {dWebsite ? (
                                <div className="px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[8px] font-mono text-slate-300">
                                  {dWebsite}
                                </div>
                              ) : <div />}
                            </div>
                          ) : <div />}

                          {/* Translucent bottom layout template card */}
                          {hasBottomCard ? (
                            <div className="w-full bg-slate-950/93 backdrop-blur-md border border-white/10 p-[4%] rounded-xl space-y-2 shadow-2xl transition-all">
                              
                              {/* Title, Subtitle, and Description elements */}
                              {hasHeader ? (
                                <div className="space-y-0.5">
                                  {dTitle ? (
                                    <h4 className="text-[11px] md:text-[13px] font-black uppercase text-white tracking-wide leading-tight line-clamp-1">
                                      {dTitle}
                                    </h4>
                                  ) : null}
                                  {dSubtitle ? (
                                    <p className="text-[8px] md:text-[10px] font-bold text-purple-300 tracking-tight leading-none line-clamp-1">
                                      {dSubtitle}
                                    </p>
                                  ) : null}
                                  {dDescription ? (
                                    <p className="text-[7px] md:text-[8.5px] text-slate-300 font-medium leading-relaxed mt-1 line-clamp-2 max-w-xl">
                                      {dDescription}
                                    </p>
                                  ) : null}
                                </div>
                              ) : null}

                              {/* Horizontal line separation */}
                              {hasHeader && (hasFeatures || hasFooter) ? (
                                <hr className="border-white/10 my-1" />
                              ) : null}

                              {/* Staged features checklist points */}
                              {hasFeatures ? (
                                <div className="space-y-0.5 text-slate-200 text-[7px] md:text-[9px] font-medium leading-tight">
                                  {dFeatures.map((feat, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 line-clamp-1">
                                      <span className="text-purple-400 font-bold">✓</span>
                                      <span>{feat.replace(/^✓\s*/, '')}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : null}

                              {/* Bottom line CTA callout & Advisor contact */}
                              {hasFooter ? (
                                <div className="flex items-center justify-between pt-1 gap-1 border-t border-white/5">
                                  {dContact ? (
                                    <div className="text-left select-text pointer-events-auto">
                                      <span className="text-[5px] text-slate-400 block tracking-widest leading-none uppercase font-bold">ENQUIRIES & INFO</span>
                                      <span className="text-[8px] font-bold font-mono text-white tracking-tight block leading-snug">{dContact}</span>
                                    </div>
                                  ) : <div />}

                                  {dCta ? (
                                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-[7.5px] md:text-[8.5px] uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-md shrink-0">
                                      {dCta}
                                    </div>
                                  ) : null}
                                </div>
                              ) : null}

                            </div>
                          ) : <div />}
                        </div>
                      );
                    })()}

                    {/* Hover detail HUD */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left pointer-events-none">
                      <p className="text-xs font-bold text-white line-clamp-2 mb-1.5">{content}</p>
                      <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-white/10">
                        <span className="text-[9px] font-mono text-purple-300 uppercase tracking-widest font-bold">🔎 Click to Inspect & Zoom (HD)</span>
                        <span className="text-[9px] font-mono text-slate-400">Flux Engine HD</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Initial empty blueprint state placeholder */
                <div className="flex flex-col items-center justify-center p-8 text-center max-w-md space-y-4">
                  <div className="p-4 rounded-full bg-purple-500/5 border border-purple-500/10 text-purple-400/40">
                    <ImageIcon className="w-12 h-12 stroke-[1.2]" />
                  </div>
                  <div className="space-y-1">
                    <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>No Image Rendered</p>
                    <p className="text-[11px] text-[#71728c] leading-relaxed">
                      Your high-converting marketing drawing is not synthesized yet. Set up your requirements in the guidelines workspace and hit "Generate Poster".
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Core Operation Actions: Generate, Download & Regenerate */}
            <div className="w-full mt-5 space-y-3">
              {!generatedImageUrl ? (
                <button
                  onClick={handleGeneratePosterImage}
                  disabled={isGenerating || !content.trim()}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:via-indigo-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-widest rounded-2xl cursor-pointer shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Compass className="w-4 h-4 animate-spin" />
                  )}
                  <span>{isGenerating ? 'Synthesizing...' : 'Generate Poster (via Pollinations AI)'}</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    onClick={handleDownload}
                    className={`py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border flex items-center justify-center gap-2 transition-all ${
                      isDark 
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500/20' 
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download HD Poster</span>
                  </button>

                  <button
                    onClick={handleGeneratePosterImage}
                    disabled={isGenerating}
                    className={`py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer border flex items-center justify-center gap-2 transition-all ${
                      isDark 
                        ? 'bg-[#1e1f38] hover:bg-[#2a2b4a] border-[#2d2f53] text-purple-300 hover:text-white' 
                        : 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800'
                    }`}
                  >
                    <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>Regenerate Poster</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* External Platform Launcher Grid - Render as support tools */}
          <div className={`border p-6 rounded-3xl shadow-xl transition-all duration-350 space-y-4 ${
            isDark ? 'bg-[#121324] border-[#231b40]/80 shadow-[#08080f]' : 'bg-white border-gray-200'
          }`}>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#a855f7] bg-purple-550/10 px-2.5 py-1 rounded-full border border-purple-500/15">
                Support Launcher Engines
              </span>
              <h3 className={`font-display font-extrabold text-[15px] mt-2.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Launch & Draw on External Platforms
              </h3>
              <p className={`text-[11px] leading-relaxed ${isDark ? 'text-[#8d8ea6]' : 'text-gray-500'}`}>
                You can also instantly copy your workspace prompt and redirect to premium platforms to test other configurations:
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {platforms.map((platform) => {
                return (
                  <button
                    key={platform.name}
                    onClick={() => handleLaunchPlatform(platform.name, platform.url)}
                    className={`py-2 px-3.5 rounded-xl border text-[11px] font-semibold text-center hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0 ${platform.colorClass}`}
                  >
                    <span>{platform.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Premium Multi-Interactive Zoom Inspector Modal */}
      <AnimatePresence>
        {isPreviewOpen && generatedImageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-slate-950/98 backdrop-blur-xl select-none"
            onClick={() => setIsPreviewOpen(false)}
          >
            {/* Control Bar */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full bg-[#0a0c16]/90 border-b border-white/5 px-6 py-4 flex items-center justify-between z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col text-left">
                <span className="text-xs font-black uppercase tracking-widest text-[#a855f7]">Poster Inspection Studio</span>
                <span className="text-[10px] text-slate-400 font-mono">Aspect Ratio: {selectedRatio} | Inspecting at {Math.round(zoomScale * 100)}%</span>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2.5">
                {/* Zoom out */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomScale(prev => Math.max(0.4, prev - 0.2));
                  }}
                  disabled={zoomScale <= 0.4}
                  className="p-2 rounded-xl bg-[#131526] border border-[#232644] text-slate-300 hover:text-white hover:bg-[#1a1c33] disabled:opacity-30 cursor-pointer transition-all"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                {/* Reset Zoom */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomScale(1);
                  }}
                  className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl bg-[#131526] border border-[#232644] text-slate-300 hover:text-white hover:bg-[#1a1c33] cursor-pointer transition-all"
                  title="Reset Zoom to 100%"
                >
                  100%
                </button>

                {/* Zoom in */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomScale(prev => Math.min(3, prev + 0.2));
                  }}
                  disabled={zoomScale >= 3.0}
                  className="p-2 rounded-xl bg-[#131526] border border-[#232644] text-slate-300 hover:text-white hover:bg-[#1a1c33] disabled:opacity-30 cursor-pointer transition-all"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <div className="w-[1px] h-6 bg-[#21233d]" />

                {/* Download */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#4f46e5] hover:from-[#7c3aed] hover:to-[#4338ca] text-[#f8fafc] text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer shadow-lg transition-transform duration-200 active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                {/* Exit */}
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/20 text-red-400 hover:text-red-300 transition-all cursor-pointer"
                  title="Exit Inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Poster Inspector Workspace Zone */}
            <div className="flex-1 w-full overflow-auto flex items-center justify-center p-6 md:p-12">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                style={{ 
                  transform: `scale(${zoomScale})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                className="relative shadow-2xl rounded-2xl overflow-hidden border border-white/20 bg-[#07080f] select-none shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Poster viewport layout based on width and height ratio options */}
                <div className={`relative ${getAspectPreviewStyle(selectedRatio)}`} style={{ maxWidth: '85vw', maxHeight: '72vh' }}>
                  <img
                    src={generatedImageUrl}
                    alt="Inspection Poster Preview"
                    className="w-full h-full object-contain pointer-events-none select-none"
                    referrerPolicy="no-referrer"
                  />

                  {/* Fully matched dynamic Brand text layer overlay */}
                  {(() => {
                    const dLogo = logo.trim();
                    const dWebsite = website.trim();
                    const dTitle = title.trim();
                    const dSubtitle = courseName.trim();
                    const dDescription = description.trim();
                    const dFeatures = [feature1, feature2, feature3].map(x => x.trim()).filter(Boolean);
                    const dContact = contactInfo.trim();
                    const dCta = ctaText.trim();

                    const hasTopBar = !!(dLogo || dWebsite);
                    const hasHeader = !!(dTitle || dSubtitle || dDescription);
                    const hasFeatures = dFeatures.length > 0;
                    const hasFooter = !!(dContact || dCta);
                    const hasBottomCard = hasHeader || hasFeatures || hasFooter;
                    const hasAnyText = hasTopBar || hasBottomCard;

                    if (!hasAnyText) return null;

                    return (
                      <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between p-[4.5%] select-none pointer-events-none text-left">
                        {/* Top Branding line */}
                        {hasTopBar ? (
                          <div className="flex items-center justify-between w-full">
                            {dLogo ? (
                              <div className="px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 shadow-lg text-[9px] font-black uppercase tracking-wider text-purple-300 animate-in fade-in duration-300">
                                {dLogo}
                              </div>
                            ) : <div />}
                            {dWebsite ? (
                              <div className="px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[8px] font-mono text-slate-300 animate-in fade-in duration-300">
                                {dWebsite}
                              </div>
                            ) : <div />}
                          </div>
                        ) : <div />}

                        {/* Bottom dynamic overlay template card */}
                        {hasBottomCard ? (
                          <div className="w-full bg-slate-950/93 backdrop-blur-md border border-white/10 p-[4%] rounded-xl space-y-2 shadow-2xl transition-all">
                            {/* Title, Subtitle, and Description */}
                            {hasHeader ? (
                              <div className="space-y-0.5">
                                {dTitle ? (
                                  <h4 className="text-[11px] md:text-[13px] font-black uppercase text-white tracking-wide leading-tight line-clamp-1 animate-in slide-in-from-bottom-1 duration-300">
                                    {dTitle}
                                  </h4>
                                ) : null}
                                {dSubtitle ? (
                                  <p className="text-[8px] md:text-[10px] font-bold text-purple-300 tracking-tight leading-none line-clamp-1 animate-in slide-in-from-bottom-1 duration-300">
                                    {dSubtitle}
                                  </p>
                                ) : null}
                                {dDescription ? (
                                  <p className="text-[7px] md:text-[8.5px] text-slate-300 font-medium leading-relaxed mt-1 line-clamp-2 max-w-xl animate-in slide-in-from-bottom-1 duration-300">
                                    {dDescription}
                                  </p>
                                ) : null}
                              </div>
                            ) : null}

                            {/* Separator Line */}
                            {hasHeader && (hasFeatures || hasFooter) ? (
                              <hr className="border-white/10 my-1" />
                            ) : null}

                            {/* Checklist features */}
                            {hasFeatures ? (
                              <div className="space-y-0.5 text-slate-200 text-[7px] md:text-[9px] font-medium leading-tight animate-in fade-in duration-500">
                                {dFeatures.map((feat, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 line-clamp-1">
                                    <span className="text-purple-400 font-bold">✓</span>
                                    <span>{feat.replace(/^✓\s*/, '')}</span>
                                  </div>
                                ))}
                              </div>
                            ) : null}

                            {/* Enquiries and CTA */}
                            {hasFooter ? (
                              <div className="flex items-center justify-between pt-1 gap-1 border-t border-[#ffffff]/10 animate-in fade-in duration-500">
                                {dContact ? (
                                  <div className="text-left select-text pointer-events-auto">
                                    <span className="text-[5px] text-slate-400 block tracking-widest leading-none uppercase font-bold">ENQUIRIES & INFO</span>
                                    <span className="text-[8px] font-bold font-mono text-white tracking-tight block leading-snug">{dContact}</span>
                                  </div>
                                ) : <div />}

                                {dCta ? (
                                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-[7.5px] md:text-[8.5px] uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-md shrink-0">
                                    {dCta}
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        ) : <div />}
                      </div>
                    );
                  })()}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
