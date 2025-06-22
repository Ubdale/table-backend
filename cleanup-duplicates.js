const mongoose = require('mongoose');
const { TableConfig } = require('./db/model');

async function cleanupDuplicateColumns() {
  try {
    await mongoose.connect('mongodb://localhost:27017/todo-app');
    console.log('Connected to MongoDB');
    
    const config = await TableConfig.findOne().sort({ createdAt: -1 });
    if (!config) {
      console.log('No table config found');
      return;
    }
    
    console.log('Current columns:', config.columns.map(col => ({ title: col.title, field: col.field })));
    
    // Remove duplicate columns (keep only the first occurrence of each field)
    const uniqueColumns = [];
    const seenFields = new Set();
    
    for (const column of config.columns) {
      if (!seenFields.has(column.field)) {
        seenFields.add(column.field);
        uniqueColumns.push(column);
      } else {
        console.log(`Removing duplicate column: ${column.title} (${column.field})`);
      }
    }
    
    if (uniqueColumns.length !== config.columns.length) {
      config.columns = uniqueColumns;
      await config.save();
      console.log(`Cleaned up ${config.columns.length - uniqueColumns.length} duplicate columns`);
      console.log('Remaining columns:', uniqueColumns.map(col => ({ title: col.title, field: col.field })));
    } else {
      console.log('No duplicate columns found');
    }
    
  } catch (error) {
    console.error('Error cleaning up duplicates:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

cleanupDuplicateColumns(); 