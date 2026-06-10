import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/TodoForm';
import { TodoItem } from './components/TodoItem';
import './App.css';

function App() {
  const {
    todos,
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
      <h1 className="title">todos</h1>
      <div className="todo-card">
        <TodoForm onAdd={addTodo} />
        {todos.length === 0 ? (
          <p className="empty-msg">No todos yet. Add one above!</p>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
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
