import { create } from "zustand";
import { ResumeContent, ResumeContentSchema } from "@/lib/schemas/resume";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash";

interface EditorState {
  resumeId: string | null;
  content: ResumeContent;
  
  // Selection
  activeSection: string | null;
  
  // History
  history: ResumeContent[];
  historyIndex: number;
  
  // Status
  isSaving: boolean;
  lastSavedAt: Date | null;
  
  // Actions
  initialize: (id: string, data: any) => void;
  updateProfile: (data: Partial<ResumeContent['profile']>) => void;
  updateSummary: (html: string) => void;
  
  // Generic List Actions
  addItem: (section: 'experience' | 'projects' | 'education' | 'certifications') => void;
  updateItem: (section: 'experience' | 'projects' | 'education' | 'certifications', id: string, data: any) => void;
  removeItem: (section: 'experience' | 'projects' | 'education' | 'certifications', id: string) => void;
  reorderItems: (section: 'experience' | 'projects' | 'education' | 'certifications', newItems: any[]) => void;
  
  // Section Layout
  reorderSections: (newOrder: string[]) => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
}

const MAX_HISTORY = 50;

export const useResumeStore = create<EditorState>((set, get) => ({
  resumeId: null,
  content: ResumeContentSchema.parse({}), // Initial empty state
  activeSection: "profile",
  
  history: [],
  historyIndex: -1,
  
  isSaving: false,
  lastSavedAt: null,

  initialize: (id, data) => {
    // Parse ensure schema validity, filling defaults
    const parsed = ResumeContentSchema.parse(data || {});
    set({ 
        resumeId: id, 
        content: parsed, 
        history: [parsed], 
        historyIndex: 0 
    });
  },

  // --- Helper to push to history ---
  _pushHistory: (newContent: ResumeContent) => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newContent);
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      return {
        content: newContent,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  updateProfile: (data) => {
      const current = get().content;
      const newContent = { ...current, profile: { ...current.profile, ...data } };
      // @ts-ignore - internal
      get()._pushHistory(newContent);
  },

  updateSummary: (html) => {
      const current = get().content;
      const newContent = { ...current, summary: html };
      // @ts-ignore
      get()._pushHistory(newContent);
  },

  addItem: (section) => {
    const current = get().content;
    const newItem = { id: uuidv4() }; // Schema defaults will fill rest if parsed, but we should init
    
    // Add defaults based on section
    if(section === 'experience') Object.assign(newItem, { title: "New Role", company: "Company", current: false });
    if(section === 'projects') Object.assign(newItem, { title: "New Project", techStack: [] });
    if(section === 'education') Object.assign(newItem, { school: "University", degree: "Degree" });
    if(section === 'certifications') Object.assign(newItem, { name: "Certificate" });

    const newContent = { 
        ...current, 
        [section]: [...current[section as keyof ResumeContent] as any[], newItem] 
    };
    // @ts-ignore
    get()._pushHistory(newContent);
  },

  updateItem: (section, id, data) => {
    const current = get().content;
    const list = current[section as keyof ResumeContent] as any[];
    const newContent = {
        ...current,
        [section]: list.map(item => item.id === id ? { ...item, ...data } : item)
    };
    // @ts-ignore
    get()._pushHistory(newContent);
  },

  removeItem: (section, id) => {
      const current = get().content;
      const list = current[section as keyof ResumeContent] as any[];
      const newContent = {
          ...current,
          [section]: list.filter(item => item.id !== id)
      };
      // @ts-ignore
      get()._pushHistory(newContent);
  },

  reorderItems: (section, newItems) => {
      const current = get().content;
      const newContent = { ...current, [section]: newItems };
      // @ts-ignore
      get()._pushHistory(newContent);
  },

  reorderSections: (newOrder) => {
      const current = get().content;
      const newContent = { ...current, sectionOrder: newOrder };
      // @ts-ignore
      get()._pushHistory(newContent);
  },

  undo: () => {
    set((state) => {
        if(state.historyIndex <= 0) return state;
        const newIndex = state.historyIndex - 1;
        return {
            content: state.history[newIndex],
            historyIndex: newIndex
        }
    })
  },

  redo: () => {
    set((state) => {
        if(state.historyIndex >= state.history.length - 1) return state;
        const newIndex = state.historyIndex + 1;
        return {
            content: state.history[newIndex],
            historyIndex: newIndex
        }
    })
  }

}));
