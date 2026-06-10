import { useState, useEffect, useMemo } from 'react';
import type { Todo, Filter } from '../types';
import { priority } from '../utils/time';

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

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const stored = loadTodos();
    const timer = setTimeout(() => {
      setTodos(stored);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
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
    setTodos((prev) => [todo, ...prev]);
    return true;
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function editTodo(id: string, text: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: text.trim() } : t))
    );
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed));
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
