import { create } from 'zustand';
import type { CardData, FactionId, Skill, TemplateId, BadgeConfig, LayoutParams } from '../types';
import { CARD_TEMPLATES, AVAILABLE_TEMPLATES } from '../constants/templates';
import { FACTION_PREFIX } from '../constants/factions';

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

function getDefaultFactionNumber(faction: FactionId): string {
  return `${FACTION_PREFIX[faction]} 001`;
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
  position: { x: 370, y: 560 },
  scale: 1,
};

const defaultLayout = getDefaultLayout('new');

const initialState: CardData = {
  template: 'new',
  faction: 'shu',
  subFaction: undefined,
  title: '',
  name: '',
  isLord: false,
  hp: 4,
  maxHp: 4,
  armor: 0,
  copyright: '',
  artist: '',
  flavor: '',
  factionNumber: getDefaultFactionNumber('shu'),
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
    const currentNum = get().factionNumber;
    const oldPrefix = FACTION_PREFIX[get().faction];
    let newNum = currentNum;
    if (currentNum.startsWith(oldPrefix)) {
      newNum = currentNum.replace(oldPrefix, FACTION_PREFIX[faction]);
    } else {
      newNum = getDefaultFactionNumber(faction);
    }
    set({ faction, factionNumber: newNum });
  },

  setSubFaction: (faction) => {
    set({ subFaction: faction });
  },

  setTemplate: (templateId) => {
    if (!AVAILABLE_TEMPLATES.includes(templateId)) return;
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
    set({ ...initialState, skills: [createDefaultSkill()], layout: getDefaultLayout('new') });
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
      copyright: state.copyright,
      artist: state.artist,
      flavor: state.flavor,
      factionNumber: state.factionNumber,
      badge: state.badge,
      skills: state.skills,
      layout: state.layout,
    };
  },
}));
