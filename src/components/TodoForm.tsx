import { useState, useRef, useEffect, type FormEvent } from 'react';

interface Props {
  onAdd: (text: string, dueTime: string) => boolean;
}

export function TodoForm({ onAdd }: Props) {
  const [value, setValue] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === 'a') {
        const tag = (e.target as HTMLElement).tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Task cannot be empty');
      return;
    }
    if (!dueTime) {
      setError('Please set a due time');
      return;
    }
    if (!onAdd(trimmed, dueTime)) {
      setError('Already added');
      return;
    }
    setError('');
    setValue('');
    setDueTime('');
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="todo-input-wrap">
        <input
          ref={inputRef}
          className={`todo-input${error ? ' has-error' : ''}`}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError('');
          }}
          placeholder="What needs to be done?"
          autoFocus
        />
        {error && <span className="todo-error">{error}</span>}
      </div>
      <input
        className="todo-time-input"
        type="time"
        value={dueTime}
        onChange={(e) => setDueTime(e.target.value)}
        required
        title="Due time"
      />
      <button className="todo-add-btn" type="submit" disabled={!value.trim() || !dueTime}>
        <svg className="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add
      </button>
    </form>
  );
}
