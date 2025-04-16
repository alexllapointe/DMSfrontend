const Employee = require('../models/Employee');
const Delivery = require('../models/Delivery');

// Search employees by name or ID
exports.searchEmployees = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Create a regex pattern for case-insensitive search
    const searchRegex = new RegExp(query, 'i');
    
    // Find employees by name or employeeId
    const employees = await Employee.find({
      $or: [
        { name: searchRegex },
        { employeeId: searchRegex }
      ]
    }).select('name email employeeId status role');

    // Get assigned deliveries for each employee
    const employeesWithDeliveries = await Promise.all(
      employees.map(async (employee) => {
        // Find deliveries assigned to this employee
        const deliveries = await Delivery.find({ assignedTo: employee._id })
          .select('trackingNumber status')
          .limit(5);
        
        // Return employee with assigned deliveries
        return {
          id: employee._id,
          name: employee.name,
          email: employee.email,
          employeeId: employee.employeeId,
          status: employee.status,
          role: employee.role,
          assignedDeliveries: deliveries.map(delivery => ({
            id: delivery._id,
            trackingNumber: delivery.trackingNumber,
            status: delivery.status
          }))
        };
      })
    );

    res.status(200).json(employeesWithDeliveries);
  } catch (error) {
    console.error('Error searching employees:', error);
    res.status(500).json({ message: 'Server error while searching employees' });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select('name email employeeId status role');
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error getting employees:', error);
    res.status(500).json({ message: 'Server error while getting employees' });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const employee = await Employee.findById(id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Get assigned deliveries
    const deliveries = await Delivery.find({ assignedTo: id })
      .select('trackingNumber status estimatedDeliveryDate');
    
    const employeeData = {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      employeeId: employee.employeeId,
      status: employee.status,
      role: employee.role,
      phone: employee.phone,
      address: employee.address,
      assignedDeliveries: deliveries
    };
    
    res.status(200).json(employeeData);
  } catch (error) {
    console.error('Error getting employee:', error);
    res.status(500).json({ message: 'Server error while getting employee' });
  }
};

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, employeeId, role, phone, address } = req.body;
    
    // Check if employee with same email or ID already exists
    const existingEmployee = await Employee.findOne({
      $or: [{ email }, { employeeId }]
    });
    
    if (existingEmployee) {
      return res.status(400).json({ 
        message: 'Employee with this email or ID already exists' 
      });
    }
    
    const newEmployee = new Employee({
      name,
      email,
      employeeId,
      role,
      phone,
      address
    });
    
    await newEmployee.save();
    
    res.status(201).json({
      message: 'Employee created successfully',
      employee: {
        id: newEmployee._id,
        name: newEmployee.name,
        email: newEmployee.email,
        employeeId: newEmployee.employeeId,
        role: newEmployee.role
      }
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Server error while creating employee' });
  }
};

// Update employee status
exports.updateEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const employee = await Employee.findById(id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    employee.status = status;
    await employee.save();
    
    res.status(200).json({
      message: 'Employee status updated successfully',
      employee: {
        id: employee._id,
        name: employee.name,
        status: employee.status
      }
    });
  } catch (error) {
    console.error('Error updating employee status:', error);
    res.status(500).json({ message: 'Server error while updating employee status' });
  }
}; 