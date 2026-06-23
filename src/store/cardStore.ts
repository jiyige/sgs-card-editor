import { create } from 'zustand';
import type { CardData, FactionId, Skill, TemplateId, BadgeConfig, LayoutParams } from '../types';
import { CARD_TEMPLATES } from '../constants/templates';

function generateId(): string {
  return `skill_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function createDefaultSkill(): Skill {
  return {
    id: generateId(),
    name: '',
    description: '',
    isDerived: false,
  };
}

function getDefaultLayout(templateId: TemplateId): LayoutParams {
  const template = CARD_TEMPLATES.find(t => t.id === templateId);
  return template ? { ...template.defaultLayout } : { ...CARD_TEMPLATES[0].defaultLayout };
}

interface CardStore extends CardData {
  updateField: <K extends keyof CardData>(field: K, value: CardData[K]) => void;
  updateLayoutField: <K extends keyof LayoutParams>(field: K, value: LayoutParams[K]) => void;
  setFaction: (faction: FactionId) => void;
  setSubFaction: (faction: FactionId | undefined) => void;
  setTemplate: (templateId: TemplateId) => void;
  toggleLord: () => void;
  addSkill: () => void;
  removeSkill: (skillId: string) => void;
  updateSkill: (skillId: string, field: keyof Skill, value: string | boolean) => void;
  resetAll: () => void;
  importData: (data: Partial<CardData>) => void;
  exportData: () => CardData;
}

const defaultBadge: BadgeConfig = {
  type: 'builtin',
  builtinId: '',
  position: { x: 370, y: 18 },
  scale: 1,
};

const defaultLayout = getDefaultLayout('standard');

const initialState: CardData = {
  template: 'standard',
  faction: 'shu',
  subFaction: undefined,
  title: '',
  name: '',
  isLord: false,
  hp: 3,
  maxHp: 3,
  armor: 0,
  titleFont: 'serif-sc',
  titleColor: '#FFFFFF',
  nameFont: 'serif-sc',
  nameColor: '#FFFFFF',
  borderColor: '',
  copyright: '',
  artist: '',
  flavor: '',
  badge: defaultBadge,
  skills: [createDefaultSkill()],
  layout: defaultLayout,
};

export const useCardStore = create<CardStore>((set, get) => ({
  ...initialState,

  updateField: (field, value) => {
    set({ [field]: value } as Partial<CardStore>);
  },

  updateLayoutField: (field, value) => {
    set((state) => ({
      layout: { ...state.layout, [field]: value },
    }));
  },

  setFaction: (faction) => {
    set({ faction });
  },

  setSubFaction: (faction) => {
    set({ subFaction: faction });
  },

  setTemplate: (templateId) => {
    const newLayout = getDefaultLayout(templateId);
    const template = CARD_TEMPLATES.find(t => t.id === templateId);
    set({
      template: templateId,
      layout: newLayout,
      subFaction: template?.supportsDualFaction ? get().subFaction : undefined,
    });
  },

  toggleLord: () => {
    set((state) => ({ isLord: !state.isLord }));
  },

  addSkill: () => {
    const skills = get().skills;
    if (skills.length >= 10) return;
    set({ skills: [...skills, createDefaultSkill()] });
  },

  removeSkill: (skillId) => {
    const skills = get().skills;
    if (skills.length <= 1) return;
    set({ skills: skills.filter((s) => s.id !== skillId) });
  },

  updateSkill: (skillId, field, value) => {
    set((state) => ({
      skills: state.skills.map((s) =>
        s.id === skillId ? { ...s, [field]: value } : s
      ),
    }));
  },

  resetAll: () => {
    set({ ...initialState, skills: [createDefaultSkill()], layout: getDefaultLayout('standard') });
  },

  importData: (data) => {
    set((state) => ({
      ...state,
      ...data,
    }));
  },

  exportData: () => {
    const state = get();
    return {
      template: state.template,
      faction: state.faction,
      subFaction: state.subFaction,
      title: state.title,
      name: state.name,
      isLord: state.isLord,
      hp: state.hp,
      maxHp: state.maxHp,
      armor: state.armor,
      titleFont: state.titleFont,
      titleColor: state.titleColor,
      nameFont: state.nameFont,
      nameColor: state.nameColor,
      borderColor: state.borderColor,
      copyright: state.copyright,
      artist: state.artist,
      flavor: state.flavor,
      badge: state.badge,
      skills: state.skills,
      layout: state.layout,
    };
  },
}));
