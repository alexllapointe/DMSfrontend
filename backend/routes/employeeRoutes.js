const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Search employees by name or ID
router.get('/search', employeeController.searchEmployees);

// Get all employees
router.get('/', employeeController.getAllEmployees);

// Get employee by ID
router.get('/:id', employeeController.getEmployeeById);

// Create a new employee
router.post('/', employeeController.createEmployee);

// Update employee status
router.patch('/:id/status', employeeController.updateEmployeeStatus);

module.exports = router; 