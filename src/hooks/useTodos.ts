import { useState, useEffect } from 'react';
import type { Todo, Filter } from '../types';

const STORAGE_KEY = 'todos';

function loadTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // localStorage unavailable
  }
  return [];
}

function saveTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function priority(t: Todo): number {
  if (!t.dueTime || t.completed) return 2;
  const now = Date.now();
  const [h, m] = t.dueTime.split(':').map(Number);
  const d = new Date(now);
  const due = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m);
  if (due.getTime() <= now) due.setDate(due.getDate() + 1);
  const diff = due.getTime() - now;
  if (diff <= 0) return 0;
  if (diff <= 3600000) return 1;
  return 2;
}

function sortByDue(list: Todo[]): Todo[] {
  return [...list].sort((a, b) => {
    const pa = priority(a);
    const pb = priority(b);
    if (pa !== pb) return pa - pb;
    if (a.dueTime && b.dueTime) return a.dueTime.localeCompare(b.dueTime);
    if (a.dueTime) return -1;
    if (b.dueTime) return 1;
    return 0;
  });
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    const stored = loadTodos();
    const timer = setTimeout(() => {
      setTodos(stored);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) saveTodos(todos);
  }, [todos, loading]);

  function addTodo(text: string, dueTime: string): boolean {
    const trimmed = text.trim();
    if (todos.some((t) => t.text.toLowerCase() === trimmed.toLowerCase())) {
      return false;
    }
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
      dueTime,
    };
    setTodos((prev) => sortByDue([todo, ...prev]));
    return true;
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      sortByDue(prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
    );
  }

  function editTodo(id: string, text: string) {
    setTodos((prev) =>
      sortByDue(prev.map((t) => (t.id === id ? { ...t, text: text.trim() } : t)))
    );
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTodos((prev) => sortByDue(prev.filter((t) => !t.completed)));
  }

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.length - activeCount;

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return {
    loading,
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
