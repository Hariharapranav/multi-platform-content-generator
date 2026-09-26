import { clsx } from 'clsx';
import type { Platform } from '../types';

interface PlatformTabsProps {
  active: Platform;
  onChange: (p: Platform) => void;
  regenerating: Platform | null;
}

const TABS: { id: Platform; label: string; icon: string; color: string; activeGradient: string }[] = [
  {
    id: 'youtube',
    label: 'YouTube',
    icon: '▶',
    color: 'text-red-400',
    activeGradient: 'from-red-600 to-red-500',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: '📸',
    color: 'text-pink-400',
    activeGradient: 'from-pink-600 to-orange-500',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: '💼',
    color: 'text-blue-400',
    activeGradient: 'from-blue-600 to-blue-500',
  },
  {
    id: 'twitter',
    label: 'X (Twitter)',
    icon: '𝕏',
    color: 'text-sky-400',
    activeGradient: 'from-sky-600 to-sky-500',
  },
];

export default function PlatformTabs({ active, onChange, regenerating }: PlatformTabsProps) {
  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-surface-800/60 backdrop-blur-md rounded-2xl border border-white/5">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        const isRegen = regenerating === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'platform-tab flex-1',
              isActive
                ? `platform-tab-active bg-gradient-to-r ${tab.activeGradient} shadow-lg`
                : 'platform-tab-inactive'
            )}
          >
            <span className={clsx('text-base', !isActive && tab.color)}>
              {isRegen ? '⟳' : tab.icon}
            </span>
            <span className={clsx('hidden sm:block', isActive ? 'text-white' : tab.color)}>
              {tab.label}
            </span>
            {isRegen && (
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
}
