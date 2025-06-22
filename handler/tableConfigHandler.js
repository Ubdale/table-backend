const { TableConfig, Todo } = require('../db/model');

async function getTableConfig() {
  try {
    let config = await TableConfig.findOne().sort({ createdAt: -1 });
    if (!config) {
      // Create default config with just S.No column
      config = new TableConfig({
        name: 'Default Table',
        columns: [
          { title: 'S.No', field: 'serialNo', order: 0, width: 80, editable: false }
        ]
      });
      await config.save();
      
      // Create default todo row with S.No = 1
      const defaultTodo = new Todo({
        serialNo: 1,
        title: '',
        name: '',
        email: '',
        age: null,
        address: '',
        password: '',
        completed: false
      });
      await defaultTodo.save();
    }
    return config.toObject();
  } catch (error) {
    throw new Error(`Failed to get table config: ${error.message}`);
  }
}

async function saveTableConfig(configData) {
  try {
    let config;
    if (configData._id) {
      config = await TableConfig.findByIdAndUpdate(configData._id, configData, { new: true, runValidators: true });
    } else {
      config = new TableConfig(configData);
      await config.save();
    }
    return config.toObject();
  } catch (error) {
    throw new Error(`Failed to save table config: ${error.message}`);
  }
}

async function updateTableConfig(id, configData) {
  try {
    const config = await TableConfig.findByIdAndUpdate(id, configData, { new: true, runValidators: true });
    if (!config) {
      throw new Error('Table config not found');
    }
    return config.toObject();
  } catch (error) {
    throw new Error(`Failed to update table config: ${error.message}`);
  }
}

async function deleteTableConfig(id) {
  try {
    const config = await TableConfig.findByIdAndDelete(id);
    if (!config) {
      throw new Error('Table config not found');
    }
    return { message: 'Table config deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete table config: ${error.message}`);
  }
}

async function addColumn(columnData) {
  try {
    console.log('Adding column:', columnData);
    
    // Use findOneAndUpdate with upsert to ensure atomicity
    let config = await TableConfig.findOneAndUpdate(
      {}, // Find any config
      {}, // No update needed for finding
      { 
        sort: { createdAt: -1 },
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        default: {
          name: 'Default Table',
          columns: []
        }
      }
    );
    
    // Check if column with same field already exists
    const existingColumn = config.columns.find(col => col.field === columnData.field);
    if (existingColumn) {
      throw new Error(`Column with field '${columnData.field}' already exists`);
    }
    
    // Set order if not provided
    if (columnData.order === undefined) {
      columnData.order = config.columns.length;
    }
    
    // Ensure S.No column is always first
    if (columnData.field === 'serialNo') {
      columnData.order = 0;
      // Shift other columns
      config.columns.forEach(col => {
        if (col.order >= 0) col.order += 1;
      });
    }
    
    // Add the new column
    config.columns.push(columnData);
    
    // Save the config
    await config.save();
    
    console.log('Column added successfully:', columnData);
    return config.toObject();
  } catch (error) {
    console.error('Error in addColumn:', error);
    throw new Error(`Failed to add column: ${error.message}`);
  }
}

async function updateColumn(columnId, columnData) {
  try {
    console.log('Updating column:', columnId, 'with data:', columnData);
    
    const config = await TableConfig.findOne({ 'columns._id': columnId });
    if (!config) {
      throw new Error('Column not found');
    }
    
    const columnIndex = config.columns.findIndex(col => col._id.toString() === columnId);
    if (columnIndex === -1) {
      throw new Error('Column not found in config');
    }
    
    // Update only the specified fields while preserving existing structure
    const updatedColumn = { ...config.columns[columnIndex].toObject(), ...columnData };
    config.columns[columnIndex] = updatedColumn;
    
    await config.save();
    console.log('Column updated successfully:', updatedColumn);
    
    return config.toObject();
  } catch (error) {
    console.error('Error in updateColumn:', error);
    throw new Error(`Failed to update column: ${error.message}`);
  }
}

async function deleteColumn(columnId) {
  try {
    // Find the column to check if it's S.No
    const config = await TableConfig.findOne({ 'columns._id': columnId });
    if (!config) {
      throw new Error('Column not found');
    }
    
    const columnToDelete = config.columns.find(col => col._id.toString() === columnId);
    if (columnToDelete && columnToDelete.field === 'serialNo') {
      throw new Error('Cannot delete S.No column');
    }
    
    const updatedConfig = await TableConfig.findOneAndUpdate(
      { 'columns._id': columnId },
      { $pull: { columns: { _id: columnId } } },
      { new: true }
    );
    
    return updatedConfig.toObject();
  } catch (error) {
    throw new Error(`Failed to delete column: ${error.message}`);
  }
}

module.exports = {
  getTableConfig,
  saveTableConfig,
  updateTableConfig,
  deleteTableConfig,
  addColumn,
  updateColumn,
  deleteColumn
}; 