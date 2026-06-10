export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dueTime: string | null;
}

export type Filter = 'all' | 'active' | 'completed';
