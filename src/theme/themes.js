// Comprehensive theme system with unique visual identities
// Each theme is a complete "application skin" - not just color swaps

const themes = {
  'emerald-violet': {
    name: 'Emerald & Violet',
    description: 'Professional, ambitious, premium',
    mood: 'High-end business finance platform',
    light: {
      // Core palette
      background: '#f8faf8',
      surface: '#f1f5f1',
      card: '#ffffff',
      cardHover: '#f5f9f5',
      foreground: '#0d1f0d',
      muted: '#4a5d4a',
      mutedForeground: '#6b7d6b',
      border: '#c8d8c8',
      borderHover: '#1A472A',

      // Primary - Emerald
      primary: '#1A472A',
      primaryHover: '#0d3016',
      primaryForeground: '#ffffff',
      primaryMuted: '#e8f5e9',
      primaryAccent: '#2e7d32',

      // Secondary - Violet
      secondary: '#7B2FBE',
      secondaryHover: '#9c27b0',
      secondaryForeground: '#ffffff',
      secondaryMuted: '#f3e5f5',
      secondaryAccent: '#ab47bc',

      // Gradients
      gradientPrimary: 'linear-gradient(135deg, #1A472A 0%, #2e7d32 50%, #7B2FBE 100%)',
      gradientSecondary: 'linear-gradient(135deg, #7B2FBE 0%, #ab47bc 100%)',
      gradientCard: 'linear-gradient(180deg, #ffffff 0%, #f8faf8 100%)',
      gradientSidebar: 'linear-gradient(180deg, #1A472A 0%, #0d3016 100%)',
      gradientHero: 'linear-gradient(135deg, rgba(26,71,42,0.05) 0%, rgba(123,47,190,0.05) 100%)',

      // Shadows
      shadow: '0 1px 3px rgba(13,31,13,0.08), 0 1px 2px rgba(13,31,13,0.06)',
      shadowMd: '0 4px 6px rgba(13,31,13,0.07), 0 2px 4px rgba(13,31,13,0.06)',
      shadowLg: '0 10px 15px rgba(13,31,13,0.1), 0 4px 6px rgba(13,31,13,0.05)',
      shadowPrimary: '0 4px 14px rgba(26,71,42,0.25)',
      shadowSecondary: '0 4px 14px rgba(123,47,190,0.25)',

      // Semantic colors
      success: '#22c55e',
      successForeground: '#ffffff',
      successMuted: '#dcfce7',
      warning: '#f59e0b',
      warningForeground: '#0d1f0d',
      warningMuted: '#fef3c7',
      danger: '#ef4444',
      dangerForeground: '#ffffff',
      dangerMuted: '#fee2e2',

      // Chart palette - full gradient set
      chart: ['#1A472A', '#7B2FBE', '#22c55e', '#ab47bc', '#2e7d32', '#9c27b0', '#4caf50', '#ce93d8'],

      // UI specifics
      input: '#ffffff',
      inputBorder: '#c8d8c8',
      inputFocus: '#1A472A',
      ring: '#1A472A',
      ringOffset: '#ffffff',

      // Sidebar
      sidebarBg: '#1A472A',
      sidebarHover: '#2e7d32',
      sidebarActive: '#4caf50',
      sidebarText: '#ffffff',
      sidebarIcon: '#a5d6a7',

      // KPI cards
      kpiIncomeBg: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
      kpiIncomeBorder: '#22c55e',
      kpiExpenseBg: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
      kpiExpenseBorder: '#e91e63',
      kpiBalanceBg: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
      kpiBalanceBorder: '#7B2FBE',

      // Border styling
      borderRadius: '12px',
      borderRadiusSm: '8px',
      borderRadiusLg: '16px',

      // Typography
      fontDisplay: "'Inter', system-ui, sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",

      // Transition
      transition: '0.2s ease',
    },
    dark: {
      // Core palette
      background: '#0a1f0a',
      surface: '#0d1f0d',
      card: '#1a3d1a',
      cardHover: '#1f4a1f',
      foreground: '#f8faf8',
      muted: '#4a5d4a',
      mutedForeground: '#a5b5a5',
      border: '#2d4d2d',
      borderHover: '#4caf50',

      // Primary - Emerald
      primary: '#4caf50',
      primaryHover: '#66bb6a',
      primaryForeground: '#0a1f0a',
      primaryMuted: '#1e3a1e',
      primaryAccent: '#81c784',

      // Secondary - Violet
      secondary: '#ab47bc',
      secondaryHover: '#ba68c8',
      secondaryForeground: '#ffffff',
      secondaryMuted: '#2d2040',
      secondaryAccent: '#ce93d8',

      // Gradients
      gradientPrimary: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 50%, #ab47bc 100%)',
      gradientSecondary: 'linear-gradient(135deg, #ab47bc 0%, #ce93d8 100%)',
      gradientCard: 'linear-gradient(180deg, #1a3d1a 0%, #0d1f0d 100%)',
      gradientSidebar: 'linear-gradient(180deg, #0d3016 0%, #0a1f0a 100%)',
      gradientHero: 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(171,71,188,0.1) 100%)',

      // Shadows
      shadow: '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
      shadowMd: '0 4px 6px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.2)',
      shadowLg: '0 10px 15px rgba(0,0,0,0.35), 0 4px 6px rgba(0,0,0,0.2)',
      shadowPrimary: '0 4px 14px rgba(76,175,80,0.3)',
      shadowSecondary: '0 4px 14px rgba(171,71,188,0.3)',

      // Semantic colors
      success: '#22c55e',
      successForeground: '#0a1f0a',
      successMuted: '#14532d',
      warning: '#fbbf24',
      warningForeground: '#0a1f0a',
      warningMuted: '#422006',
      danger: '#f87171',
      dangerForeground: '#0a1f0a',
      dangerMuted: '#450a0a',

      // Chart palette
      chart: ['#4caf50', '#ab47bc', '#81c784', '#ce93d8', '#22c55e', '#ba68c8', '#66bb6a', '#e1bee7'],

      // UI specifics
      input: '#1a3d1a',
      inputBorder: '#2d4d2d',
      inputFocus: '#4caf50',
      ring: '#4caf50',
      ringOffset: '#0a1f0a',

      // Sidebar
      sidebarBg: '#0d1f0d',
      sidebarHover: '#1a3d1a',
      sidebarActive: '#4caf50',
      sidebarText: '#f8faf8',
      sidebarIcon: '#81c784',

      // KPI cards
      kpiIncomeBg: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
      kpiIncomeBorder: '#22c55e',
      kpiExpenseBg: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)',
      kpiExpenseBorder: '#ef4444',
      kpiBalanceBg: 'linear-gradient(135deg, #2d2040 0%, #443356 100%)',
      kpiBalanceBorder: '#ab47bc',

      // Border styling
      borderRadius: '12px',
      borderRadiusSm: '8px',
      borderRadiusLg: '16px',

      // Typography
      fontDisplay: "'Inter', system-ui, sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",

      // Transition
      transition: '0.2s ease',
    },
  },

  'noir-gold': {
    name: 'Noir & Gold',
    description: 'Warm, luxurious, personal finance',
    mood: 'Personal wealth management app',
    light: {
      // Core palette - warm cream
      background: '#F5F0E8',
      surface: '#EDE8E0',
      card: '#FDFCFA',
      cardHover: '#F8F6F2',
      foreground: '#1a1612',
      muted: '#6b6050',
      mutedForeground: '#8a7d6d',
      border: '#d5cfc5',
      borderHover: '#D4A500',

      // Primary - Gold
      primary: '#D4A500',
      primaryHover: '#F5C518',
      primaryForeground: '#1a1612',
      primaryMuted: '#fef7e6',
      primaryAccent: '#e5b020',

      // Secondary - Bronze
      secondary: '#8B6914',
      secondaryHover: '#A67C00',
      secondaryForeground: '#ffffff',
      secondaryMuted: '#f5ead6',
      secondaryAccent: '#b38900',

      // Gradients
      gradientPrimary: 'linear-gradient(135deg, #D4A500 0%, #F5C518 50%, #e5b020 100%)',
      gradientSecondary: 'linear-gradient(135deg, #8B6914 0%, #b38900 100%)',
      gradientCard: 'linear-gradient(180deg, #FDFCFA 0%, #F5F0E8 100%)',
      gradientSidebar: 'linear-gradient(180deg, #1a1612 0%, #2d2520 100%)',
      gradientHero: 'linear-gradient(135deg, rgba(212,165,0,0.08) 0%, rgba(245,197,24,0.05) 100%)',

      // Shadows - warm tinted
      shadow: '0 1px 3px rgba(26,22,18,0.08), 0 1px 2px rgba(26,22,18,0.06)',
      shadowMd: '0 4px 6px rgba(26,22,18,0.07), 0 2px 4px rgba(26,22,18,0.06)',
      shadowLg: '0 10px 15px rgba(26,22,18,0.1), 0 4px 6px rgba(26,22,18,0.05)',
      shadowPrimary: '0 4px 14px rgba(212,165,0,0.2)',
      shadowSecondary: '0 4px 14px rgba(139,105,20,0.2)',

      // Semantic colors
      success: '#22c55e',
      successForeground: '#ffffff',
      successMuted: '#dcfce7',
      warning: '#f59e0b',
      warningForeground: '#1a1612',
      warningMuted: '#fef3c7',
      danger: '#dc2626',
      dangerForeground: '#ffffff',
      dangerMuted: '#fee2e2',

      // Chart palette - gold tones
      chart: ['#D4A500', '#8B6914', '#F5C518', '#b38900', '#e5b020', '#A67C00', '#fad785', '#fef7e6'],

      // UI specifics
      input: '#FDFCFA',
      inputBorder: '#d5cfc5',
      inputFocus: '#D4A500',
      ring: '#D4A500',
      ringOffset: '#F5F0E8',

      // Sidebar
      sidebarBg: '#1a1612',
      sidebarHover: '#2d2520',
      sidebarActive: '#D4A500',
      sidebarText: '#F5F0E8',
      sidebarIcon: '#d4a500',

      // KPI cards
      kpiIncomeBg: 'linear-gradient(135deg, #fef7e6 0%, #fdecc2 100%)',
      kpiIncomeBorder: '#D4A500',
      kpiExpenseBg: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      kpiExpenseBorder: '#dc2626',
      kpiBalanceBg: 'linear-gradient(135deg, #f5ead6 0%, #e5dcc6 100%)',
      kpiBalanceBorder: '#8B6914',

      // Border styling - elegant
      borderRadius: '14px',
      borderRadiusSm: '10px',
      borderRadiusLg: '20px',

      // Typography
      fontDisplay: "'Georgia', 'Times New Roman', serif",
      fontBody: "'Inter', system-ui, sans-serif",

      // Transition
      transition: '0.25s ease',
    },
    dark: {
      // Core palette - rich noir
      background: '#12100e',
      surface: '#1a1816',
      card: '#1f1d1a',
      cardHover: '#2a2824',
      foreground: '#F5F0E8',
      muted: '#6b6050',
      mutedForeground: '#a09585',
      border: '#2d2a26',
      borderHover: '#F5C518',

      // Primary - Gold (brighter on dark)
      primary: '#F5C518',
      primaryHover: '#FFDA3D',
      primaryForeground: '#12100e',
      primaryMuted: '#2d2520',
      primaryAccent: '#fad785',

      // Secondary - Bronze
      secondary: '#d4a500',
      secondaryHover: '#e5b020',
      secondaryForeground: '#12100e',
      secondaryMuted: '#3d352a',
      secondaryAccent: '#fdecc2',

      // Gradients
      gradientPrimary: 'linear-gradient(135deg, #F5C518 0%, #FFDA3D 50%, #fad785 100%)',
      gradientSecondary: 'linear-gradient(135deg, #d4a500 0%, #e5b020 100%)',
      gradientCard: 'linear-gradient(180deg, #1f1d1a 0%, #1a1816 100%)',
      gradientSidebar: 'linear-gradient(180deg, #0f0d0b 0%, #12100e 100%)',
      gradientHero: 'linear-gradient(135deg, rgba(245,197,24,0.07) 0%, rgba(255,218,61,0.04) 100%)',

      // Shadows
      shadow: '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
      shadowMd: '0 4px 6px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.3)',
      shadowLg: '0 10px 15px rgba(0,0,0,0.45), 0 4px 6px rgba(0,0,0,0.3)',
      shadowPrimary: '0 4px 14px rgba(245,197,24,0.25)',
      shadowSecondary: '0 4px 14px rgba(212,165,0,0.25)',

      // Semantic colors
      success: '#34d058',
      successForeground: '#12100e',
      successMuted: '#14532d',
      warning: '#fbbf24',
      warningForeground: '#12100e',
      warningMuted: '#422006',
      danger: '#f87171',
      dangerForeground: '#12100e',
      dangerMuted: '#450a0a',

      // Chart palette
      chart: ['#F5C518', '#d4a500', '#FFDA3D', '#fad785', '#e5b020', '#fef7e6', '#D4A500', '#b38900'],

      // UI specifics
      input: '#1f1d1a',
      inputBorder: '#2d2a26',
      inputFocus: '#F5C518',
      ring: '#F5C518',
      ringOffset: '#12100e',

      // Sidebar
      sidebarBg: '#0f0d0b',
      sidebarHover: '#1a1816',
      sidebarActive: '#F5C518',
      sidebarText: '#F5F0E8',
      sidebarIcon: '#fad785',

      // KPI cards
      kpiIncomeBg: 'linear-gradient(135deg, #2d2520 0%, #3d352a 100%)',
      kpiIncomeBorder: '#F5C518',
      kpiExpenseBg: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)',
      kpiExpenseBorder: '#f87171',
      kpiBalanceBg: 'linear-gradient(135deg, #3d3020 0%, #4d4030 100%)',
      kpiBalanceBorder: '#d4a500',

      // Border styling
      borderRadius: '14px',
      borderRadiusSm: '10px',
      borderRadiusLg: '20px',

      // Typography
      fontDisplay: "'Georgia', 'Times New Roman', serif",
      fontBody: "'Inter', system-ui, sans-serif",

      // Transition
      transition: '0.25s ease',
    },
  },

  'midnight-tangerine': {
    name: 'Midnight & Tangerine',
    description: 'Modern startup, energetic',
    mood: 'Fast-moving founder dashboard',
    light: {
      // Core palette - crisp navy
      background: '#f8fafb',
      surface: '#f0f4f7',
      card: '#ffffff',
      cardHover: '#f5f8fa',
      foreground: '#0D1B2A',
      muted: '#4a5568',
      mutedForeground: '#718096',
      border: '#cbd5e0',
      borderHover: '#FF6B35',

      // Primary - Navy
      primary: '#0D1B2A',
      primaryHover: '#1a3a5a',
      primaryForeground: '#ffffff',
      primaryMuted: '#e6e9ed',
      primaryAccent: '#3a5a70',

      // Secondary - Tangerine
      secondary: '#FF6B35',
      secondaryHover: '#ff8c5a',
      secondaryForeground: '#0D1B2A',
      secondaryMuted: '#fff3ed',
      secondaryAccent: '#ffa06f',

      // Gradients
      gradientPrimary: 'linear-gradient(135deg, #0D1B2A 0%, #1a3a5a 50%, #FF6B35 100%)',
      gradientSecondary: 'linear-gradient(135deg, #FF6B35 0%, #ff8c5a 100%)',
      gradientCard: 'linear-gradient(180deg, #ffffff 0%, #f8fafb 100%)',
      gradientSidebar: 'linear-gradient(180deg, #0D1B2A 0%, #1a3a5a 100%)',
      gradientHero: 'linear-gradient(135deg, rgba(13,27,42,0.03) 0%, rgba(255,107,53,0.05) 100%)',

      // Shadows - cool toned
      shadow: '0 1px 3px rgba(13,27,42,0.1), 0 1px 2px rgba(13,27,42,0.08)',
      shadowMd: '0 4px 6px rgba(13,27,42,0.08), 0 2px 4px rgba(13,27,42,0.06)',
      shadowLg: '0 10px 15px rgba(13,27,42,0.12), 0 4px 6px rgba(13,27,42,0.06)',
      shadowPrimary: '0 4px 14px rgba(13,27,42,0.15)',
      shadowSecondary: '0 4px 14px rgba(255,107,53,0.3)',

      // Semantic colors
      success: '#10b981',
      successForeground: '#ffffff',
      successMuted: '#d1fae5',
      warning: '#f59e0b',
      warningForeground: '#0D1B2A',
      warningMuted: '#fef3c7',
      danger: '#ef4444',
      dangerForeground: '#ffffff',
      dangerMuted: '#fee2e2',

      // Chart palette - energetic
      chart: ['#0D1B2A', '#FF6B35', '#1a3a5a', '#ff8c5a', '#3a5a70', '#ffa06f', '#527690', '#ffb893'],

      // UI specifics
      input: '#ffffff',
      inputBorder: '#cbd5e0',
      inputFocus: '#FF6B35',
      ring: '#FF6B35',
      ringOffset: '#ffffff',

      // Sidebar
      sidebarBg: '#0D1B2A',
      sidebarHover: '#1b3a5a',
      sidebarActive: '#FF6B35',
      sidebarText: '#ffffff',
      sidebarIcon: '#7b95a9',

      // KPI cards
      kpiIncomeBg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      kpiIncomeBorder: '#10b981',
      kpiExpenseBg: 'linear-gradient(135deg, #fff3ed 0%, #ffe7db 100%)',
      kpiExpenseBorder: '#FF6B35',
      kpiBalanceBg: 'linear-gradient(135deg, #e6e9ed 0%, #cdd3db 100%)',
      kpiBalanceBorder: '#0D1B2A',

      // Border styling - modern
      borderRadius: '10px',
      borderRadiusSm: '6px',
      borderRadiusLg: '14px',

      // Typography
      fontDisplay: "'Space Grotesk', 'Inter', system-ui, sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",

      // Transition
      transition: '0.15s ease',
    },
    dark: {
      // Core palette - deep navy
      background: '#060d15',
      surface: '#0D1B2A',
      card: '#1a2d42',
      cardHover: '#1f3a52',
      foreground: '#f8fafc',
      muted: '#5a6b7a',
      mutedForeground: '#94a3b8',
      border: '#2a3d52',
      borderHover: '#FF8C5A',

      // Primary - Navy (lighter)
      primary: '#3a5a70',
      primaryHover: '#527690',
      primaryForeground: '#ffffff',
      primaryMuted: '#0d1b2a',
      primaryAccent: '#7b95a9',

      // Secondary - Tangerine (brighter)
      secondary: '#FF8C5A',
      secondaryHover: '#ffa06f',
      secondaryForeground: '#060d15',
      secondaryMuted: '#331a0a',
      secondaryAccent: '#ffb893',

      // Gradients
      gradientPrimary: 'linear-gradient(135deg, #3a5a70 0%, #527690 50%, #FF8C5A 100%)',
      gradientSecondary: 'linear-gradient(135deg, #FF8C5A 0%, #ffa06f 100%)',
      gradientCard: 'linear-gradient(180deg, #1a2d42 0%, #0D1B2A 100%)',
      gradientSidebar: 'linear-gradient(180deg, #060d15 0%, #0D1B2A 100%)',
      gradientHero: 'linear-gradient(135deg, rgba(58,90,112,0.1) 0%, rgba(255,140,90,0.1) 100%)',

      // Shadows
      shadow: '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
      shadowMd: '0 4px 6px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.3)',
      shadowLg: '0 10px 15px rgba(0,0,0,0.45), 0 4px 6px rgba(0,0,0,0.3)',
      shadowPrimary: '0 4px 14px rgba(58,90,112,0.3)',
      shadowSecondary: '0 4px 14px rgba(255,140,90,0.35)',

      // Semantic colors
      success: '#34d058',
      successForeground: '#060d15',
      successMuted: '#14532d',
      warning: '#fbbf24',
      warningForeground: '#060d15',
      warningMuted: '#422006',
      danger: '#f87171',
      dangerForeground: '#060d15',
      dangerMuted: '#450a0a',

      // Chart palette
      chart: ['#FF8C5A', '#3a5a70', '#ffa06f', '#527690', '#ffb893', '#7b95a9', '#ffd0b7', '#a4b4c2'],

      // UI specifics
      input: '#1a2d42',
      inputBorder: '#2a3d52',
      inputFocus: '#FF8C5A',
      ring: '#FF8C5A',
      ringOffset: '#060d15',

      // Sidebar
      sidebarBg: '#060d15',
      sidebarHover: '#0D1B2A',
      sidebarActive: '#FF8C5A',
      sidebarText: '#f8fafc',
      sidebarIcon: '#527690',

      // KPI cards
      kpiIncomeBg: 'linear-gradient(135deg, #14532d 0%, #166534 100%)',
      kpiIncomeBorder: '#34d058',
      kpiExpenseBg: 'linear-gradient(135deg, #331a0a 0%, #5a2d15 100%)',
      kpiExpenseBorder: '#FF8C5A',
      kpiBalanceBg: 'linear-gradient(135deg, #0d1b2a 0%, #1a2d42 100%)',
      kpiBalanceBorder: '#3a5a70',

      // Border styling
      borderRadius: '10px',
      borderRadiusSm: '6px',
      borderRadiusLg: '14px',

      // Typography
      fontDisplay: "'Space Grotesk', 'Inter', system-ui, sans-serif",
      fontBody: "'Inter', system-ui, sans-serif",

      // Transition
      transition: '0.15s ease',
    },
  },

  'cosmic-grape': {
    name: 'Cosmic Grape',
    description: 'Creative, futuristic, bold',
    mood: 'Creative agency financial command center',
    light: {
      // Core palette - cosmic cream (very light)
      background: '#faf9fc',
      surface: '#f3f1f8',
      card: '#ffffff',
      cardHover: '#f8f6fa',
      foreground: '#140b2e',
      muted: '#5a4d7a',
      mutedForeground: '#7a6d9a',
      border: '#dcd8e8',
      borderHover: '#39FF14',

      // Primary - Deep Purple
      primary: '#2D1B69',
      primaryHover: '#1a0f3d',
      primaryForeground: '#ffffff',
      primaryMuted: '#e5e0f0',
      primaryAccent: '#4a2b9a',

      // Secondary - Neon Lime
      secondary: '#39FF14',
      secondaryHover: '#5dff47',
      secondaryForeground: '#140b2e',
      secondaryMuted: '#eaffd9',
      secondaryAccent: '#8bff1a',

      // Gradients
      gradientPrimary: 'linear-gradient(135deg, #2D1B69 0%, #4a2b9a 50%, #39FF14 100%)',
      gradientSecondary: 'linear-gradient(135deg, #39FF14 0%, #5dff47 100%)',
      gradientCard: 'linear-gradient(180deg, #ffffff 0%, #faf9fc 100%)',
      gradientSidebar: 'linear-gradient(180deg, #2D1B69 0%, #140b2e 100%)',
      gradientHero: 'linear-gradient(135deg, rgba(45,27,105,0.05) 0%, rgba(57,255,20,0.1) 100%)',

      // Shadows - purple tinted
      shadow: '0 1px 3px rgba(20,11,46,0.1), 0 1px 2px rgba(20,11,46,0.08)',
      shadowMd: '0 4px 6px rgba(20,11,46,0.08), 0 2px 4px rgba(20,11,46,0.06)',
      shadowLg: '0 10px 15px rgba(20,11,46,0.12), 0 4px 6px rgba(20,11,46,0.06)',
      shadowPrimary: '0 4px 14px rgba(45,27,105,0.2)',
      shadowSecondary: '0 4px 14px rgba(57,255,20,0.35)',

      // Semantic colors
      success: '#22c55e',
      successForeground: '#ffffff',
      successMuted: '#dcfce7',
      warning: '#eab308',
      warningForeground: '#140b2e',
      warningMuted: '#fef9c3',
      danger: '#dc2626',
      dangerForeground: '#ffffff',
      dangerMuted: '#fee2e2',

      // Chart palette - cosmic
      chart: ['#2D1B69', '#39FF14', '#4a2b9a', '#5dff47', '#6a4db8', '#8bff1a', '#8777d8', '#b0ff66'],

      // UI specifics
      input: '#ffffff',
      inputBorder: '#dcd8e8',
      inputFocus: '#39FF14',
      ring: '#39FF14',
      ringOffset: '#ffffff',

      // Sidebar
      sidebarBg: '#2D1B69',
      sidebarHover: '#3d2482',
      sidebarActive: '#39FF14',
      sidebarText: '#ffffff',
      sidebarIcon: '#a599e2',

      // KPI cards
      kpiIncomeBg: 'linear-gradient(135deg, #eaffd9 0%, #d5ffb3 100%)',
      kpiIncomeBorder: '#39FF14',
      kpiExpenseBg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
      kpiExpenseBorder: '#dc2626',
      kpiBalanceBg: 'linear-gradient(135deg, #e5e0f0 0%, #d3cbf0 100%)',
      kpiBalanceBorder: '#2D1B69',

      // Border styling - bold
      borderRadius: '16px',
      borderRadiusSm: '10px',
      borderRadiusLg: '24px',

      // Typography
      fontDisplay: "'Space Mono', 'SF Mono', monospace",
      fontBody: "'Inter', system-ui, sans-serif",

      // Transition
      transition: '0.2s ease',
    },
    dark: {
      // Core palette - deep cosmic purple
      background: '#0a0614',
      surface: '#140b2e',
      card: '#20134c',
      cardHover: '#2d1b69',
      foreground: '#f8fafc',
      muted: '#6a5a8a',
      mutedForeground: '#a599e2',
      border: '#3d2482',
      borderHover: '#5DFF47',

      // Primary - Purple (brighter)
      primary: '#a599e2',
      primaryHover: '#c3bbec',
      primaryForeground: '#140b2e',
      primaryMuted: '#2d1b69',
      primaryAccent: '#8777d8',

      // Secondary - Neon Lime (brighter)
      secondary: '#5DFF47',
      secondaryHover: '#8bff1a',
      secondaryForeground: '#0a0614',
      secondaryMuted: '#0d2a06',
      secondaryAccent: '#b0ff66',

      // Gradients
      gradientPrimary: 'linear-gradient(135deg, #a599e2 0%, #8777d8 50%, #5DFF47 100%)',
      gradientSecondary: 'linear-gradient(135deg, #5DFF47 0%, #8bff1a 100%)',
      gradientCard: 'linear-gradient(180deg, #20134c 0%, #140b2e 100%)',
      gradientSidebar: 'linear-gradient(180deg, #0a0614 0%, #140b2e 100%)',
      gradientHero: 'linear-gradient(135deg, rgba(165,153,226,0.1) 0%, rgba(93,255,71,0.1) 100%)',

      // Shadows
      shadow: '0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)',
      shadowMd: '0 4px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.35)',
      shadowLg: '0 10px 15px rgba(0,0,0,0.5), 0 4px 6px rgba(0,0,0,0.35)',
      shadowPrimary: '0 4px 14px rgba(165,153,226,0.35)',
      shadowSecondary: '0 4px 14px rgba(93,255,71,0.4)',

      // Semantic colors
      success: '#34d058',
      successForeground: '#0a0614',
      successMuted: '#14532d',
      warning: '#fbbf24',
      warningForeground: '#0a0614',
      warningMuted: '#422006',
      danger: '#f87171',
      dangerForeground: '#0a0614',
      dangerMuted: '#450a0a',

      // Chart palette
      chart: ['#5DFF47', '#a599e2', '#8bff1a', '#c3bbec', '#b0ff66', '#d3cbf0', '#39FF14', '#2D1B69'],

      // UI specifics
      input: '#20134c',
      inputBorder: '#3d2482',
      inputFocus: '#5DFF47',
      ring: '#5DFF47',
      ringOffset: '#0a0614',

      // Sidebar
      sidebarBg: '#0a0614',
      sidebarHover: '#140b2e',
      sidebarActive: '#5DFF47',
      sidebarText: '#f8fafc',
      sidebarIcon: '#a599e2',

      // KPI cards
      kpiIncomeBg: 'linear-gradient(135deg, #0d2a06 0%, #14532d 100%)',
      kpiIncomeBorder: '#5DFF47',
      kpiExpenseBg: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)',
      kpiExpenseBorder: '#f87171',
      kpiBalanceBg: 'linear-gradient(135deg, #2d1b69 0%, #3d2482 100%)',
      kpiBalanceBorder: '#a599e2',

      // Border styling
      borderRadius: '16px',
      borderRadiusSm: '10px',
      borderRadiusLg: '24px',

      // Typography
      fontDisplay: "'Space Mono', 'SF Mono', monospace",
      fontBody: "'Inter', system-ui, sans-serif",

      // Transition
      transition: '0.2s ease',
    },
  },
};

export const getTheme = (palette, darkMode) => {
  const theme = themes[palette] || themes['emerald-violet'];
  return darkMode ? theme.dark : theme.light;
};

export const getThemeMeta = (palette) => {
  const theme = themes[palette] || themes['emerald-violet'];
  return {
    name: theme.name,
    description: theme.description,
    mood: theme.mood,
    primary: theme.light.primary,
    secondary: theme.light.secondary,
  };
};

export const getAllThemesMeta = () => {
  const result = {};
  Object.keys(themes).forEach((key) => {
    result[key] = {
      name: themes[key].name,
      description: themes[key].description,
      mood: themes[key].mood,
      primary: themes[key].light.primary,
      secondary: themes[key].light.secondary,
    };
  });
  return result;
};

export const themeKeys = Object.keys(themes);

export default themes;
