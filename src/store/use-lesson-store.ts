import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { units as defaultUnits } from '@/data/lessons';
import { Unit, Lesson } from '@/types';

interface LessonStore {
  units: Unit[];
  
  // Actions
  fetchLessons: () => Promise<void>;
  addUnit: (title: string, description: string) => string;
  updateUnit: (unitId: string, title: string, description: string) => void;
  deleteUnit: (unitId: string) => void;
  addModule: (unitId: string, title: string, description: string) => string;
  updateModule: (moduleId: string, title: string, description: string) => void;
  deleteModule: (moduleId: string) => void;
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
            set({ units: transformedUnits });
          }
        } catch (error) {
          console.error("Failed to fetch lessons:", error);
        }
      },

      addUnit: (title, description) => {
        const newId = `unit-${Date.now()}`;
        set((state) => {
          const newUnits = JSON.parse(JSON.stringify(state.units));
          newUnits.push({ id: newId, title, description, modules: [] });
          return { units: newUnits };
        });
        return newId;
      },

      addModule: (unitId, title, description) => {
        const newId = `module-${Date.now()}`;
        set((state) => {
          const newUnits = JSON.parse(JSON.stringify(state.units));
          const unit = newUnits.find((u: any) => u.id === unitId);
          if (unit) unit.modules.push({ id: newId, title, description, lessons: [] });
          return { units: newUnits };
        });
        return newId;
      },

      updateUnit: (unitId, title, description) => set((state) => {
        const newUnits = JSON.parse(JSON.stringify(state.units));
        const unit = newUnits.find((u: any) => u.id === unitId);
        if (unit) { unit.title = title; unit.description = description; }
        return { units: newUnits };
      }),

      deleteUnit: (unitId) => set((state) => ({ units: state.units.filter((u: any) => u.id !== unitId) })),

      updateModule: (moduleId, title, description) => set((state) => {
        const newUnits = JSON.parse(JSON.stringify(state.units));
        for (const unit of newUnits) {
          const mod = unit.modules.find((m: any) => m.id === moduleId);
          if (mod) { mod.title = title; mod.description = description; break; }
        }
        return { units: newUnits };
      }),

      deleteModule: (moduleId) => set((state) => {
        const newUnits = JSON.parse(JSON.stringify(state.units));
        for (const unit of newUnits) unit.modules = unit.modules.filter((m: any) => m.id !== moduleId);
        return { units: newUnits };
      }),

      addLesson: async (moduleId, lesson) => {
        // Extract base fields and group the rest into exercise_data
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
            await get().fetchLessons(); // Refresh from backend
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
          // If it's a mock lesson ID, don't call backend
          if (!lessonId.includes('-')) {
             // local delete logic skipped for brevity, handle if needed
          }
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
