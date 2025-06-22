const express = require("express");
const router = express.Router();
const {
  getTableConfig,
  saveTableConfig,
  updateTableConfig,
  deleteTableConfig,
  addColumn,
  updateColumn,
  deleteColumn
} = require("../handler/tableConfigHandler");
const { validateTableConfig, validateColumn, validatePartialColumn } = require("../middleware/validation");

// Table configuration operations
router.get("/table-config", async (req, res) => {
  try {
    const config = await getTableConfig();
    res.json(config);
  } catch (err) {
    console.error('Error getting table config:', err);
    res.status(500).json({ error: err.message || 'Failed to get table config' });
  }
});

router.post("/table-config", validateTableConfig, async (req, res) => {
  try {
    const config = await saveTableConfig(req.body);
    res.status(201).json(config);
  } catch (err) {
    console.error('Error saving table config:', err);
    res.status(500).json({ error: err.message || 'Failed to save table config' });
  }
});

router.put("/table-config/:id", validateTableConfig, async (req, res) => {
  try {
    const config = await updateTableConfig(req.params.id, req.body);
    res.json(config);
  } catch (err) {
    console.error('Error updating table config:', err);
    res.status(500).json({ error: err.message || 'Failed to update table config' });
  }
});

router.patch("/table-config/:id", validateTableConfig, async (req, res) => {
  try {
    const config = await updateTableConfig(req.params.id, req.body);
    res.json(config);
  } catch (err) {
    console.error('Error updating table config:', err);
    res.status(500).json({ error: err.message || 'Failed to update table config' });
  }
});

router.delete("/table-config/:id", async (req, res) => {
  try {
    const result = await deleteTableConfig(req.params.id);
    res.json(result);
  } catch (err) {
    console.error('Error deleting table config:', err);
    res.status(500).json({ error: err.message || 'Failed to delete table config' });
  }
});

// Column operations
router.post("/table-config/columns", validateColumn, async (req, res) => {
  try {
    const config = await addColumn(req.body);
    res.status(201).json(config);
  } catch (err) {
    console.error('Error adding column:', err);
    res.status(500).json({ error: err.message || 'Failed to add column' });
  }
});

router.put("/table-config/columns/:columnId", validatePartialColumn, async (req, res) => {
  try {
    const config = await updateColumn(req.params.columnId, req.body);
    res.json(config);
  } catch (err) {
    console.error('Error updating column:', err);
    res.status(500).json({ error: err.message || 'Failed to update column' });
  }
});

router.delete("/table-config/columns/:columnId", async (req, res) => {
  try {
    const config = await deleteColumn(req.params.columnId);
    res.json(config);
  } catch (err) {
    console.error('Error deleting column:', err);
    res.status(500).json({ error: err.message || 'Failed to delete column' });
  }
});

module.exports = router; 