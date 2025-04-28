import React, { useState } from 'react';
import '../Styles/DeliveryManagerDashboard.css';
import { Truck, ClipboardList, DollarSign } from 'lucide-react';
import ChatList from './ChatList';
import ChatBox from './ChatBox';
import { Drawer, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import Tooltip from '@mui/material/Tooltip';

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
  const [unreadCounts, setUnreadCounts] = useState({
    'driver-manager-ORD101': 2,
    'driver-manager-ORD102': 0,
    'customer-ORD201': 1,
    'customer-ORD202': 0,
  });

  const assignDriver = (orderId, driver) => {
    setAssignments(prev => ({ ...prev, [orderId]: driver }));
  };

  const updatePrice = (index, newPrice) => {
    const updated = [...serviceList];
    updated[index].price = newPrice;
    setServiceList(updated);
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setChatOpen(true);
    setUnreadCounts(prev => ({ ...prev, [room.id]: 0 }));
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
          <div key={order.id} className={`order-card ${order.status === 'Completed' ? 'done' : 'pending'}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0 }}><strong>{order.id}</strong> - Assigned to {order.driver}</p>
              <p style={{ margin: 0 }}>Status: {order.status}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Tooltip title="Message Driver">
                <IconButton
                  size="large"
                  color="primary"
                  style={{ marginLeft: 8, marginBottom: 4 }}
                  onClick={() => {
                    setSelectedRoom({
                      id: `driver-manager-${order.id}`,
                      type: 'driver-manager',
                      participant1Id: currentUserId,
                      participant2Id: order.driver,
                      orderId: order.id,
                      driver: order.driver,
                      status: order.status
                    });
                    setChatOpen(true);
                  }}
                >
                  <ChatIcon fontSize="large" />
                </IconButton>
              </Tooltip>
              <span style={{ fontSize: 12, color: '#555' }}>Message Driver</span>
            </div>
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
      {/* Floating chat sidebar button */}
      <div style={{ position: 'fixed', top: 80, right: 0, zIndex: 1200 }}>
        <IconButton color="primary" onClick={() => setChatOpen(!chatOpen)}>
          <ChatIcon />
        </IconButton>
      </div>
      <Drawer anchor="right" open={chatOpen} onClose={() => setChatOpen(false)}>
        <div style={{ width: 350, padding: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column' }}>
            <ChatList onSelectRoom={handleSelectRoom} unreadCounts={unreadCounts} />
            {selectedRoom && (
              <ChatBox
                roomId={selectedRoom.id}
                senderId={currentUserId}
                senderRole={selectedRoom.type === 'driver-manager' ? 'manager' : 'manager'}
                receiverRole={selectedRoom.type === 'driver-manager' ? 'driver' : 'customer'}
                quickReplyType={selectedRoom.type === 'driver-manager' ? 'managerToDriver' : 'managerToCustomer'}
                { ...(selectedRoom.type === 'driver-manager' ? {
                  receiverName: selectedRoom.participant2Id || selectedRoom.driver,
                  receiverAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedRoom.participant2Id || selectedRoom.driver)}&background=0a3977&color=fff&size=64`
                } : selectedRoom.type === 'customer' ? {
                  receiverName: selectedRoom.customerName,
                  receiverAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedRoom.customerName)}&background=0a3977&color=fff&size=64`
                } : {}) }
                onClose={() => setSelectedRoom(null)}
              />
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default DeliveryManagerDashboard;
