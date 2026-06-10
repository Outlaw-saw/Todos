import { useTodos } from './hooks/useTodos';
import { useTheme } from './hooks/useTheme';
import { TodoForm } from './components/TodoForm';
import { TodoItem } from './components/TodoItem';
import './App.css';

function App() {
  const { theme, toggleTheme } = useTheme();
  const {
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
  } = useTodos();

  return (
    <div className="app">
      <div className="app-header">
        <h1 className="title">todos</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '\u263E' : '\u2600'}
        </button>
      </div>
      <div className="todo-card">
        <TodoForm onAdd={addTodo} />
        {loading ? (
          <div className="loading-state">
            <div className="skeleton-row" />
            <div className="skeleton-row" />
            <div className="skeleton-row" />
          </div>
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <svg className="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="8" y1="9" x2="16" y2="9" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="12" y2="17" />
            </svg>
            <p className="empty-title">No todos yet</p>
            <p className="empty-hint">Add one above to get started</p>
          </div>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onEdit={editTodo}
                onDelete={deleteTodo}
              />
            ))}
          </ul>
        )}
        <div className="todo-filters">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              className={`todo-filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="todo-footer">
          <span className="todo-count">
            {activeCount} {activeCount === 1 ? 'item' : 'items'} left
          </span>
          {completedCount > 0 && (
            <button className="clear-btn" onClick={clearCompleted}>
              Clear completed ({completedCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
