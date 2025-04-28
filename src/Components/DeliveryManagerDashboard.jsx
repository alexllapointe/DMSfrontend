import React, { useState } from 'react';
import '../Styles/DeliveryManagerDashboard.css';
import { Truck, ClipboardList, DollarSign } from 'lucide-react';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import { Drawer, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

// Dummy data
const unassignedOrders = [
  { id: 'ORD001', address: '123 Main St' },
  { id: 'ORD002', address: '456 Elm St' },
];

const drivers = ['Alex', 'Rudra', 'Spoorti', 'Uday'];

const assignedOrders = [
  { id: 'ORD101', driver: 'Alex', status: 'Completed' },
  { id: 'ORD102', driver: 'Spoorti', status: 'In Progress' },
];

const services = [
  { name: 'FedEx Ground', location: 'New York', price: 10 },
  { name: 'FedEx Priority', location: 'Chicago', price: 20 },
];

const DeliveryManagerDashboard = () => {
  const [activeSection, setActiveSection] = useState('');
  const [assignments, setAssignments] = useState({});
  const [serviceList, setServiceList] = useState(services);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentUserId] = useState('manager-1'); // Replace with real auth

  const assignDriver = (orderId, driver) => {
    setAssignments(prev => ({ ...prev, [orderId]: driver }));
  };

  const updatePrice = (index, newPrice) => {
    const updated = [...serviceList];
    updated[index].price = newPrice;
    setServiceList(updated);
  };

  const renderAssignDeliveries = () => (
    <div className="section-box">
      <h3>Unassigned Orders</h3>
      {unassignedOrders.map(order => (
        <div key={order.id} className="order-card">
          <p><strong>{order.id}</strong> - {order.address}</p>
          <select
            onChange={e => assignDriver(order.id, e.target.value)}
            value={assignments[order.id] || ''}
          >
            <option value="">Assign Driver</option>
            {drivers.map(driver => (
              <option key={driver} value={driver}>{driver}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );

  const renderCustomerOrders = () => (
    <div className="section-box">
      <h3>Customer Orders</h3>
      <div className="order-status">
        {assignedOrders.map(order => (
          <div key={order.id} className={`order-card ${order.status === 'Completed' ? 'done' : 'pending'}`}>
            <p><strong>{order.id}</strong> - Assigned to {order.driver}</p>
            <p>Status: {order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderManageServices = () => (
    <div className="section-box">
      <h3>Manage Services</h3>
      {serviceList.map((service, index) => (
        <div key={index} className="order-card">
          <p><strong>{service.name}</strong> - {service.location}</p>
          <input
            type="number"
            value={service.price}
            onChange={e => updatePrice(index, parseFloat(e.target.value))}
          /> USD
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'assign': return renderAssignDeliveries();
      case 'orders': return renderCustomerOrders();
      case 'services': return renderManageServices();
      default: return null;
    }
  };

  return (
    <div className="dashboard-container" style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <h2 className="dashboard-title">Delivery Manager Dashboard</h2>
        <div className="dashboard-cards">
          <div className="dashboard-card" onClick={() => setActiveSection('assign')}>
            <Truck size={48} color="#7B4EF7" />
            <p>Assign Deliveries</p>
          </div>
          <div className="dashboard-card" onClick={() => setActiveSection('orders')}>
            <ClipboardList size={48} color="#7B4EF7" />
            <p>Customer Orders</p>
          </div>
          <div className="dashboard-card" onClick={() => setActiveSection('services')}>
            <DollarSign size={48} color="#7B4EF7" />
            <p>Manage Services</p>
          </div>
        </div>
        {renderContent()}
      </div>
      {/* Chat Sidebar */}
      <div style={{ position: 'fixed', top: 80, right: 0, zIndex: 1200 }}>
        <IconButton color="primary" onClick={() => setChatOpen(!chatOpen)}>
          <ChatIcon />
        </IconButton>
      </div>
      <Drawer anchor="right" open={chatOpen} onClose={() => setChatOpen(false)}>
        <div style={{ width: 350, padding: 16, height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <ChatList onSelectRoom={setSelectedRoom} />
          {selectedRoom && (
            <ChatBox
              roomId={selectedRoom.id}
              senderId={currentUserId}
              senderRole={selectedRoom.type === 'driver-manager' ? 'manager' : 'manager'}
              receiverRole={selectedRoom.type === 'driver-manager' ? 'driver' : 'customer'}
              quickReplyType={selectedRoom.type === 'driver-manager' ? 'managerToDriver' : 'managerToCustomer'}
            />
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default DeliveryManagerDashboard;
