import { FamilyMember, UserProtectionProfile, GenderType, FamilyRelationship } from '@/types/questionnaire';
import { TargetPerson } from '@/types/stage2';

export type CharacterArchetype =
  | 'adult_male'
  | 'adult_female'
  | 'elder_male'
  | 'elder_female'
  | 'child_boy'
  | 'child_girl'
  | 'youth_neutral';

export type CharacterPose =
  | 'idle'
  | 'explaining'
  | 'thinking'
  | 'protective'
  | 'reflective';

export interface CharacterVisualConfig {
  id: string;
  archetype: CharacterArchetype;
  name: string;
  relationship: string;
  age: number;
  gender: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  badgeColor: string;
  scale: number;
  hairColor: string;
  clothingColor: string;
  clothingAccent: string;
  skinTone: string;
  hasGlasses?: boolean;
}

/**
 * Deterministically maps the primary user to a persistent character identity.
 */
export function getCharacterForUser(
  userProfile: UserProtectionProfile['user'],
  userName: string = 'You'
): CharacterVisualConfig {
  const age = userProfile.age || 32;
  const gender = userProfile.gender || 'male';

  let archetype: CharacterArchetype = 'adult_male';
  let hairColor = '#2c2438'; // deep ink
  let clothingColor = '#8b68cf'; // lavender primary
  let clothingAccent = '#eee6fb';
  let skinTone = '#f7d3ba';
  let hasGlasses = false;

  if (gender === 'female') {
    archetype = age >= 60 ? 'elder_female' : 'adult_female';
    hairColor = age >= 60 ? '#8c8299' : '#30263d';
  } else if (gender === 'male') {
    archetype = age >= 60 ? 'elder_male' : 'adult_male';
    hairColor = age >= 60 ? '#828994' : '#24202e';
    if (age >= 55) hasGlasses = true;
  } else {
    archetype = age >= 60 ? 'elder_female' : 'youth_neutral';
  }

  return {
    id: 'primary_user_anchor',
    archetype,
    name: userName,
    relationship: 'You',
    age,
    gender,
    accentBg: 'bg-lavender-100',
    accentBorder: 'border-lavender-300',
    accentText: 'text-lavender-700',
    badgeColor: 'bg-lavender-500',
    scale: 1.0,
    hairColor,
    clothingColor,
    clothingAccent,
    skinTone,
    hasGlasses,
  };
}

/**
 * Deterministically maps a family member to a persistent character identity.
 */
export function getCharacterForMember(
  member: FamilyMember | { id: string; relationship: string; name?: string; age: number; gender: string }
): CharacterVisualConfig {
  const age = member.age || 30;
  const gender = member.gender || 'male';
  const rel = member.relationship as FamilyRelationship;
  const memberName = member.name || rel;

  let archetype: CharacterArchetype = 'adult_male';
  let accentBg = 'bg-lavender-100';
  let accentBorder = 'border-lavender-300';
  let accentText = 'text-lavender-700';
  let badgeColor = 'bg-lavender-500';
  let scale = 1.0;
  let hairColor = '#2b2638';
  let clothingColor = '#8b68cf';
  let clothingAccent = '#eee6fb';
  let skinTone = '#f7d3ba';
  let hasGlasses = false;

  switch (rel) {
    case 'Spouse':
      archetype = gender === 'female' ? 'adult_female' : 'adult_male';
      accentBg = 'bg-sage-100';
      accentBorder = 'border-[#cce0b2]';
      accentText = 'text-sage-700';
      badgeColor = 'bg-sage-500';
      clothingColor = '#9cb974'; // sage
      clothingAccent = '#e9f0da';
      hairColor = gender === 'female' ? '#3c2a3e' : '#262230';
      break;

    case 'Child':
      archetype = gender === 'female' ? 'child_girl' : 'child_boy';
      accentBg = 'bg-cream-100';
      accentBorder = 'border-[#ebd7bc]';
      accentText = 'text-[#b2793e]';
      badgeColor = 'bg-[#d89758]';
      scale = 0.82;
      clothingColor = '#e68d5c'; // soft coral / warm peach
      clothingAccent = '#fce8dc';
      hairColor = '#3d2d22';
      skinTone = '#fde1cb';
      break;

    case 'Mother':
      archetype = 'elder_female';
      accentBg = 'bg-lavender-100';
      accentBorder = 'border-lavender-300';
      accentText = 'text-lavender-700';
      badgeColor = 'bg-lavender-500';
      scale = 0.94;
      hairColor = '#928e9e'; // graceful silver-grey
      clothingColor = '#7f62b8';
      clothingAccent = '#f0eafb';
      skinTone = '#f3d1b8';
      break;

    case 'Father':
      archetype = 'elder_male';
      accentBg = 'bg-sage-100';
      accentBorder = 'border-[#c4d6ad]';
      accentText = 'text-sage-700';
      badgeColor = 'bg-sage-500';
      scale = 0.96;
      hairColor = '#858c94'; // silver steel
      clothingColor = '#6f8851'; // muted forest
      clothingAccent = '#eaf2e1';
      skinTone = '#f0cfb5';
      hasGlasses = true;
      break;

    case 'Grandparent':
      archetype = gender === 'female' ? 'elder_female' : 'elder_male';
      accentBg = 'bg-cream-100';
      accentBorder = 'border-[#ebd7bc]';
      accentText = 'text-[#b2793e]';
      badgeColor = 'bg-[#d89758]';
      scale = 0.92;
      hairColor = '#aba6b5';
      clothingColor = '#9c7c64';
      clothingAccent = '#f7eee4';
      hasGlasses = true;
      break;

    case 'Sibling':
      archetype = gender === 'female' ? 'adult_female' : 'adult_male';
      accentBg = 'bg-lavender-100';
      accentBorder = 'border-lavender-300';
      accentText = 'text-lavender-700';
      badgeColor = 'bg-lavender-500';
      clothingColor = '#6b77c4';
      clothingAccent = '#e9ebfb';
      break;

    default: // Other Dependent
      archetype = age < 18 
        ? (gender === 'female' ? 'child_girl' : 'child_boy')
        : age >= 60 
        ? (gender === 'female' ? 'elder_female' : 'elder_male')
        : (gender === 'female' ? 'adult_female' : 'adult_male');
      accentBg = 'bg-bg-soft';
      accentBorder = 'border-hairline';
      accentText = 'text-ink';
      badgeColor = 'bg-ink';
      clothingColor = '#524b61';
      clothingAccent = '#ece9f2';
      scale = age < 18 ? 0.82 : 1.0;
      break;
  }

  return {
    id: member.id,
    archetype,
    name: memberName,
    relationship: rel,
    age,
    gender,
    accentBg,
    accentBorder,
    accentText,
    badgeColor,
    scale,
    hairColor,
    clothingColor,
    clothingAccent,
    skinTone,
    hasGlasses,
  };
}

/**
 * Deterministically gets the character configuration for a Stage 2 TargetPerson.
 */
export function getCharacterForTargetPerson(
  targetPerson: TargetPerson,
  userProfile: UserProtectionProfile['user']
): CharacterVisualConfig {
  if (targetPerson.isSelfOnly || targetPerson.characterType === 'self') {
    return getCharacterForUser(userProfile, targetPerson.name);
  }

  return getCharacterForMember({
    id: targetPerson.familyMemberId || 'target_person',
    relationship: targetPerson.relationship,
    name: targetPerson.name,
    age: targetPerson.age,
    gender: targetPerson.gender as GenderType,
  });
}
