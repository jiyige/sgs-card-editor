import { create } from 'zustand';

type InteractionMode = 'none' | 'art' | 'title' | 'name' | 'skill';

interface UIStore {
  expandedPanels: Record<string, boolean>;
  togglePanel: (panelId: string) => void;
  setPanelExpanded: (panelId: string, expanded: boolean) => void;

  activeModal: string | null;
  openModal: (modalId: string) => void;
  closeModal: () => void;

  interactionMode: InteractionMode;
  setInteractionMode: (mode: InteractionMode) => void;
  previewScale: number;
  setPreviewScale: (scale: number) => void;

  toasts: { id: string; message: string; type: 'success' | 'error' | 'info' }[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

let toastCounter = 0;

export const useUIStore = create<UIStore>((set, get) => ({
  expandedPanels: {
    basic: true,
    stats: true,
    appearance: false,
    art: false,
    skills: true,
    extra: false,
    badge: false,
    layout: false,
  },

  togglePanel: (panelId) => {
    set((state) => ({
      expandedPanels: {
        ...state.expandedPanels,
        [panelId]: !state.expandedPanels[panelId],
      },
    }));
  },

  setPanelExpanded: (panelId, expanded) => {
    set((state) => ({
      expandedPanels: {
        ...state.expandedPanels,
        [panelId]: expanded,
      },
    }));
  },

  activeModal: null,
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),

  interactionMode: 'none',
  setInteractionMode: (mode) => set({ interactionMode: mode }),
  previewScale: 1,
  setPreviewScale: (scale) => set({ previewScale: Math.max(0.3, Math.min(3, scale)) }),

  toasts: [],
  addToast: (message, type = 'info') => {
    const id = `toast_${++toastCounter}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
