import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatInterface from './ChatInterface';

function DeliveryManagerDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Mock data for demonstration
  const mockEmployees = [
    { id: 'EMP001', name: 'John Doe', status: 'active', assignedDeliveries: 3 },
    { id: 'EMP002', name: 'Jane Smith', status: 'inactive', assignedDeliveries: 0 },
    { id: 'EMP003', name: 'Bob Johnson', status: 'active', assignedDeliveries: 2 },
    { id: 'EMP004', name: 'Alice Brown', status: 'active', assignedDeliveries: 1 },
    { id: 'EMP005', name: 'Charlie Wilson', status: 'inactive', assignedDeliveries: 0 },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      try {
        // Filter employees based on search query
        const filteredResults = mockEmployees.filter(employee => 
          employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setSearchResults(filteredResults);
        setIsLoading(false);
      } catch (err) {
        setError('An error occurred while searching. Please try again.');
        setIsLoading(false);
      }
    }, 500);
  };

  const getStatusIcon = (status) => {
    if (status === 'active') {
      return '🟢';
    } else {
      return '🔴';
    }
  };

  const handleChatClick = (driver) => {
    setSelectedDriver(driver);
  };

  if (selectedDriver) {
    return (
      <ChatInterface
        managerId="MAN001" // This should come from your auth context
        driverId={selectedDriver.id}
        driverName={selectedDriver.name}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-2xl font-bold text-center mb-8">Delivery Manager Dashboard</h1>
                
                {/* Search Form */}
                <form onSubmit={handleSearch} className="mb-8">
                  <div className="flex items-center border-b border-teal-500 py-2">
                    <input
                      className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                      type="text"
                      placeholder="Search by name or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                      className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                      type="submit"
                    >
                      Search
                    </button>
                  </div>
                </form>
                
                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-4">
                    <p>Loading...</p>
                  </div>
                )}
                
                {/* Error State */}
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
                
                {/* Results Table */}
                {!isLoading && !error && searchResults.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Deliveries</th>
                          <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.map((employee) => (
                          <tr key={employee.id}>
                            <td className="py-2 px-4 border-b border-gray-200">{employee.name}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{employee.id}</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              <span className="flex items-center">
                                {getStatusIcon(employee.status)}
                                <span className="ml-2 capitalize">{employee.status}</span>
                              </span>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">{employee.assignedDeliveries}</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              <button
                                onClick={() => handleChatClick(employee)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                disabled={employee.status === 'inactive'}
                              >
                                <MessageCircle size={16} />
                                <span>Chat</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {/* No Results */}
                {!isLoading && !error && searchResults.length === 0 && searchQuery && (
                  <div className="text-center py-4">
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryManagerDashboard; 