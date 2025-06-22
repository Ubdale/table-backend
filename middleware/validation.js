const validateTodo = (req, res, next) => {
    console.log('=== VALIDATING TODO ===');
    console.log('validateTodo request body:', JSON.stringify(req.body, null, 2));
    const { title, name, email, password } = req.body;
    
    // Only validate email format if provided
    if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Validation failed: Invalid email format');
            return res.status(400).json({ 
                error: 'Invalid email format' 
            });
        }
    }
    
    // Age validation if provided
    if (req.body.age !== undefined && req.body.age !== null) {
        if (typeof req.body.age !== 'number' || req.body.age < 0 || req.body.age > 150) {
            console.log('Validation failed: Age must be a number between 0 and 150');
            return res.status(400).json({ 
                error: 'Age must be a number between 0 and 150' 
            });
        }
    }
    
    // Serial number validation if provided
    if (req.body.serialNo !== undefined && req.body.serialNo !== null) {
        if (typeof req.body.serialNo !== 'number' || req.body.serialNo < 1) {
            console.log('Validation failed: Serial number must be a positive number');
            return res.status(400).json({ 
                error: 'Serial number must be a positive number' 
            });
        }
    }
    
    console.log('Validation passed');
    next();
};

const validateTableConfig = (req, res, next) => {
    const { name, columns } = req.body;
    
    if (!name) {
        return res.status(400).json({ 
            error: 'Table name is required' 
        });
    }
    
    if (columns && !Array.isArray(columns)) {
        return res.status(400).json({ 
            error: 'Columns must be an array' 
        });
    }
    
    if (columns) {
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (!column.title || !column.field) {
                return res.status(400).json({ 
                    error: `Column ${i + 1} must have both title and field properties` 
                });
            }
        }
    }
    
    next();
};

const validateColumn = (req, res, next) => {
    const { title, field } = req.body;
    
    if (!title || !field) {
        return res.status(400).json({ 
            error: 'Column title and field are required' 
        });
    }
    
    // Field name validation (should be a valid JavaScript property name)
    const fieldRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
    if (!fieldRegex.test(field)) {
        return res.status(400).json({ 
            error: 'Field name must be a valid JavaScript property name' 
        });
    }
    
    next();
};

module.exports = {
    validateTodo,
    validateTableConfig,
    validateColumn
}; 