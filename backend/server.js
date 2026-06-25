const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory store
let todos = [
  { id: 1, text: "Buy groceries", completed: false },
  { id: 2, text: "Read a book", completed: false },
  { id: 3, text: "Go for a walk", completed: true },
];
let nextId = 4;

// GET all todos
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// POST create todo
app.post("/api/todos", (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Todo text is required" });
  }
  const newTodo = { id: nextId++, text: text.trim(), completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT update todo (toggle complete or edit text)
app.put("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ error: "Todo not found" });

  const { text, completed } = req.body;
  if (text !== undefined) todo.text = text.trim();
  if (completed !== undefined) todo.completed = completed;

  res.json(todo);
});

// DELETE todo
app.delete("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Todo not found" });

  todos.splice(index, 1);
  res.json({ message: "Todo deleted" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});