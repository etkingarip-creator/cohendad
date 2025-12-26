export const colors = {
  primary: {
    purple: '#7C3AED',
    gold: '#F59E0B',
    midnight: '#1E1B4B',
    violet: '#8B5CF6',
  },
  background: {
    dark: '#0F0A1E',
    card: '#1A1332',
    modal: '#2D1B69',
    overlay: 'rgba(15, 10, 30, 0.95)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A78BFA',
    muted: '#6B7280',
    accent: '#FCD34D',
  },
  accent: {
    mystic: '#EC4899',
    cosmic: '#3B82F6',
    ethereal: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  },
  border: {
    light: 'rgba(139, 92, 246, 0.2)',
    medium: 'rgba(139, 92, 246, 0.4)',
    heavy: 'rgba(139, 92, 246, 0.6)',
  },
} as const;

export type ColorPalette = typeof colors;
