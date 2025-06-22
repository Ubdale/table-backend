const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  serialNo: { type: Number, required: true },
  title: { type: String, default: '' },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  age: { type: Number, default: null },
  address: { type: String, default: '' },
  password: { type: String, default: '' },
  completed: { type: Boolean, default: false }
}, {
  timestamps: true,
  strict: false
});

const columnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  field: { type: String, required: true },
  order: { type: Number, default: 0 },
  width: { type: Number, default: 100 },
  editable: { type: Boolean, default: true }
});

const tableConfigSchema = new mongoose.Schema({
  name: { type: String, required: true },
  columns: [columnSchema]
}, {
  timestamps: true
});

const Todo = mongoose.model('Todo', todoSchema);
const TableConfig = mongoose.model('TableConfig', tableConfigSchema);

module.exports = { Todo, TableConfig };