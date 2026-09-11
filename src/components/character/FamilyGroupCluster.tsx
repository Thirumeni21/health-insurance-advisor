'use client';

import React from 'react';
import { UserProtectionProfile, FamilyMember } from '@/types/questionnaire';
import { getCharacterForUser, getCharacterForMember, CharacterVisualConfig } from '@/lib/characterEngine';
import { FamilyCharacter } from './FamilyCharacter';
import { Shield } from 'lucide-react';

interface FamilyGroupClusterProps {
  profile: UserProtectionProfile;
  className?: string;
  size?: 'compact' | 'normal' | 'detailed';
  highlightId?: string; // Highlight a specific character (e.g. target person in scenario)
}

export const FamilyGroupCluster: React.FC<FamilyGroupClusterProps> = ({
  profile,
  className = '',
  size = 'normal',
  highlightId,
}) => {
  const userChar = getCharacterForUser(profile.user);
  const memberChars: CharacterVisualConfig[] = (profile.household.familyMembers || []).map((m) =>
    getCharacterForMember(m)
  );

  const hasMembers = memberChars.length > 0;

  // Single User / Individual Anchor Representation
  if (!hasMembers) {
    return (
      <div
        className={`relative p-6 sm:p-8 rounded-[24px] bg-gradient-to-b from-white to-lavender-50/40 border border-hairline shadow-subtle flex flex-col items-center justify-center text-center overflow-hidden ${className}`}
      >
        {/* Subtle decorative concentric rings */}
        <div className="absolute w-44 h-44 rounded-full border border-lavender-200/50 pointer-events-none -z-0" />
        <div className="absolute w-60 h-60 rounded-full border border-lavender-100/50 pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col items-center space-y-3">
          <div className="relative">
            <FamilyCharacter
              config={userChar}
              variant="avatar"
              size={size === 'compact' ? 'lg' : 'xl'}
              showHalo={highlightId === 'self' || highlightId === 'primary_user_anchor'}
            />
            <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-lavender-600 text-white shadow-xs">
              <Shield className="w-3 h-3" />
            </span>
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-lavender-100 border border-lavender-300 text-[10px] font-mono text-lavender-700 font-semibold mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-lavender-600 animate-pulse" />
              <span>Independent Anchor</span>
            </div>
            <h4 className="font-display font-bold text-base text-ink">
              {userChar.name}
            </h4>
            <p className="text-xs text-ink-soft font-mono">
              {userChar.age} yrs · Self-Reliant Core
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Multi-person Family Constellation
  return (
    <div
      className={`relative p-5 sm:p-7 rounded-[24px] bg-gradient-to-b from-white to-lavender-50/30 border border-hairline shadow-subtle overflow-hidden ${className}`}
    >
      {/* Background connector SVG lines (Desktop/Tablet) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none hidden sm:block opacity-60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="20%"
          y1="50%"
          x2="80%"
          y2="50%"
          stroke="#d9c8f3"
          strokeWidth="1.5"
          className="animate-connector-flow"
        />
      </svg>

      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-hairline relative z-10">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-lavender-600 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">
            Protection Circle Network
          </span>
        </div>
        <span className="text-xs font-mono text-ink-soft px-2.5 py-0.5 rounded-full bg-bg-soft border border-hairline">
          {memberChars.length + 1} Insured Lives
        </span>
      </div>

      {/* Responsive Cluster Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4 relative z-10">
        {/* Anchor: YOU */}
        <div
          className={`p-3.5 rounded-[18px] bg-white border-2 transition-all flex flex-col items-center text-center space-y-2 shadow-xs ${
            highlightId === 'self' || highlightId === 'primary_user_anchor'
              ? 'border-lavender-600 ring-2 ring-lavender-300'
              : 'border-lavender-300 hover:border-lavender-400'
          }`}
        >
          <div className="relative">
            <FamilyCharacter
              config={userChar}
              variant="avatar"
              size="md"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-lavender-600 text-white flex items-center justify-center text-[9px] font-mono font-bold shadow-xs">
              ★
            </span>
          </div>
          <div className="min-w-0 w-full">
            <span className="text-[10px] font-mono uppercase tracking-wider text-lavender-700 font-semibold block truncate">
              Anchor (You)
            </span>
            <div className="font-display font-bold text-xs sm:text-sm text-ink truncate">
              {userChar.name}
            </div>
            <div className="text-[11px] text-ink-soft font-mono">
              {userChar.age} yrs
            </div>
          </div>
        </div>

        {/* Dynamic Family Members */}
        {memberChars.map((char) => {
          const isHighlighted = highlightId === char.id || highlightId === char.relationship;
          return (
            <div
              key={char.id}
              className={`p-3.5 rounded-[18px] bg-white border transition-all flex flex-col items-center text-center space-y-2 shadow-xs ${
                isHighlighted
                  ? 'border-lavender-600 ring-2 ring-lavender-300'
                  : `${char.accentBorder} hover:border-ink/30`
              }`}
            >
              <FamilyCharacter
                config={char}
                variant="avatar"
                size="md"
                showHalo={isHighlighted}
              />
              <div className="min-w-0 w-full">
                <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold block truncate ${char.accentText}`}>
                  {char.relationship}
                </span>
                <div className="font-display font-bold text-xs sm:text-sm text-ink truncate">
                  {char.name}
                </div>
                <div className="text-[11px] text-ink-soft font-mono">
                  {char.age} yrs
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
