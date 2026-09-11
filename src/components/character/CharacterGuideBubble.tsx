'use client';

import React from 'react';
import { CharacterVisualConfig, CharacterPose } from '@/lib/characterEngine';
import { FamilyCharacter } from './FamilyCharacter';

interface CharacterGuideBubbleProps {
  character: CharacterVisualConfig;
  pose?: CharacterPose;
  badge?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
  avatarSize?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'compact' | 'vertical';
}

export const CharacterGuideBubble: React.FC<CharacterGuideBubbleProps> = ({
  character,
  pose = 'explaining',
  badge,
  title,
  children,
  className = '',
  avatarSize = 'md',
  layout = 'horizontal',
}) => {
  if (layout === 'compact') {
    return (
      <div
        className={`p-3.5 sm:p-4 rounded-[18px] bg-white border border-hairline shadow-subtle flex items-start space-x-3 text-left ${className}`}
      >
        <FamilyCharacter
          config={character}
          variant="avatar"
          size="sm"
          pose={pose}
          className="flex-shrink-0 mt-0.5"
        />
        <div className="flex-1 min-w-0">
          {badge && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-lavender-600 font-semibold block mb-0.5">
              {badge}
            </span>
          )}
          {title && (
            <div className="font-display font-bold text-sm text-ink mb-1">
              {title}
            </div>
          )}
          <div className="text-xs text-ink-soft leading-relaxed font-sans">
            {children}
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'vertical') {
    return (
      <div
        className={`p-5 rounded-[22px] bg-white border border-hairline shadow-subtle flex flex-col items-center text-center space-y-3.5 ${className}`}
      >
        <FamilyCharacter
          config={character}
          variant="bust"
          size="sm"
          pose={pose}
          className="-mb-2"
        />
        {badge && (
          <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-lavender-100 text-lavender-700 font-semibold">
            {badge}
          </span>
        )}
        {title && (
          <h4 className="font-display font-bold text-base text-ink">
            {title}
          </h4>
        )}
        <div className="text-xs sm:text-sm text-ink-soft leading-relaxed max-w-md">
          {children}
        </div>
      </div>
    );
  }

  // Default: Horizontal Editorial Card
  return (
    <div
      className={`p-4 sm:p-5 rounded-[22px] bg-white border border-hairline shadow-subtle flex items-center space-x-4 sm:space-x-5 text-left transition-all ${className}`}
    >
      <div className="relative flex-shrink-0">
        <FamilyCharacter
          config={character}
          variant="bust"
          size={avatarSize === 'lg' ? 'md' : 'sm'}
          pose={pose}
          className="relative z-10"
        />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-lavender-200/50 rounded-full blur-xs -z-0" />
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center space-x-2 mb-1">
          {badge && (
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-lavender-100 text-lavender-700 font-semibold">
              {badge}
            </span>
          )}
          <span className="font-mono text-[10px] text-muted">
            {character.name} · {character.relationship}
          </span>
        </div>

        {title && (
          <h4 className="font-display font-bold text-sm sm:text-base text-ink mb-1">
            {title}
          </h4>
        )}

        <div className="text-xs sm:text-sm text-ink-soft leading-relaxed font-sans">
          {children}
        </div>
      </div>
    </div>
  );
};
