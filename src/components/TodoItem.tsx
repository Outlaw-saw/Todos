import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import type { Todo } from '../types';
import { isOverdue, isDueSoon } from '../utils/time';

interface Props {
  todo: Todo;
  now: number;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, now, onToggle, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = editValue.trim();
    if (!trimmed) {
      onDelete(todo.id);
      return;
    }
    if (trimmed !== todo.text) onEdit(todo.id, trimmed);
    setEditing(false);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      setEditValue(todo.text);
      setEditing(false);
    }
  }

  function handleBlur() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== todo.text) onEdit(todo.id, trimmed);
    setEditing(false);
  }

  const overdue = isOverdue(todo.dueTime, todo.completed, now);
  const dueSoon = !overdue && isDueSoon(todo.dueTime, todo.completed, now);

  function formatDue(due: string) {
    const [h, m] = due.split(':');
    const hour = Number(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  }

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}${overdue ? ' overdue' : ''}${dueSoon ? ' due-soon' : ''}`}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      {editing ? (
        <form className="todo-edit-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="todo-edit-input"
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <div className="todo-content">
          <span
            className="todo-text"
            onDoubleClick={() => {
              setEditValue(todo.text);
              setEditing(true);
            }}
          >
            {todo.text}
          </span>
          {todo.dueTime && (
            <span className={`todo-due${overdue ? ' overdue-badge' : ''}${dueSoon ? ' due-soon-badge' : ''}`}>
              <svg className="due-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {overdue ? 'OVERDUE' : dueSoon ? 'DUE SOON' : formatDue(todo.dueTime)}
            </span>
          )}
        </div>
      )}
      <button
        className="todo-delete-btn"
        onClick={() => onDelete(todo.id)}
        title="Delete todo"
      >
        ×
      </button>
    </li>
  );
}
