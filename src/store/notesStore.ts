 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

type NotesState = {
  notes: Note[];
  addNote: (title: string, content: string) => void;
  deleteNote: (id: string) => void;
};

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: [],

      addNote: (title, content) =>
        set((state) => ({
          notes: [
            {
              id: `${Date.now()}-${Math.random()}`,
              title,
              content,
              createdAt: new Date().toISOString(),
            },
            ...state.notes,
          ],
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),
    }),
    {
      name: 'personal-notes',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
