const express = require("express");
const router = express.Router();
const {
  addTodo,
  getTodo,
  getTodoId,
  getTodoUpdate,
  getTodoDelete,
  updateAllTodosWithNewColumn,
  removeColumnFromAllTodos
} = require("../handler/todoHandler");

router.post("/todo", async (req, res) => {
  try {
    const todo = await addTodo(req.body);
    res.status(201).json(todo); 
  } catch (err) {
    console.error('Error adding todo:', err);
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

router.get("/todo", async (req, res) => {
  try {
    let todos = await getTodo();
    res.json(todos);
  } catch (err) {
    console.error('Error getting todos:', err);
    res.status(500).json({ error: 'Failed to get todos' });
  }
});


router.get("/todo/:id", async (req, res) => {
  try {
    console.log("id", req.params["id"]);
    let todos = await getTodoId(req.params["id"]);
    res.json(todos);
  } catch (err) {
    console.error('Error getting todo by id:', err);
    res.status(500).json({ error: 'Failed to get todo' });
  }
});

router.put("/todo/:id", async (req, res) => {
  try {
    console.log("id", req.params["id"]);
    const updatedTodo = await getTodoUpdate(req.params["id"], req.body);
    res.json(updatedTodo);
  } catch (err) {
    console.error('Error updating todo:', err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

router.delete("/todo/:id", async (req, res) => {
  try {
    console.log("Deleting todo with id:", req.params["id"]);
    const result = await getTodoDelete(req.params["id"]);
    console.log("Delete operation completed successfully:", result);
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Bulk operations for adding/removing columns
router.patch("/todo/add-column", async (req, res) => {
  try {
    const { columnField } = req.body;
    if (!columnField) {
      return res.status(400).json({ error: 'Column field is required' });
    }
    const updatedTodos = await updateAllTodosWithNewColumn(columnField);
    res.json(updatedTodos);
  } catch (err) {
    console.error('Error adding column to todos:', err);
    res.status(500).json({ error: 'Failed to add column to todos' });
  }
});

router.patch("/todo/remove-column", async (req, res) => {
  try {
    const { columnField } = req.body;
    if (!columnField) {
      return res.status(400).json({ error: 'Column field is required' });
    }
    const updatedTodos = await removeColumnFromAllTodos(columnField);
    res.json(updatedTodos);
  } catch (err) {
    console.error('Error removing column from todos:', err);
    res.status(500).json({ error: 'Failed to remove column from todos' });
  }
});

module.exports = router;
