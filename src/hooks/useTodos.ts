import { useState, useEffect, useMemo } from 'react';
import type { Todo, Filter } from '../types';
import { priority } from '../utils/time';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function sortByDue(list: Todo[], now: number): Todo[] {
  return [...list].sort((a, b) => {
    const pa = priority(a.dueTime, a.completed, now);
    const pb = priority(b.dueTime, b.completed, now);
    if (pa !== pb) return pa - pb;
    if (a.dueTime && b.dueTime) return a.dueTime.localeCompare(b.dueTime);
    if (a.dueTime) return -1;
    if (b.dueTime) return 1;
    return 0;
  });
}

interface ApiTodo {
  id: number;
  title: string;
  completed: boolean;
  due_time: string | null;
  created_at: string;
}

async function fetchAll(): Promise<Todo[]> {
  const res = await fetch(`${BASE_URL}/todos`);
  const data: ApiTodo[] = await res.json();
  return data.map((item) => ({
    id: String(item.id),
    text: item.title,
    completed: item.completed,
    createdAt: Date.parse(item.created_at),
    dueTime: item.due_time ?? null,
  }));
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    fetchAll()
      .then(setTodos)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  async function refresh() {
    setTodos(await fetchAll());
  }

  async function addTodo(text: string, dueTime: string): Promise<boolean> {
    const trimmed = text.trim();
    if (todos.some((t) => t.text.toLowerCase() === trimmed.toLowerCase())) {
      return false;
    }
    await fetch(`${BASE_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: trimmed, completed: false, due_time: dueTime }),
    });
    await refresh();
    return true;
  }

  async function toggleTodo(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    await fetch(`${BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    await refresh();
  }

  async function editTodo(id: string, text: string) {
    await fetch(`${BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: text.trim() }),
    });
    await refresh();
  }

  async function deleteTodo(id: string) {
    await fetch(`${BASE_URL}/todos/${id}`, { method: 'DELETE' });
    await refresh();
  }

  async function clearCompleted() {
    await Promise.all(
      todos
        .filter((t) => t.completed)
        .map((t) => fetch(`${BASE_URL}/todos/${t.id}`, { method: 'DELETE' }))
    );
    await refresh();
  }

  const sortedTodos = useMemo(() => sortByDue(todos, now), [todos, now]);

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.length - activeCount;

  const filteredTodos = sortedTodos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return {
    loading,
    now,
    todos,
    filteredTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    clearCompleted,
    activeCount,
    completedCount,
  };
}
