import { create } from 'zustand';

// ------------------------------------
// 1. TİP TANIMLAMALARI (Types) - PRISMA UYUMLU
// ------------------------------------

// Görev Durumları (Prisma schema ile tam uyumlu olmalı)
export type Status = 'TOTAL' | 'COMPLETED' | 'IN_PROGRESS' | 'CANCELLED' | 'BEKLEYEN';
// Görev Öncelikleri (Prisma schema ile tam uyumlu olmalı)
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

// Todo (Görev) Modelinin tipi
export interface Todo {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  dueDate: string | null;
}

// Store'un (Deponun) Tutacağı Veri (State) Tipi
interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

// Store'un İçereceği Aksiyonlar (Action) Tipi
interface TodoActions {
  fetchTodos: () => Promise<void>;
  addTodo: (newTodo: { title: string; description?: string; priority?: Priority; status?: Status }) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

// Toplam Store Tipi
type TodoStore = TodoState & TodoActions;


// ------------------------------------
// 2. ZUSTAND STORE TANIMI
// ------------------------------------

export const useTodoStore = create<TodoStore>((set, get) => ({
  // * STATE (Veriler)
  todos: [],
  loading: false,
  error: null,

  // * ACTIONS (Aksiyonlar / API Çağrıları)

  // A. GÖREVLERİ ÇEKME (READ)
  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error(`API hatası: ${response.status}`);
      }
      const data: Todo[] = await response.json();
      
      // Zustand state'i güncelleniyor
      set({ todos: data, loading: false });

    } catch (err: any) {
      set({ error: `Görevler çekilemedi: ${err.message}`, loading: false });
    }
  },

  // B. GÖREV EKLEME (CREATE)
  addTodo: async (newTodo) => {
    set({ loading: true, error: null });
    // Yeni görev eklenirken status verilmemişse BEKLEYEN olarak ayarla (Prisma'daki default ile uyumlu olmalı)
    const payload = { 
        ...newTodo, 
        status: newTodo.status || 'BEKLEYEN' 
    };

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API hatası: ${response.status}`);
      }
      const createdTodo: Todo = await response.json();

      // State'i hemen güncelle: Yeni görevi listenin başına ekle
      set((state) => ({ 
          todos: [createdTodo, ...state.todos], 
          loading: false 
      }));

    } catch (err: any) {
      set({ error: `Görev eklenemedi: ${err.message}`, loading: false });
    }
  },

  // C. GÖREV GÜNCELLEME (UPDATE)
  updateTodo: async (id, updates) => {
    // Optimistik güncelleme (Hata durumunda geri alınabilir)
    const originalTodos = get().todos; 
    
    // UI'da hemen güncelleme yap
    set((state) => ({
        todos: state.todos.map(todo => 
            todo.id === id ? { ...todo, ...updates } : todo
        ),
        error: null,
    }));

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`API hatası: ${response.status}`);
      }
      // Başarılı olduğunda state zaten güncel (Optimistik)
      set({ loading: false });

    } catch (err: any) {
      // Hata durumunda state'i eski haline geri al (Rollback)
      set({ 
          todos: originalTodos, 
          error: `Görev güncellenemedi: ${err.message}`, 
          loading: false 
      });
    }
  },

  // D. GÖREV SİLME (DELETE)
  deleteTodo: async (id) => {
    // Optimistik silme (UI'da hemen kaldır)
    const originalTodos = get().todos;
    
    set((state) => ({
      todos: state.todos.filter(todo => todo.id !== id),
      error: null,
    }));

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`API hatası: ${response.status}`);
      }
      // Başarılı olduğunda state zaten güncel (Optimistik)
      set({ loading: false });

    } catch (err: any) {
      // Hata durumunda state'i eski haline geri al (Rollback)
      set({ 
          todos: originalTodos, 
          error: `Görev silinemedi: ${err.message}`, 
          loading: false 
      });
    }
  },
}));
