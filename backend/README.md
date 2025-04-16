# Delivery Management System - Backend

This is the backend server for the Delivery Management System. It provides APIs for managing employees, deliveries, and other related functionality.

## Features

- Employee search by name or ID
- Employee management (create, update, get)
- Delivery management
- Real-time status updates

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/delivery-management-system
NODE_ENV=development
```

## Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## API Endpoints

### Employees

- `GET /api/employees/search?query=searchterm` - Search employees by name or ID
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create a new employee
- `PATCH /api/employees/:id/status` - Update employee status

### Deliveries

- `GET /api/deliveries` - Get all deliveries
- `GET /api/deliveries/:id` - Get delivery by ID
- `POST /api/deliveries` - Create a new delivery
- `PATCH /api/deliveries/:id/status` - Update delivery status

## Database Schema

### Employee

```javascript
{
  name: String,
  email: String,
  employeeId: String,
  role: String,
  status: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  assignedDeliveries: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Delivery

```javascript
{
  trackingNumber: String,
  status: String,
  customer: {
    name: String,
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    }
  },
  assignedTo: ObjectId,
  estimatedDeliveryDate: Date,
  actualDeliveryDate: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
``` 