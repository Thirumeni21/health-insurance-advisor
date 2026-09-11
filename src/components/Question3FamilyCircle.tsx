"use client";

import React, { useState } from "react";
import { ArrowRight, Plus, Trash2, Edit2 } from "lucide-react";
import {
  FamilyMember,
  FamilyRelationship,
  HouseholdType,
} from "@/types/questionnaire";
import { FamilyMemberModal } from "./FamilyMemberModal";
import { sound } from "@/lib/soundFx";
import { useLanguage } from "@/context/LanguageContext";

interface Question3FamilyCircleProps {
  householdType: HouseholdType | null;
  userAge: number;
  familyMembers: FamilyMember[];
  onAddMember: (member: FamilyMember) => void;
  onUpdateMember: (member: FamilyMember) => void;
  onRemoveMember: (id: string) => void;
  onContinue: () => void;
}

export const Question3FamilyCircle: React.FC<Question3FamilyCircleProps> = ({
  householdType,
  userAge,
  familyMembers,
  onAddMember,
  onUpdateMember,
  onRemoveMember,
  onContinue,
}) => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [defaultRelationship, setDefaultRelationship] = useState<FamilyRelationship>("Spouse");

  const openAddModal = (relationship: FamilyRelationship) => {
    sound.playChime(500, 0.1);
    setEditingMember(null);
    setDefaultRelationship(relationship);
    setIsModalOpen(true);
  };

  const openEditModal = (member: FamilyMember) => {
    sound.playChime(460, 0.08);
    setEditingMember(member);
    setDefaultRelationship(member.relationship);
    setIsModalOpen(true);
  };

  const handleSaveModal = (member: FamilyMember) => {
    if (editingMember) {
      onUpdateMember(member);
    } else {
      onAddMember(member);
    }
  };

  const isSingle = householdType === "myself";
  const hasMembers = familyMembers.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto animate-fadeIn select-none">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="mb-2 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-bg-soft border border-hairline">
          <span className="w-1.5 h-1.5 rounded-full bg-lavender-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            {t.step3.tag}
          </span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-ink tracking-tight mb-2.5 sm:mb-3">
          {t.step3.title}
        </h1>
        <p className="font-sans text-xs sm:text-sm md:text-base text-ink-soft max-w-md mx-auto font-normal">
          {t.step3.subtitle}
        </p>
      </div>

      {/* Add Family Member Button (only displayed above when circle already has members) */}
      {hasMembers && (
        <div className="flex items-center justify-center mb-7">
          <button
            type="button"
            onClick={() => {
              const hasSpouse = familyMembers.some((m) => m.relationship === "Spouse");
              openAddModal(hasSpouse ? "Child" : "Spouse");
            }}
            className="group inline-flex items-center justify-center space-x-2.5 px-6 py-3 rounded-full bg-ink hover:bg-[#2e283b] text-white text-xs sm:text-sm font-semibold transition-all shadow-subtle hover:shadow-elevated hover:scale-105 min-h-[46px]"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <Plus className="w-3.5 h-3.5 text-white group-hover:rotate-90 transition-transform" />
            </div>
            <span>{t.step3.addFamilyMember || "+ Add Family Member"}</span>
          </button>
        </div>
      )}

      {/* Editorial Person Card Grid */}
      <div
        className={
          !hasMembers && !isSingle
            ? "grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8 max-w-2xl mx-auto"
            : familyMembers.length <= 1
            ? "grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8 max-w-3xl mx-auto"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
        }
      >
        {/* Primary Anchor Card (YOU) */}
        <div className="bg-white border-2 border-lavender-300 rounded-[20px] p-6 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-lavender-100 border border-lavender-300 flex items-center justify-center text-ink font-display font-bold text-sm shadow-xs flex-shrink-0">
                YOU
              </div>
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-lavender-100 text-[11px] font-semibold text-ink font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-lavender-600 animate-pulse" />
                <span>{t.step3.youBadge || "Anchor"}</span>
              </span>
            </div>

            <h3 className="font-display font-bold text-xl text-ink leading-tight mb-1">
              {t.step3.youLabel}
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed font-normal mb-4">
              {userAge} {t.step2.ageUnit} · {t.step3.youDesc}
            </p>
          </div>

          <div className="pt-3 border-t border-hairline mt-4 flex items-center justify-between text-xs font-mono text-ink-soft">
            <span>Primary Anchor</span>
            <span className="font-semibold text-ink">Active Cover</span>
          </div>
        </div>

        {/* Dynamic Added Members */}
        {familyMembers.map((member) => {
          const relTranslated = t.modal.relationships[member.relationship] || member.relationship;

          const avatarBg =
            member.relationship === "Child"
              ? "bg-sage-100 border-[#d3e0ba]"
              : member.relationship === "Mother" || member.relationship === "Father"
              ? "bg-cream-100 border-[#eae3d2]"
              : "bg-lavender-100 border-lavender-300";

          return (
            <div
              key={member.id}
              className="bg-white border border-hairline hover:border-lavender-300 rounded-[20px] p-6 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center text-ink font-display font-bold text-sm shadow-xs flex-shrink-0 ${avatarBg}`}>
                    {member.relationship.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(member)}
                      className="w-8 h-8 rounded-full bg-bg-soft hover:bg-white border border-hairline hover:border-ink flex items-center justify-center text-ink-soft hover:text-ink transition-colors shadow-xs"
                      title="Edit member"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playChime(320, 0.1);
                        onRemoveMember(member.id);
                      }}
                      className="w-8 h-8 rounded-full bg-bg-soft hover:bg-red-50 border border-hairline hover:border-red-300 flex items-center justify-center text-muted hover:text-red-600 transition-colors shadow-xs"
                      title="Remove member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <h3 className="font-display font-bold text-xl text-ink leading-tight">
                    {member.name || relTranslated}
                  </h3>
                  {member.name && (
                    <span className="text-xs text-muted font-normal">({relTranslated})</span>
                  )}
                </div>
                <p className="text-xs text-ink-soft leading-relaxed font-normal mb-3">
                  {member.age} {t.step2.ageUnit} · {member.gender === "female" ? "Female" : member.gender === "male" ? "Male" : "Other"}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-bg-soft border border-hairline text-ink-soft">
                    {member.financiallyDependent === "yes"
                      ? t.step3.dependentTag
                      : member.financiallyDependent === "partially"
                      ? "Partially Dep."
                      : t.step3.familyTag}
                  </span>
                  <span
                    className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                      member.existingInsurance === "yes"
                        ? "bg-lavender-100 border-lavender-300 text-ink font-semibold"
                        : "bg-white border-hairline text-muted"
                    }`}
                  >
                    {member.existingInsurance === "yes" ? t.step3.insuredTag : t.step3.noInsuranceTag}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-hairline mt-4 flex items-center justify-between text-xs font-mono text-ink-soft">
                <span>Protected Member</span>
                <span className="font-semibold text-ink">{relTranslated}</span>
              </div>
            </div>
          );
        })}

        {/* Empty state invitation card if no members yet */}
        {!hasMembers && !isSingle && (
          <button
            type="button"
            onClick={() => {
              sound.playChime(500, 0.1);
              openAddModal("Spouse");
            }}
            className="rounded-[20px] border-2 border-dashed border-hairline hover:border-lavender-400 bg-bg-soft/40 hover:bg-lavender-50/30 p-6 flex flex-col items-center justify-center text-center min-h-[220px] transition-all group cursor-pointer shadow-xs hover:shadow-subtle"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-hairline group-hover:border-lavender-300 flex items-center justify-center text-ink-soft group-hover:text-lavender-600 group-hover:scale-110 transition-all mb-3 shadow-xs">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-base text-ink mb-1 group-hover:text-lavender-600 transition-colors">
              {t.step3.addFamilyMember || "+ Add Family Member"}
            </span>
            <span className="text-xs text-muted max-w-[220px] leading-relaxed font-normal">
              {t.step3.emptyNotice}
            </span>
          </button>
        )}
      </div>

      {/* Continue */}
      <div className="flex items-center justify-center">
        <button
          onClick={() => {
            sound.playChime(580, 0.12);
            onContinue();
          }}
          className="group inline-flex items-center justify-center space-x-3 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-ink hover:bg-[#2e283b] text-white shadow-subtle hover:shadow-elevated hover:scale-105 transition-all duration-300 min-h-[48px] w-full sm:w-auto"
        >
          <span>{t.step3.continue}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Modal */}
      <FamilyMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        initialData={editingMember}
        defaultRelationship={defaultRelationship}
      />
    </div>
  );
};