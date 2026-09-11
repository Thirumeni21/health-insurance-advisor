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

      {/* Quick Add Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {[
          { label: t.step3.addButtons.spouse, rel: "Spouse" as FamilyRelationship },
          { label: t.step3.addButtons.child, rel: "Child" as FamilyRelationship },
          { label: t.step3.addButtons.mother, rel: "Mother" as FamilyRelationship },
          { label: t.step3.addButtons.father, rel: "Father" as FamilyRelationship },
          { label: t.step3.addButtons.other, rel: "Other Dependent" as FamilyRelationship },
        ].map((item) => (
          <button
            key={item.rel}
            type="button"
            onClick={() => openAddModal(item.rel)}
            className="group inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-white hover:bg-bg-soft border border-hairline hover:border-lavender-300 text-xs font-semibold text-ink transition-all shadow-subtle hover:scale-105 min-h-[44px]"
          >
            <Plus className="w-3.5 h-3.5 text-lavender-600 group-hover:rotate-90 transition-transform" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Member Cards List */}
      <div className="space-y-3 mb-8">
        {/* Central Anchor Card (YOU) */}
        <div className="bg-lavender-100 border border-lavender-300 p-4.5 rounded-[20px] flex items-center justify-between shadow-subtle">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-white border border-lavender-300 flex items-center justify-center text-ink font-display font-bold text-xs shadow-xs">
              YOU
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-lg text-ink">
                  {t.step3.youLabel}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white text-ink border border-lavender-300">
                  {t.step3.youBadge}
                </span>
              </div>
              <span className="text-xs text-ink-soft font-normal">
                {userAge} {t.step2.ageUnit} · {t.step3.youDesc}
              </span>
            </div>
          </div>
          <span className="text-xs text-lavender-600 font-semibold px-2.5 py-1 rounded-full bg-white/70 border border-lavender-200">
            Anchor
          </span>
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
              className="bg-white border border-hairline hover:border-lavender-300 p-4.5 rounded-[20px] flex items-center justify-between shadow-subtle hover:shadow-elevated transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-ink font-display font-bold text-xs shadow-xs ${avatarBg}`}>
                  {member.relationship.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-display font-bold text-lg text-ink">
                      {member.name || relTranslated}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-bg-soft text-ink-soft border border-hairline">
                      {relTranslated}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted font-normal mt-0.5">
                    <span>{member.age} {t.step2.ageUnit}</span>
                    <span>·</span>
                    <span>
                      {member.financiallyDependent === "yes"
                        ? t.step3.dependentTag
                        : member.financiallyDependent === "partially"
                        ? "Partially Dep."
                        : t.step3.familyTag}
                    </span>
                    <span>·</span>
                    <span className={member.existingInsurance === "yes" ? "text-ink font-medium" : "text-muted"}>
                      {member.existingInsurance === "yes" ? t.step3.insuredTag : t.step3.noInsuranceTag}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(member)}
                  className="w-8 h-8 rounded-full bg-white border border-hairline flex items-center justify-center text-muted hover:text-ink hover:border-ink transition-colors"
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
                  className="w-8 h-8 rounded-full bg-white border border-hairline flex items-center justify-center text-muted hover:text-red-500 hover:border-red-300 transition-colors"
                  title="Remove member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {familyMembers.length === 0 && !isSingle && (
          <div className="p-6 rounded-[20px] border border-dashed border-hairline text-center text-xs text-muted bg-bg-soft font-normal">
            {t.step3.emptyNotice}
          </div>
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