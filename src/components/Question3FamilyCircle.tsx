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

  return (
    <div className="w-full max-w-3xl mx-auto animate-fadeIn select-none z-10 relative">
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

      {/* Single Add Family Member Action Button */}
      <div className="flex items-center justify-center mb-8">
        <button
          type="button"
          onClick={() => {
            const hasSpouse = familyMembers.some((m) => m.relationship === "Spouse");
            openAddModal(hasSpouse ? "Child" : "Spouse");
          }}
          className="group inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-bg-soft border border-hairline hover:border-lavender-300 text-xs sm:text-sm font-semibold text-ink transition-all shadow-subtle hover:shadow-elevated hover:scale-105 min-h-[48px] w-full sm:w-auto"
        >
          <div className="w-7 h-7 rounded-full bg-lavender-100 border border-lavender-300 flex items-center justify-center text-ink group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4 text-lavender-600 group-hover:rotate-90 transition-transform" />
          </div>
          <span className="font-sans font-semibold">{t.step3.addFamilyMember || "+ Add Family Member"}</span>
        </button>
      </div>

      {/* Editorial Person Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {/* Primary Anchor Card (YOU) */}
        <div className="bg-white border-2 border-lavender-300 rounded-[22px] p-6 shadow-subtle flex flex-col justify-between min-h-[260px] relative transition-all hover:shadow-elevated">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-lavender-100 border border-lavender-300 text-[11px] font-semibold text-ink uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-lavender-600 animate-pulse" />
              <span>{t.step3.youBadge}</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-lavender-600 font-semibold px-2 py-0.5 rounded-md bg-lavender-50 border border-lavender-200">
              Anchor
            </span>
          </div>

          {/* Center Person Profile */}
          <div className="flex flex-col items-center text-center my-auto py-2">
            <div className="w-16 h-16 rounded-full bg-lavender-100 border-2 border-lavender-300 flex items-center justify-center text-ink font-display font-bold text-base shadow-xs mb-3.5">
              YOU
            </div>
            <h3 className="font-display font-bold text-xl text-ink leading-tight mb-1">
              {t.step3.youLabel}
            </h3>
            <p className="text-xs text-ink-soft font-normal mb-2 leading-relaxed">
              {userAge} {t.step2.ageUnit} · {t.step3.youDesc}
            </p>
          </div>

          {/* Card Bottom status indicator */}
          <div className="pt-3 border-t border-hairline flex items-center justify-between text-xs text-ink-soft font-mono">
            <span>Primary Life</span>
            <span className="font-semibold text-ink">Active Anchor</span>
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
              className="bg-white border border-hairline hover:border-lavender-300 rounded-[22px] p-6 shadow-subtle hover:shadow-elevated flex flex-col justify-between min-h-[260px] relative transition-all group"
            >
              {/* Top Header: Relationship Badge + Action Controls */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-bg-soft text-ink border border-hairline text-xs font-semibold">
                  {relTranslated}
                </span>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(member)}
                    className="w-8 h-8 rounded-full bg-white border border-hairline hover:border-ink flex items-center justify-center text-ink-soft hover:text-ink transition-colors shadow-xs"
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
                    className="w-8 h-8 rounded-full bg-white border border-hairline hover:border-red-300 hover:bg-red-50 flex items-center justify-center text-muted hover:text-red-600 transition-colors shadow-xs"
                    title="Remove member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Center Person Profile */}
              <div className="flex flex-col items-center text-center my-auto py-2">
                <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center text-ink font-display font-bold text-base shadow-xs mb-3.5 ${avatarBg}`}>
                  {member.relationship.substring(0, 2).toUpperCase()}
                </div>
                <h3 className="font-display font-bold text-xl text-ink leading-tight mb-1">
                  {member.name || relTranslated}
                </h3>
                <p className="text-xs text-ink-soft font-normal mb-2 leading-relaxed">
                  {member.age} {t.step2.ageUnit}
                </p>

                {/* Metadata Badges */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1">
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

              {/* Card Bottom status indicator */}
              <div className="pt-3 border-t border-hairline flex items-center justify-between text-xs text-ink-soft font-mono">
                <span>Protected Node</span>
                <span className="text-ink font-medium">{relTranslated}</span>
              </div>
            </div>
          );
        })}

        {/* Empty state invitation card if no members yet */}
        {familyMembers.length === 0 && !isSingle && (
          <button
            type="button"
            onClick={() => openAddModal("Spouse")}
            className="rounded-[22px] border-2 border-dashed border-hairline hover:border-lavender-300 bg-bg-soft/60 hover:bg-lavender-50/40 p-6 flex flex-col items-center justify-center text-center min-h-[260px] transition-all group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-white border border-hairline flex items-center justify-center text-muted group-hover:text-lavender-600 group-hover:scale-110 transition-all mb-3 shadow-xs">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-display font-semibold text-base text-ink mb-1">
              {t.step3.addFamilyMember || "Add Family Member"}
            </span>
            <span className="text-xs text-muted max-w-[200px] leading-relaxed">
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