import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { units as defaultUnits } from '@/data/lessons';
import { Unit, Lesson } from '@/types';

interface LessonStore {
  units: Unit[];
  
  // Actions
  fetchLessons: () => Promise<void>;
  addUnit: (title: string, description: string) => Promise<string>;
  updateUnit: (unitId: string, title: string, description: string) => Promise<void>;
  deleteUnit: (unitId: string) => Promise<void>;
  addModule: (unitId: string, title: string, description: string) => Promise<string>;
  updateModule: (moduleId: string, title: string, description: string) => Promise<void>;
  deleteModule: (moduleId: string) => Promise<void>;
  addLesson: (moduleId: string, lesson: Lesson) => Promise<void>;
  updateLesson: (lessonId: string, updatedLesson: Partial<Lesson>) => Promise<void>;
  deleteLesson: (lessonId: string) => Promise<void>;
  
  // Helpers
  getAllLessons: () => (Lesson & { unitTitle?: string; moduleTitle?: string; unitId?: string })[];
  getLessonById: (id: string) => (Lesson & { unitTitle?: string; moduleTitle?: string; unitId?: string }) | undefined;
  getNextLessonId: (currentId: string) => string | null;
}

export const useLessonStore = create<LessonStore>()(
  persist(
    (set, get) => ({
      units: defaultUnits,

      fetchLessons: async () => {
        try {
          const res = await fetch('http://localhost:8000/api/v1/lessons');
          if (res.ok) {
            const data = await res.json();
            // Transform backend data to frontend format
            const transformedUnits = data.map((unit: any) => ({
              id: unit.id,
              title: unit.title,
              description: '',
              orderIndex: unit.order_index,
              order_index: unit.order_index,
              modules: unit.modules.map((mod: any) => ({
                id: mod.id,
                unitId: mod.unit_id,
                title: mod.title,
                orderIndex: mod.order_index,
                lessons: mod.lessons.map((l: any) => ({
                  id: l.id,
                  moduleId: l.module_id,
                  title: l.title,
                  lessonType: l.lesson_type,
                  contentBlocks: l.content_blocks || [],
                  xpReward: l.xp_reward,
                  orderIndex: l.order_index,
                  ...l.exercise_data
                }))
              }))
            }));
            // Sort units, modules, and lessons strictly by orderIndex
            const sortedUnits = transformedUnits.sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));
            sortedUnits.forEach((u: any) => {
              u.modules.sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));
              u.modules.forEach((m: any) => {
                m.lessons.sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));
              });
            });
            set({ units: sortedUnits });
          }
        } catch (error) {
          console.error("Failed to fetch lessons:", error);
        }
      },

      addUnit: async (title, description) => {
        try {
          const res = await fetch('http://localhost:8000/api/teacher/units', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, order_index: get().units.length + 1 })
          });
          if (res.ok) {
            const newUnit = await res.json();
            await get().fetchLessons();
            return newUnit.id;
          }
        } catch (e) {
          console.error('Failed to add unit to backend:', e);
        }
        const newId = `unit-${Date.now()}`;
        set((state) => ({
          units: [...state.units, { id: newId, title, description, modules: [] }]
        }));
        return newId;
      },

      addModule: async (unitId, title, description) => {
        try {
          const res = await fetch('http://localhost:8000/api/teacher/modules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ unit_id: unitId, title, order_index: 99 })
          });
          if (res.ok) {
            const newMod = await res.json();
            await get().fetchLessons();
            return newMod.id;
          }
        } catch (e) {
          console.error('Failed to add module to backend:', e);
        }
        const newId = `module-${Date.now()}`;
        set((state) => {
          const newUnits = JSON.parse(JSON.stringify(state.units));
          const unit = newUnits.find((u: any) => u.id === unitId);
          if (unit) unit.modules.push({ id: newId, title, description, lessons: [] });
          return { units: newUnits };
        });
        return newId;
      },

      updateUnit: async (unitId, title, description) => {
        try {
          await fetch(`http://localhost:8000/api/teacher/units/${unitId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
          });
          await get().fetchLessons();
        } catch (e) {
          console.error('Failed to update unit:', e);
        }
      },

      deleteUnit: async (unitId) => {
        try {
          await fetch(`http://localhost:8000/api/teacher/units/${unitId}`, {
            method: 'DELETE'
          });
          await get().fetchLessons();
        } catch (e) {
          console.error('Failed to delete unit:', e);
          set((state) => ({ units: state.units.filter((u: any) => u.id !== unitId) }));
        }
      },

      updateModule: async (moduleId, title, description) => {
        try {
          await fetch(`http://localhost:8000/api/teacher/modules/${moduleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
          });
          await get().fetchLessons();
        } catch (e) {
          console.error('Failed to update module:', e);
        }
      },

      deleteModule: async (moduleId) => {
        try {
          await fetch(`http://localhost:8000/api/teacher/modules/${moduleId}`, {
            method: 'DELETE'
          });
          await get().fetchLessons();
        } catch (e) {
          console.error('Failed to delete module:', e);
        }
      },

      addLesson: async (moduleId, lesson) => {
        const { id, moduleId: mId, title, lessonType, contentBlocks, xpReward, orderIndex, ...exerciseData } = lesson as any;
        
        try {
          const res = await fetch('http://localhost:8000/api/teacher/lessons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              module_id: moduleId,
              title,
              lesson_type: lessonType,
              content_blocks: contentBlocks,
              exercise_data: exerciseData,
              xp_reward: xpReward,
              order_index: orderIndex || 99
            })
          });
          if (res.ok) {
            await get().fetchLessons();
          }
        } catch (error) {
          console.error("Failed to add lesson:", error);
        }
      },

      updateLesson: async (lessonId, updatedData) => {
        const currentLesson = get().getLessonById(lessonId);
        if (!currentLesson) return;
        
        const merged = { ...currentLesson, ...updatedData };
        const { id, moduleId, title, lessonType, contentBlocks, xpReward, orderIndex, unitTitle, moduleTitle, unitId, ...exerciseData } = merged as any;

        try {
          const res = await fetch(`http://localhost:8000/api/teacher/lessons/${lessonId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title,
              lesson_type: lessonType,
              content_blocks: contentBlocks,
              exercise_data: exerciseData,
              xp_reward: xpReward,
              order_index: orderIndex
            })
          });
          if (res.ok) {
            await get().fetchLessons();
          }
        } catch (error) {
          console.error("Failed to update lesson:", error);
        }
      },

      deleteLesson: async (lessonId) => {
        try {
          const res = await fetch(`http://localhost:8000/api/teacher/lessons/${lessonId}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            await get().fetchLessons();
          }
        } catch (error) {
          console.error("Failed to delete lesson:", error);
        }
      },

      getAllLessons: () => {
        const all: (Lesson & { unitTitle?: string; moduleTitle?: string; unitId?: string })[] = [];
        get().units.forEach((unit) => {
          unit.modules.forEach((module) => {
            module.lessons.forEach((lesson) => {
              all.push({
                ...lesson,
                unitTitle: unit.title,
                moduleTitle: module.title,
                unitId: unit.id,
              });
            });
          });
        });
        return all;
      },

      getLessonById: (id) => {
        const all = get().getAllLessons();
        if (!id) return undefined;
        // 1. Direct match by UUID
        const directMatch = all.find((l) => l.id === id);
        if (directMatch) return directMatch;
        // 2. Numeric 1-based index (e.g. "1" -> first lesson)
        const num = parseInt(id, 10);
        if (!isNaN(num) && String(num) === String(id) && num >= 1 && num <= all.length) {
          return all[num - 1];
        }
        return undefined;
      },

      getNextLessonId: (currentId) => {
        const all = get().getAllLessons();
        const target = get().getLessonById(currentId);
        if (!target) return null;
        const currentIndex = all.findIndex((l) => l.id === target.id);
        if (currentIndex !== -1 && currentIndex < all.length - 1) {
          return `${currentIndex + 2}`;
        }
        return null;
      },
    }),
    {
      name: 'deepdive-lessons-storage',
    }
  )
);
