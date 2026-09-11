'use client';

import React from 'react';
import { CharacterVisualConfig, CharacterPose } from '@/lib/characterEngine';

interface FamilyCharacterProps {
  config: CharacterVisualConfig;
  variant?: 'avatar' | 'bust' | 'full';
  pose?: CharacterPose;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  className?: string;
  showHalo?: boolean;
  animated?: boolean;
}

export const FamilyCharacter: React.FC<FamilyCharacterProps> = ({
  config,
  variant = 'avatar',
  pose = 'idle',
  size = 'md',
  className = '',
  showHalo = false,
  animated = true,
}) => {
  const {
    archetype,
    hairColor,
    clothingColor,
    clothingAccent,
    skinTone,
    hasGlasses,
    accentBg,
    accentBorder,
  } = config;

  // Size mapping for avatar
  const avatarSizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
    custom: '',
  };

  // Bust / Full size mapping
  const portraitSizeMap = {
    xs: 'w-14 h-16',
    sm: 'w-20 h-24',
    md: 'w-28 h-32',
    lg: 'w-40 h-44',
    xl: 'w-52 h-56',
    '2xl': 'w-64 h-72',
    custom: '',
  };

  const breatheClass = animated ? 'animate-char-breathe' : '';
  const blinkClass = animated ? 'animate-char-blink' : '';

  // Render SVG Face Features
  const renderFace = () => {
    return (
      <g id="face-group">
        {/* Head Base */}
        <ellipse cx="50" cy="46" rx="19" ry="22" fill={skinTone} />

        {/* Ears */}
        <ellipse cx="30" cy="47" rx="3.5" ry="5.5" fill={skinTone} />
        <ellipse cx="70" cy="47" rx="3.5" ry="5.5" fill={skinTone} />

        {/* Eyebrows */}
        {archetype === 'elder_male' || archetype === 'elder_female' ? (
          <>
            <path d="M 40 37 Q 44 35 47 37" stroke="#6e6777" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M 53 37 Q 56 35 60 37" stroke="#6e6777" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <path d="M 39 37 Q 44 34 47 36" stroke="#2e2838" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M 53 36 Q 56 34 61 37" stroke="#2e2838" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Eyes with subtle blink animation */}
        <g className={blinkClass}>
          {archetype === 'child_boy' || archetype === 'child_girl' ? (
            <>
              <circle cx="43" cy="43" r="3" fill="#1e1829" />
              <circle cx="44" cy="42" r="1" fill="#ffffff" />
              <circle cx="57" cy="43" r="3" fill="#1e1829" />
              <circle cx="58" cy="42" r="1" fill="#ffffff" />
            </>
          ) : (
            <>
              <ellipse cx="43.5" cy="42.5" rx="2.5" ry="3" fill="#1e1829" />
              <circle cx="44.5" cy="41.5" r="0.9" fill="#ffffff" />
              <ellipse cx="56.5" cy="42.5" rx="2.5" ry="3" fill="#1e1829" />
              <circle cx="57.5" cy="41.5" r="0.9" fill="#ffffff" />
            </>
          )}
        </g>

        {/* Glasses (if applicable) */}
        {hasGlasses && (
          <g stroke="#4f475a" strokeWidth="1.5" fill="rgba(255,255,255,0.25)">
            <rect x="37" y="37" width="12" height="10" rx="3" />
            <rect x="51" y="37" width="12" height="10" rx="3" />
            <line x1="49" y1="41" x2="51" y2="41" />
            <line x1="30" y1="40" x2="37" y2="41" />
            <line x1="63" y1="41" x2="70" y2="40" />
          </g>
        )}

        {/* Nose */}
        <path d="M 50 43 Q 51.5 48 49 49" stroke="#ba8e74" strokeWidth="1.4" strokeLinecap="round" fill="none" />

        {/* Cheeks */}
        {(archetype === 'child_boy' || archetype === 'child_girl' || archetype === 'adult_female') && (
          <>
            <ellipse cx="38" cy="48" rx="3" ry="1.8" fill="#ffb7a8" opacity="0.55" />
            <ellipse cx="62" cy="48" rx="3" ry="1.8" fill="#ffb7a8" opacity="0.55" />
          </>
        )}

        {/* Mouth */}
        {pose === 'explaining' ? (
          <path d="M 46 54 Q 50 57.5 54 54" stroke="#915243" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        ) : pose === 'thinking' ? (
          <path d="M 46 54 Q 50 54 54 53" stroke="#915243" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M 45 53 Q 50 57 55 53" stroke="#915243" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        )}
      </g>
    );
  };

  // Render Distinct Hairstyle based on archetype
  const renderHair = () => {
    switch (archetype) {
      case 'adult_female':
        return (
          <g id="hair-adult-female" fill={hairColor}>
            {/* Soft modern styled bob / framing hair */}
            <path d="M 30 46 C 29 27 38 21 50 21 C 62 21 71 27 70 46 C 72 57 68 62 67 64 C 65 59 66 48 64 42 C 60 29 40 29 36 42 C 34 48 35 59 33 64 C 32 62 28 57 30 46 Z" />
            <path d="M 38 27 C 45 23 57 24 64 30 C 58 26 48 25 40 28 Z" fill="rgba(255,255,255,0.18)" />
          </g>
        );

      case 'elder_female':
        return (
          <g id="hair-elder-female" fill={hairColor}>
            {/* Graceful silver-touched classic bun/drape */}
            <path d="M 31 46 C 29 28 38 22 50 22 C 62 22 71 28 69 46 C 70 54 67 60 66 61 C 64 54 66 45 64 40 C 60 30 40 30 36 40 C 34 45 36 54 34 61 C 33 60 30 54 31 46 Z" />
            <ellipse cx="50" cy="20" rx="9" ry="6" fill={hairColor} />
            <path d="M 42 25 Q 49 22 56 27" stroke="#d3cdd9" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'elder_male':
        return (
          <g id="hair-elder-male" fill={hairColor}>
            {/* Distinguished receding sides with neat silver styling */}
            <path d="M 29 47 C 28 39 30 33 34 29 C 37 32 40 32 43 32 C 45 32 55 32 57 32 C 60 32 63 32 66 29 C 70 33 72 39 71 47 C 69 43 68 37 66 35 C 62 33 58 35 50 35 C 42 35 38 33 34 35 C 32 37 31 43 29 47 Z" />
            <path d="M 30 41 Q 33 35 37 36" stroke="#c5ccd6" strokeWidth="1.2" fill="none" />
            <path d="M 70 41 Q 67 35 63 36" stroke="#c5ccd6" strokeWidth="1.2" fill="none" />
          </g>
        );

      case 'child_boy':
        return (
          <g id="hair-child-boy" fill={hairColor}>
            {/* Cheerful textured crop with a neat cowlick */}
            <path d="M 30 44 C 29 27 38 23 50 23 C 62 23 71 27 70 44 C 67 36 63 32 59 34 C 55 31 51 32 48 31 C 44 32 40 31 37 35 C 33 33 31 38 30 44 Z" />
            <path d="M 50 23 Q 52 18 55 21" stroke={hairColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'child_girl':
        return (
          <g id="hair-child-girl" fill={hairColor}>
            {/* Cute twin pigtails / playful bob */}
            <path d="M 30 44 C 29 26 38 22 50 22 C 62 22 71 26 70 44 C 67 34 61 31 50 31 C 39 31 33 34 30 44 Z" />
            <ellipse cx="27" cy="43" rx="4.5" ry="7" fill={hairColor} />
            <circle cx="28" cy="37" r="2" fill="#e68d5c" />
            <ellipse cx="73" cy="43" rx="4.5" ry="7" fill={hairColor} />
            <circle cx="72" cy="37" r="2" fill="#e68d5c" />
          </g>
        );

      case 'youth_neutral':
        return (
          <g id="hair-youth" fill={hairColor}>
            <path d="M 30 43 C 29 26 38 22 50 22 C 62 22 71 26 70 43 C 66 32 60 30 50 30 C 40 30 34 32 30 43 Z" />
            <path d="M 42 27 C 48 24 55 24 60 28" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
          </g>
        );

      case 'adult_male':
      default:
        return (
          <g id="hair-adult-male" fill={hairColor}>
            {/* Clean, tailored side part */}
            <path d="M 30 45 C 29 28 37 23 49 23 C 62 23 71 27 70 45 C 67 36 64 32 58 33 C 54 32 46 32 40 34 C 35 32 32 38 30 45 Z" />
            <path d="M 42 27 C 47 25 54 25 58 28" stroke="rgba(255,255,255,0.18)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          </g>
        );
    }
  };

  // Render Body / Torso
  const renderBody = () => {
    return (
      <g id="torso-group">
        {/* Neck */}
        <path d="M 44 65 L 44 74 C 44 76 56 76 56 74 L 56 65 Z" fill={skinTone} />

        {/* Collar / V-neck / Accent */}
        <path
          d="M 41 73 L 50 82 L 59 73 Z"
          fill={clothingAccent}
          stroke="#e7e2ef"
          strokeWidth="0.8"
        />

        {/* Torso Silhouette */}
        <path
          d="M 26 100 C 26 84 35 76 43 74 L 57 74 C 65 76 74 84 74 100 L 74 110 L 26 110 Z"
          fill={clothingColor}
        />

        {/* Suit lapel / sweater collar lining */}
        <path
          d="M 42 74 L 49 90 L 51 90 L 58 74"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Gesturing arm/hand for explaining/thinking poses */}
        {pose === 'explaining' && (
          <g id="gesture-explaining" className="animate-char-float">
            <path
              d="M 70 88 C 76 84 82 82 87 77"
              stroke={skinTone}
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Open Palm */}
            <circle cx="88" cy="75" r="4" fill={skinTone} />
            <path d="M 88 73 Q 91 71 93 72" stroke={skinTone} strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {pose === 'thinking' && (
          <g id="gesture-thinking">
            <path
              d="M 66 94 C 68 85 64 74 58 64"
              stroke={skinTone}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="57" cy="62" r="3.5" fill={skinTone} />
          </g>
        )}

        {pose === 'protective' && (
          <g id="gesture-protective">
            {/* Subtle shielding arc / hands in protective posture */}
            <path
              d="M 32 94 C 40 86 60 86 68 94"
              stroke={clothingAccent}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
            />
          </g>
        )}
      </g>
    );
  };

  // 1. AVATAR VARIANT (Circular token for cards and tables)
  if (variant === 'avatar') {
    const avatarClass = avatarSizeMap[size] || 'w-12 h-12';
    return (
      <div
        className={`relative rounded-full flex items-center justify-center overflow-hidden border-2 shadow-xs flex-shrink-0 transition-transform ${accentBg} ${accentBorder} ${avatarClass} ${className}`}
        title={`${config.name} (${config.relationship})`}
      >
        {showHalo && (
          <div className="absolute inset-0 rounded-full border-2 border-lavender-400 animate-ping opacity-25" />
        )}
        <svg
          viewBox="22 18 56 62"
          className={`w-full h-full object-cover ${breatheClass}`}
          aria-hidden="true"
        >
          {renderHair()}
          {renderFace()}
          <g transform="translate(0, -2)">
            <path
              d="M 29 80 C 29 69 38 66 50 66 C 62 66 71 69 71 80 Z"
              fill={clothingColor}
            />
            <path
              d="M 43 66 L 50 73 L 57 66 Z"
              fill={clothingAccent}
            />
          </g>
        </svg>
      </div>
    );
  }

  // 2. BUST / FULL PORTRAIT VARIANT
  const portraitClass = portraitSizeMap[size] || 'w-28 h-32';
  return (
    <div
      className={`relative flex items-center justify-center select-none ${portraitClass} ${className}`}
      style={{ transform: `scale(${config.scale})` }}
    >
      {showHalo && (
        <div className="absolute -inset-2 rounded-full bg-lavender-100/60 blur-md -z-10" />
      )}
      <svg
        viewBox="18 14 74 96"
        className={`w-full h-full drop-shadow-xs ${breatheClass}`}
        aria-hidden="true"
      >
        {/* Soft background aura/glow */}
        <circle cx="50" cy="52" r="38" fill={clothingAccent} opacity="0.4" />
        {renderBody()}
        {renderFace()}
        {renderHair()}
      </svg>
    </div>
  );
};
