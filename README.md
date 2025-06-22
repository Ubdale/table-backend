# Todo Backend API

A RESTful API for managing todos and table configurations, built with Node.js, Express, and MongoDB.

## Features

- CRUD operations for todos
- Dynamic table configuration management
- Column management for todos
- Bulk operations for adding/removing columns
- Data validation
- Error handling
- CORS support
- **Default single row with S.No column**

## Default Structure

The application starts with:
- **One default row** with S.No = 1
- **One default column**: S.No (Serial Number)
- All other fields are empty and can be filled as needed
- Users can add/delete columns and rows dynamically

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /` - API health check and documentation

### Todo Operations

#### Get All Todos
- `GET /todo`
- Returns all todos sorted by serial number

#### Create Todo
- `POST /todo`
- Body: `{ serialNo?, title?, name?, email?, age?, address?, password?, completed? }`
- Serial number is auto-assigned if not provided

#### Get Todo by ID
- `GET /todo/:id`
- Returns a specific todo by ID

#### Update Todo
- `PUT /todo/:id`
- Body: `{ serialNo?, title?, name?, email?, age?, address?, password?, completed? }`

#### Delete Todo
- `DELETE /todo/:id`
- Deletes a todo by ID and reorders remaining serial numbers

#### Bulk Operations

##### Add Column to All Todos
- `PATCH /todo/add-column`
- Body: `{ columnField: "string" }`
- Adds a new column to all existing todos

##### Remove Column from All Todos
- `PATCH /todo/remove-column`
- Body: `{ columnField: "string" }`
- Removes a column from all todos

### Table Configuration Operations

#### Get Table Configuration
- `GET /table-config`
- Returns the current table configuration (creates default with S.No if none exists)

#### Save Table Configuration
- `POST /table-config`
- Body: `{ name, columns: [{ title, field, order?, width?, editable? }] }`

#### Update Table Configuration
- `PUT /table-config/:id` or `PATCH /table-config/:id`
- Body: `{ name?, columns? }`

#### Delete Table Configuration
- `DELETE /table-config/:id`

#### Column Management

##### Add Column
- `POST /table-config/columns`
- Body: `{ title, field, order?, width?, editable? }`
- S.No column is automatically placed first

##### Update Column
- `PUT /table-config/columns/:columnId`
- Body: `{ title?, field?, order?, width?, editable? }`

##### Delete Column
- `DELETE /table-config/columns/:columnId`
- Cannot delete S.No column

## Data Models

### Todo Schema
```javascript
{
  serialNo: Number (required, auto-assigned),
  title: String (default: ''),
  name: String (default: ''),
  email: String (default: ''),
  age: Number (default: null),
  address: String (default: ''),
  password: String (default: ''),
  completed: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Table Configuration Schema
```javascript
{
  name: String (required),
  columns: [{
    title: String (required),
    field: String (required),
    order: Number (default: 0),
    width: Number (default: 100),
    editable: Boolean (default: true)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## Default Configuration

When the application starts for the first time, it creates:

### Default Table Configuration
```javascript
{
  name: 'Default Table',
  columns: [
    { title: 'S.No', field: 'serialNo', order: 0, width: 80, editable: false }
  ]
}
```

### Default Todo Row
```javascript
{
  serialNo: 1,
  title: '',
  name: '',
  email: '',
  age: null,
  address: '',
  password: '',
  completed: false
}
```

## Validation

The API includes validation for:
- Email format validation (if provided)
- Age range validation (0-150, if provided)
- Serial number validation (positive number, if provided)
- Field name validation for columns
- Data type validation

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a descriptive message:
```json
{
  "error": "Error description"
}
```

## Special Features

### Serial Number Management
- Auto-assigned when creating new todos
- Reordered automatically when todos are deleted
- S.No column cannot be deleted
- S.No column is always displayed first

### Column Management
- S.No column is protected from deletion
- New columns are added after existing ones
- Column order is maintained

## CORS

The API is configured to accept requests from any origin for development purposes.

## Database

The application uses MongoDB with the database name `todo-data`. Make sure MongoDB is running on `localhost:27017` before starting the server.

## Development

The project uses nodemon for development, which automatically restarts the server when files change.

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests (not implemented yet) 