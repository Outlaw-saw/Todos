import { useState, useRef, useEffect, type FormEvent } from 'react';
import type { Todo } from '../types';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: Props) {
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

  function handleBlur() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== todo.text) onEdit(todo.id, trimmed);
    setEditing(false);
  }

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
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
          />
        </form>
      ) : (
        <span
          className="todo-text"
          onDoubleClick={() => {
            setEditValue(todo.text);
            setEditing(true);
          }}
        >
          {todo.text}
        </span>
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
