const { Todo } = require('../db/model');

async function addTodo(todoModel) {
  try {
    // Auto-assign serial number if not provided
    if (!todoModel.serialNo) {
      const lastTodo = await Todo.findOne().sort({ serialNo: -1 });
      todoModel.serialNo = lastTodo ? lastTodo.serialNo + 1 : 1;
    }
    
    const todo = new Todo({ ...todoModel });
    await todo.save();
    return todo.toObject();
  } catch (error) {
    throw new Error(`Failed to add todo: ${error.message}`);
  }
}

async function getTodo() {
  try {
    const todos = await Todo.find().sort({ serialNo: 1 });
    return todos.map(todo => todo.toObject());
  } catch (error) {
    throw new Error(`Failed to get todos: ${error.message}`);
  }
}

async function getTodoId(id) {
  try {
    const todoID = await Todo.findById(id);
    if (!todoID) {
      throw new Error('Todo not found');
    }
    return todoID.toObject();
  } catch (error) {
    throw new Error(`Failed to get todo: ${error.message}`);
  }
}

async function getTodoUpdate(id, todoModel) {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(id, todoModel, { new: true, runValidators: true });
    if (!updatedTodo) {
      throw new Error('Todo not found');
    }
    return updatedTodo.toObject();
  } catch (error) {
    throw new Error(`Failed to update todo: ${error.message}`);
  }
}

async function getTodoDelete(id) {
  try {
    console.log(`Deleting todo with ID: ${id}`);
    
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      throw new Error('Todo not found');
    }
    
    console.log(`Deleted todo with serial number: ${deletedTodo.serialNo}`);
    
    // Reorder serial numbers after deletion
    await reorderSerialNumbers();
    
    return { message: 'Todo deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete todo: ${error.message}`);
  }
}

// Reorder serial numbers after deletion
async function reorderSerialNumbers() {
  try {
    // Get all todos sorted by their current serial number to maintain order
    const todos = await Todo.find().sort({ serialNo: 1 });
    console.log(`Reordering ${todos.length} todos after deletion`);
    
    // Use bulk operations for better performance
    const bulkOps = todos.map((todo, index) => ({
      updateOne: {
        filter: { _id: todo._id },
        update: { serialNo: index + 1 }
      }
    }));
    
    if (bulkOps.length > 0) {
      await Todo.bulkWrite(bulkOps);
      console.log(`Successfully reordered ${bulkOps.length} todos`);
    }
    
    console.log('Serial number reordering completed');
  } catch (error) {
    console.error('Error in reorderSerialNumbers:', error);
    // Don't throw the error to avoid affecting the main deletion operation
  }
}

// Bulk operations for adding/removing columns
async function updateAllTodosWithNewColumn(columnField) {
  try {
    const updateQuery = { $set: { [columnField]: null } };
    await Todo.updateMany({}, updateQuery);
    return await getTodo();
  } catch (error) {
    throw new Error(`Failed to add column to all todos: ${error.message}`);
  }
}

async function removeColumnFromAllTodos(columnField) {
  try {
    const updateQuery = { $unset: { [columnField]: "" } };
    await Todo.updateMany({}, updateQuery);
    return await getTodo();
  } catch (error) {
    throw new Error(`Failed to remove column from all todos: ${error.message}`);
  }
}

module.exports = { 
  addTodo, 
  getTodo, 
  getTodoId, 
  getTodoUpdate, 
  getTodoDelete,
  updateAllTodosWithNewColumn,
  removeColumnFromAllTodos
};
