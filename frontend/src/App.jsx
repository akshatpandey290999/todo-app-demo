import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch todos
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setTodos(res.data);
    } catch {
      setError("Failed to fetch todos. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  // Add todo
  const addTodo = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(API, { text: input });
      setTodos([...todos, res.data]);
      setInput("");
    } catch {
      setError("Failed to add todo.");
    }
  };

  // Toggle complete
  const toggleTodo = async (todo) => {
    try {
      const res = await axios.put(`${API}/${todo.id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === todo.id ? res.data : t)));
    } catch {
      setError("Failed to update todo.");
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setTodos(todos.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete todo.");
    }
  };

  // Start editing
  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  // Save edit
  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.put(`${API}/${id}`, { text: editText });
      setTodos(todos.map((t) => (t.id === id ? res.data : t)));
      setEditId(null);
      setEditText("");
    } catch {
      setError("Failed to edit todo.");
    }
  };

  // Filter todos
  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="app">
      <div className="card">
        <h1>📝 Todo App</h1>

        {error && (
          <div className="error" onClick={() => setError("")}>
            ⚠️ {error} <span>(click to dismiss)</span>
          </div>
        )}

        {/* Add Todo */}
        <div className="input-row">
          <input
            type="text"
            placeholder="Add a new todo..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button className="btn-add" onClick={addTodo}>
            Add
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="filters">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              className={`btn-filter ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="stats">
          <span>{todos.length} total</span>
          <span>{completedCount} completed</span>
          <span>{todos.length - completedCount} remaining</span>
        </div>

        {/* Todo List */}
        {loading ? (
          <p className="loading">Loading todos...</p>
        ) : filteredTodos.length === 0 ? (
          <p className="empty">No todos found.</p>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.completed ? "done" : ""}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                />

                {editId === todo.id ? (
                  <input
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(todo.id)}
                    autoFocus
                  />
                ) : (
                  <span className="todo-text">{todo.text}</span>
                )}

                <div className="actions">
                  {editId === todo.id ? (
                    <button className="btn-save" onClick={() => saveEdit(todo.id)}>
                      💾 Save
                    </button>
                  ) : (
                    <button className="btn-edit" onClick={() => startEdit(todo)}>
                      ✏️ Edit
                    </button>
                  )}
                  <button className="btn-delete" onClick={() => deleteTodo(todo.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}