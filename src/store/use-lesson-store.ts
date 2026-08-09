import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { units as defaultUnits } from '@/data/lessons';
import { Unit, Lesson } from '@/types';

interface LessonStore {
  units: Unit[];
  
  // Actions
  addUnit: (title: string, description: string) => string;
  updateUnit: (unitId: string, title: string, description: string) => void;
  deleteUnit: (unitId: string) => void;
  addModule: (unitId: string, title: string, description: string) => string;
  updateModule: (moduleId: string, title: string, description: string) => void;
  deleteModule: (moduleId: string) => void;
  addLesson: (moduleId: string, lesson: Lesson) => void;
  updateLesson: (lessonId: string, updatedLesson: Partial<Lesson>) => void;
  deleteLesson: (lessonId: string) => void;
  
  // Helpers
  getAllLessons: () => (Lesson & { unitTitle?: string; moduleTitle?: string; unitId?: string })[];
  getLessonById: (id: string) => (Lesson & { unitTitle?: string; moduleTitle?: string; unitId?: string }) | undefined;
  getNextLessonId: (currentId: string) => string | null;
}

export const useLessonStore = create<LessonStore>()(
  persist(
    (set, get) => ({
      units: defaultUnits,

      addUnit: (title, description) => {
        const newId = `unit-${Date.now()}`;
        set((state) => {
          const newUnits = JSON.parse(JSON.stringify(state.units));
          newUnits.push({
            id: newId,
            title,
            description,
            modules: []
          });
          return { units: newUnits };
        });
        return newId;
      },

      addModule: (unitId, title, description) => {
        const newId = `module-${Date.now()}`;
        set((state) => {
          const newUnits = JSON.parse(JSON.stringify(state.units));
          const unit = newUnits.find((u: any) => u.id === unitId);
          if (unit) {
            unit.modules.push({
              id: newId,
              title,
              description,
              lessons: []
            });
          }
          return { units: newUnits };
        });
        return newId;
      },

      updateUnit: (unitId, title, description) => set((state) => {
        const newUnits = JSON.parse(JSON.stringify(state.units));
        const unit = newUnits.find((u: any) => u.id === unitId);
        if (unit) {
          unit.title = title;
          unit.description = description;
        }
        return { units: newUnits };
      }),

      deleteUnit: (unitId) => set((state) => {
        const newUnits = state.units.filter((u: any) => u.id !== unitId);
        return { units: newUnits };
      }),

      updateModule: (moduleId, title, description) => set((state) => {
        const newUnits = JSON.parse(JSON.stringify(state.units));
        for (const unit of newUnits) {
          const mod = unit.modules.find((m: any) => m.id === moduleId);
          if (mod) {
            mod.title = title;
            mod.description = description;
            break;
          }
        }
        return { units: newUnits };
      }),

      deleteModule: (moduleId) => set((state) => {
        const newUnits = JSON.parse(JSON.stringify(state.units));
        for (const unit of newUnits) {
          unit.modules = unit.modules.filter((m: any) => m.id !== moduleId);
        }
        return { units: newUnits };
      }),

      addLesson: (moduleId, lesson) => set((state) => {
        const newUnits = JSON.parse(JSON.stringify(state.units));
        for (const unit of newUnits) {
          const mod = unit.modules.find((m: any) => m.id === moduleId);
          if (mod) {
            mod.lessons.push(lesson);
            mod.lessons.sort((a: any, b: any) => a.orderIndex - b.orderIndex);
            break;
          }
        }
        return { units: newUnits };
      }),

      updateLesson: (lessonId, updatedData) => set((state) => {
        const newUnits = JSON.parse(JSON.stringify(state.units));
        let found = false;
        for (const unit of newUnits) {
          for (const mod of unit.modules) {
            const index = mod.lessons.findIndex((l: any) => l.id === lessonId);
            if (index !== -1) {
              mod.lessons[index] = { ...mod.lessons[index], ...updatedData };
              found = true;
              break;
            }
          }
          if (found) break;
        }
        return { units: newUnits };
      }),

      deleteLesson: (lessonId) => set((state) => {
        const newUnits = JSON.parse(JSON.stringify(state.units));
        let found = false;
        for (const unit of newUnits) {
          for (const mod of unit.modules) {
            const index = mod.lessons.findIndex((l: any) => l.id === lessonId);
            if (index !== -1) {
              mod.lessons.splice(index, 1);
              mod.lessons.forEach((l: any, i: number) => { l.orderIndex = i + 1; });
              found = true;
              break;
            }
          }
          if (found) break;
        }
        return { units: newUnits };
      }),

      getAllLessons: () => {
        const { units } = get();
        const all = [];
        for (const unit of units) {
          for (const mod of unit.modules) {
            for (const lesson of mod.lessons) {
              all.push({
                ...lesson,
                unitTitle: unit.title,
                moduleTitle: mod.title,
                unitId: unit.id
              });
            }
          }
        }
        return all;
      },

      getLessonById: (id) => {
        return get().getAllLessons().find((l) => l.id === id);
      },

      getNextLessonId: (currentId) => {
        const all = get().getAllLessons();
        const currentIndex = all.findIndex((l) => l.id === currentId);
        if (currentIndex === -1 || currentIndex === all.length - 1) return null;
        return all[currentIndex + 1].id;
      }
    }),
    {
      name: 'lesson-storage',
    }
  )
);
