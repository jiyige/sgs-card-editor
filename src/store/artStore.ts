import { create } from 'zustand';

interface ArtEntry {
  id: string;
  dataUrl: string;
  name: string;
  addedAt: number;
}

interface ArtStore {
  currentArt: string | null;
  artLibrary: ArtEntry[];
  setCurrentArt: (dataUrl: string | null) => void;
  addToLibrary: (dataUrl: string, name: string) => void;
  removeFromLibrary: (id: string) => void;
  selectFromLibrary: (id: string) => void;
}

const MAX_LIBRARY_SIZE = 10;

function loadLibrary(): ArtEntry[] {
  try {
    const raw = localStorage.getItem('sgs_art_library');
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveLibrary(entries: ArtEntry[]) {
  try {
    localStorage.setItem('sgs_art_library', JSON.stringify(entries));
  } catch {}
}

export const useArtStore = create<ArtStore>((set, get) => ({
  currentArt: null,
  artLibrary: loadLibrary(),

  setCurrentArt: (dataUrl) => {
    set({ currentArt: dataUrl });
  },

  addToLibrary: (dataUrl, name) => {
    const library = get().artLibrary;
    const entry: ArtEntry = {
      id: `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      dataUrl,
      name,
      addedAt: Date.now(),
    };
    let newLibrary = [entry, ...library];
    if (newLibrary.length > MAX_LIBRARY_SIZE) {
      newLibrary = newLibrary.slice(0, MAX_LIBRARY_SIZE);
    }
    saveLibrary(newLibrary);
    set({ artLibrary: newLibrary, currentArt: dataUrl });
  },

  removeFromLibrary: (id) => {
    const newLibrary = get().artLibrary.filter((e) => e.id !== id);
    saveLibrary(newLibrary);
    set({ artLibrary: newLibrary });
  },

  selectFromLibrary: (id) => {
    const entry = get().artLibrary.find((e) => e.id === id);
    if (entry) {
      set({ currentArt: entry.dataUrl });
    }
  },
}));
