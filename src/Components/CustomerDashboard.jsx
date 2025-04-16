import React, { useState, useEffect } from 'react';
import { Package, Truck, MapPin, Search, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import SupportChatWidget from "./SupportChatWidget";
import '../Styles/CustomerDashboard.css';

const CustomerDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Mock data for demonstration
    const mockOrders = [
        { 
            id: 'ORD001', 
            trackingNumber: 'TRK123456789', 
            status: 'Delivered', 
            date: '2023-12-05',
            items: ['Package 1', 'Package 2'],
            deliveryAddress: '123 Main St, Anytown, USA',
            estimatedDelivery: '2023-12-05',
            actualDelivery: '2023-12-05'
        },
        { 
            id: 'ORD002', 
            trackingNumber: 'TRK987654321', 
            status: 'In Transit', 
            date: '2023-12-10',
            items: ['Package 3'],
            deliveryAddress: '456 Oak Ave, Somewhere, USA',
            estimatedDelivery: '2023-12-12',
            actualDelivery: null
        },
        { 
            id: 'ORD003', 
            trackingNumber: 'TRK456789123', 
            status: 'Processing', 
            date: '2023-12-15',
            items: ['Package 4', 'Package 5'],
            deliveryAddress: '789 Pine Rd, Elsewhere, USA',
            estimatedDelivery: '2023-12-18',
            actualDelivery: null
        }
    ];
    
    const [orders, setOrders] = useState(mockOrders);
    const [filteredOrders, setFilteredOrders] = useState(mockOrders);
    
    // Simulated customer and manager IDs
    const customerId = "64abc123"; 
    const managerId = "64def456";
    
    useEffect(() => {
        // Filter orders based on search query
        if (searchQuery) {
            const filtered = orders.filter(order => 
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.status.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredOrders(filtered);
        } else {
            setFilteredOrders(orders);
        }
    }, [searchQuery, orders]);
    
    const handleSearch = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate API call with setTimeout
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    };
    
    const getStatusIcon = (status) => {
        switch(status) {
            case 'Delivered':
                return <CheckCircle className="status-icon delivered" />;
            case 'In Transit':
                return <Truck className="status-icon in-transit" />;
            case 'Processing':
                return <Clock className="status-icon processing" />;
            default:
                return <AlertCircle className="status-icon" />;
        }
    };
    
    const getStatusClass = (status) => {
        switch(status) {
            case 'Delivered':
                return 'status-delivered';
            case 'In Transit':
                return 'status-in-transit';
            case 'Processing':
                return 'status-processing';
            default:
                return '';
        }
    };
    
    return (
        <div className="customer-dashboard">
            <div className="dashboard-header">
                <h1>Customer Dashboard</h1>
                <div className="user-info">
                    <span>Welcome, Customer</span>
                </div>
            </div>
            
            <div className="dashboard-tabs">
                <button 
                    className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    <Package className="tab-icon" />
                    My Orders
                </button>
                <button 
                    className={`tab-button ${activeTab === 'tracking' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tracking')}
                >
                    <Truck className="tab-icon" />
                    Track Packages
                </button>
                <button 
                    className={`tab-button ${activeTab === 'locations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('locations')}
                >
                    <MapPin className="tab-icon" />
                    USPS Locations
                </button>
            </div>
            
            <div className="dashboard-content">
                {activeTab === 'orders' && (
                    <div className="orders-section">
                        <div className="section-header">
                            <h2>My Orders</h2>
                            <form onSubmit={handleSearch} className="search-form">
                                <div className="search-input-container">
                                    <input
                                        type="text"
                                        placeholder="Search by order ID or tracking number..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="search-input"
                                    />
                                    <button type="submit" className="search-button">
                                        <Search size={18} />
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                        {isLoading ? (
                            <div className="loading-state">Loading orders...</div>
                        ) : error ? (
                            <div className="error-state">{error}</div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="empty-state">No orders found</div>
                        ) : (
                            <div className="orders-list">
                                {filteredOrders.map(order => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-header">
                                            <div className="order-id">Order #{order.id}</div>
                                            <div className={`order-status ${getStatusClass(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span>{order.status}</span>
                                            </div>
                                        </div>
                                        <div className="order-details">
                                            <div className="detail-row">
                                                <span className="detail-label">Tracking Number:</span>
                                                <span className="detail-value">{order.trackingNumber}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Order Date:</span>
                                                <span className="detail-value">{order.date}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Items:</span>
                                                <span className="detail-value">{order.items.join(', ')}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Delivery Address:</span>
                                                <span className="detail-value">{order.deliveryAddress}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Estimated Delivery:</span>
                                                <span className="detail-value">{order.estimatedDelivery}</span>
                                            </div>
                                            {order.actualDelivery && (
                                                <div className="detail-row">
                                                    <span className="detail-label">Actual Delivery:</span>
                                                    <span className="detail-value">{order.actualDelivery}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="order-actions">
                                            <button className="action-button">Track Package</button>
                                            <button className="action-button">View Details</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                {activeTab === 'tracking' && (
                    <div className="tracking-section">
                        <h2>Track Packages</h2>
                        <div className="tracking-form">
                            <input
                                type="text"
                                placeholder="Enter tracking number"
                                className="tracking-input"
                            />
                            <button className="track-button">Track</button>
                        </div>
                        <div className="tracking-info">
                            <p>Enter a tracking number to see the status of your package.</p>
                        </div>
                    </div>
                )}
                
                {activeTab === 'locations' && (
                    <div className="locations-section">
                        <h2>USPS Locations</h2>
                        <div className="locations-search">
                            <input
                                type="text"
                                placeholder="Enter ZIP code or address"
                                className="location-input"
                            />
                            <button className="search-location-button">Find Locations</button>
                        </div>
                        <div className="locations-map">
                            <p>Map will be displayed here</p>
                        </div>
                    </div>
                )}
            </div>
            
            <SupportChatWidget customerId={customerId} managerId={managerId} />
        </div>
    );
};

export default CustomerDashboard;
