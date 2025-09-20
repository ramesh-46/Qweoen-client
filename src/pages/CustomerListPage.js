import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import mockData from '../mockData.json'; // Import the mock data

function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [viewMode, setViewMode] = useState("table");
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmCustomerId, setConfirmCustomerId] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [pincodeFilter, setPincodeFilter] = useState("");
  const [addressCountFilter, setAddressCountFilter] = useState("all");
const [idFilter, setIdFilter] = useState("");
  // Mock orders for each customer
  const generateRandomOrders = (customerId, count = 6) => {
    const orders = [];
    const shuffled = [...mockData.orders].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < count; i++) {
      if (shuffled[i]) {
        orders.push({
          ...shuffled[i],
          id: shuffled[i].id + customerId * 1000, // Make unique per customer
          customer_id: customerId
        });
      }
    }
    return orders;
  };

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/customers')
      .then(response => {
        const customersWithOrders = (response.data.data || []).map(customer => ({
          ...customer,
          orders: generateRandomOrders(customer.id)
        }));
        setCustomers(customersWithOrders);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
        setMessage({ text: "❌ Failed to load customers.", type: "error" });
        setLoading(false);
      });
  }, []);

  // Apply all filters
  const filteredCustomers = useMemo(() => {
    let result = [...customers];
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(customer => {
    const matchesCustomer = 
  // Check ID with or without #
  customer.id.toString().includes(term.trim()) ||
  // Also check if term starts with # and matches ID
  (term.trim().startsWith("#") && customer.id.toString() === term.trim().substring(1)) ||
  customer.first_name.toLowerCase().includes(term.toLowerCase()) ||
  customer.last_name.toLowerCase().includes(term.toLowerCase()) ||
  customer.phone_number.includes(term);
        const matchesAddress = customer.addresses?.some(address => 
          address.address_details.toLowerCase().includes(term) ||
          address.city.toLowerCase().includes(term) ||
          address.state.toLowerCase().includes(term) ||
          address.pin_code.includes(term)
        );
        
        return matchesCustomer || matchesAddress;
      });
    }
    
    if (cityFilter.trim()) {
      const cityTerm = cityFilter.toLowerCase();
      result = result.filter(customer => 
        customer.addresses?.some(address => 
          address.city.toLowerCase().includes(cityTerm)
        )
      );
    }
    
    if (stateFilter.trim()) {
      const stateTerm = stateFilter.toLowerCase();
      result = result.filter(customer => 
        customer.addresses?.some(address => 
          address.state.toLowerCase().includes(stateTerm)
        )
      );
    }
    if (idFilter.trim()) {
  const idTerm = idFilter.trim();
  result = result.filter(customer => 
    customer.id.toString() === idTerm ||
    customer.id.toString().includes(idTerm)
  );
}
    if (pincodeFilter.trim()) {
      const pinTerm = pincodeFilter;
      result = result.filter(customer => 
        customer.addresses?.some(address => 
          address.pin_code.includes(pinTerm)
        )
      );
    }
    
    if (addressCountFilter === 'single') {
      result = result.filter(customer => (customer.addresses?.length || 0) === 1);
    } else if (addressCountFilter === 'multiple') {
      result = result.filter(customer => (customer.addresses?.length || 0) > 1);
    }
    
    return result;
 }, [customers, searchTerm, cityFilter, stateFilter, pincodeFilter, addressCountFilter, idFilter]);
  // DELETE CUSTOMER
  const handleDeleteClick = (customerId) => {
    setConfirmCustomerId(customerId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!confirmCustomerId) return;

    setDeletingId(confirmCustomerId);
    setShowConfirm(false);

    try {
      await axios.delete(`http://localhost:5000/api/customers/${confirmCustomerId}`);
      
      setCustomers(prev => prev.filter(c => c.id !== confirmCustomerId));
      setMessage({
        text: "🗑️ Customer and all associated data deleted successfully!",
        type: "success"
      });
    } catch (error) {
      setMessage({
        text: "⚠️ Failed to delete customer. Please try again.",
        type: "error"
      });
    } finally {
      setDeletingId(null);
      setConfirmCustomerId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setConfirmCustomerId(null);
  };

  // Clear all filters
const clearFilters = () => {
  setSearchTerm("");
  setCityFilter("");
  setStateFilter("");
  setPincodeFilter("");
  setAddressCountFilter("all");
  setIdFilter(""); // 👈 ADD THIS
};

  // ========= COMPACT PROFESSIONAL STYLES (ALL INLINE) =========
  const containerStyle = {
    minHeight: "100vh",
    background: "#f8f9fa",
    padding: "15px",
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    color: "#495057",
  };

  const pageCardStyle = {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    overflow: "hidden",
    border: "1px solid #e9ecef",
  };

  const headerStyle = {
    background: "linear-gradient(90deg, #2c3e50 0%, #34495e 100%)",
    padding: "25px 30px",
    color: "white",
  };

  const headerTitleStyle = {
    margin: "0",
    fontSize: "1.8rem",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  };

  const contentStyle = {
    padding: "25px 30px",
  };

  // FILTER CONTROLS - COMPACT
  const filtersContainerStyle = {
    background: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #e9ecef",
    marginBottom: "25px",
  };

  const filtersRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    alignItems: "flex-end",
  };

  const filterGroupStyle = {
    display: "flex",
    flexDirection: "column",
    flex: "1",
    minWidth: "200px",
  };

  const filterLabelStyle = {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#495057",
    marginBottom: "5px",
  };

  const filterInputStyle = {
    padding: "8px 12px",
    border: "1px solid #ced4da",
    borderRadius: "6px",
    fontSize: "0.9rem",
    transition: "border-color 0.2s ease",
    outline: "none",
  };

  const filterSelectStyle = {
    padding: "8px 12px",
    border: "1px solid #ced4da",
    borderRadius: "6px",
    fontSize: "0.9rem",
    backgroundColor: "white",
    outline: "none",
  };

  const clearFiltersButtonStyle = {
    padding: "8px 16px",
    background: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
  };

  // SEARCH BAR
  const searchContainerStyle = {
    position: "relative",
    maxWidth: "400px",
    marginBottom: "20px",
  };

  const searchInputStyle = {
    width: "100%",
    padding: "10px 10px 10px 35px",
    border: "1px solid #ced4da",
    borderRadius: "6px",
    fontSize: "0.95rem",
    transition: "border-color 0.2s ease",
    outline: "none",
  };

  const searchIconStyle = {
    position: "absolute",
    left: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "1rem",
    color: "#6c757d",
  };

  // BUTTON STYLES - COMPACT
  const addButtonStyle = {
    padding: "10px 20px",
    background: "linear-gradient(90deg, #007bff 0%, #0056b3 100%)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
    textDecoration: "none",
    display: "inline-block",
    marginBottom: "20px",
    transition: "all 0.2s ease",
  };

  const viewToggleStyle = {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    marginLeft: "auto",
  };

  const toggleButtonStyle = (isActive) => ({
    padding: "6px 14px",
    border: "1px solid",
    borderColor: isActive ? "#007bff" : "#ced4da",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
    backgroundColor: isActive ? "#007bff" : "white",
    color: isActive ? "white" : "#007bff",
    transition: "all 0.2s ease",
  });

  // ALERT STYLES
  const alertStyle = (type) => ({
    padding: "12px 20px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontWeight: "500",
    fontSize: "0.95rem",
    animation: "pulse 1.5s infinite",
    background: type === "success" 
      ? "linear-gradient(90deg, #28a745 0%, #218838 100%)" 
      : "linear-gradient(90deg, #dc3545 0%, #c82333 100%)",
    color: "white",
    border: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  });

  // LOADER STYLES
  const loaderStyle = {
    textAlign: "center",
    padding: "40px",
    fontSize: "1.2rem",
    color: "#007bff",
  };

  // TABLE VIEW STYLES - COMPACT & PROFESSIONAL
  const tableContainerStyle = {
    overflowX: "auto",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    border: "1px solid #e9ecef",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.9rem",
    minWidth: "900px",
  };

  const thStyle = {
    padding: "12px 15px",
    textAlign: "left",
    backgroundColor: "#f8f9fa",
    color: "#495057",
    fontWeight: "700",
    fontSize: "0.9rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "2px solid #dee2e6",
  };

  const tdStyle = {
    padding: "12px 15px",
    borderBottom: "1px solid #e9ecef",
    color: "#495057",
    verticalAlign: "middle",
  };

  const trHoverStyle = {
    backgroundColor: "#f8f9fa",
    transition: "background-color 0.2s ease",
  };

const actionCellStyle = {
  display: "flex",
  gap: "6px",
  justifyContent: "flex-start",
  flexWrap: "wrap",
  alignItems: "center",
  minWidth: "100px", // Prevent shrinking too much
};

const actionButtonStyle = (bgColor, textColor = "white") => ({
  padding: "6px 10px",
  background: bgColor,
  color: textColor,
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.85rem",
  fontWeight: "600",
  transition: "all 0.2s ease",
  flex: "0 0 auto",
  whiteSpace: "nowrap",
  minWidth: "auto",
  maxWidth: "none", // ✅ Remove max-width restriction
  // Let button grow naturally based on content
});

  // CARD VIEW STYLES - COMPACT
const cardGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", // Reduced from 400px
  gap: "15px",
  marginTop: "20px",
};
  const customerCardStyle = {
    background: "white",
    border: "1px solid #e9ecef",
    borderRadius: "8px",
    padding: "20px",
    position: "relative",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  };

  const cardHoverStyle = {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    border: "1px solid #007bff",
  };

  const customerIdStyle = {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "#007bff",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.8rem",
    fontWeight: "600",
  };

  const customerNameStyle = {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#212529",
    margin: "0 0 10px 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const customerInfoStyle = {
    color: "#6c757d",
    fontSize: "0.9rem",
    margin: "6px 0",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "500",
  };

  const addressCountStyle = {
    background: "#28a745",
    color: "white",
    padding: "3px 8px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "600",
  };

  const multipleAddressStyle = {
    background: "#ffc107",
    color: "#212529",
    padding: "3px 8px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "600",
  };

const cardActionsStyle = {
  display: "flex",
  gap: "6px",
  marginTop: "15px",
 
  flexWrap: "wrap",
  alignItems: "center",

  paddingTop: "8px",
  borderTop: "1px solid #e9ecef",
  alignSelf: "flex-end",
};
  // ORDER HISTORY SECTION
  const orderSectionStyle = {
    marginTop: "20px",
    borderTop: "2px solid #e9ecef",
    paddingTop: "20px",
  };

  const orderSectionTitleStyle = {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#212529",
    marginBottom: "15px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const orderGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "15px",
  };

  const orderCardStyle = {
    background: "#f8f9fa",
    border: "1px solid #e9ecef",
    borderRadius: "6px",
    padding: "12px",
    fontSize: "0.85rem",
  };

  const orderHeaderStyle = {
    fontWeight: "600",
    color: "#212529",
    marginBottom: "5px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const orderStatusStyle = (status) => {
    let bgColor, color;
    switch (status) {
      case 'Delivered':
        bgColor = "#d4edda";
        color = "#155724";
        break;
      case 'Shipped':
        bgColor = "#cce5ff";
        color = "#004085";
        break;
      case 'Processing':
        bgColor = "#fff3cd";
        color = "#856404";
        break;
      case 'Cancelled':
        bgColor = "#f8d7da";
        color = "#721c24";
        break;
      case 'Returned':
        bgColor = "#d1ecf1";
        color = "#0c5460";
        break;
      default:
        bgColor = "#e9ecef";
        color = "#495057";
    }
    return {
      padding: "2px 8px",
      borderRadius: "12px",
      fontSize: "0.75rem",
      fontWeight: "600",
      backgroundColor: bgColor,
      color: color,
    };
  };

  const orderDetailStyle = {
    color: "#6c757d",
    marginBottom: "3px",
  };

  const paymentMethodStyle = {
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "0.75rem",
    fontWeight: "500",
    backgroundColor: "#e9ecef",
    color: "#495057",
    display: "inline-block",
    marginRight: "5px",
  };

  const discountStyle = {
    color: "#28a745",
    fontWeight: "600",
  };

  // CONFIRMATION MODAL STYLES
  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
  };

  const modalStyle = {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    border: "1px solid #dee2e6",
  };

  const modalTitleStyle = {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#dc3545",
    marginBottom: "15px",
  };

  const modalMessageStyle = {
    fontSize: "1rem",
    color: "#495057",
    marginBottom: "20px",
    lineHeight: "1.6",
  };

  const modalButtonsStyle = {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    marginTop: "20px",
  };

  const confirmButtonStyle = {
    padding: "10px 25px",
    background: "linear-gradient(90deg, #dc3545 0%, #c82333 100%)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
    transition: "all 0.2s ease",
  };

  const cancelButtonStyle = {
    padding: "10px 25px",
    background: "linear-gradient(90deg, #6c757d 0%, #495057 100%)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
    transition: "all 0.2s ease",
  };

  const deletingOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.95)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  };

  const deletingTextStyle = {
    fontSize: "1.3rem",
    color: "#495057",
    marginTop: "20px",
    fontWeight: "600",
  };

  // EMPTY STATE
  const emptyStateStyle = {
    textAlign: "center",
    padding: "60px 30px",
    fontSize: "1.1rem",
    background: "#f8f9fa",
    borderRadius: "8px",
    border: "1px dashed #ced4da",
    marginTop: "20px",
    color: "#6c757d",
  };

  // RESULTS COUNT
  const resultsCountStyle = {
    textAlign: "left",
    fontSize: "0.9rem",
    color: "#6c757d",
    margin: "15px 0",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const filterPillStyle = {
    background: "#e9ecef",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "500",
    color: "#495057",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    marginRight: "8px",
  };

  // ========= RENDER =========
  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loaderStyle}>⏳ Loading customers and order history...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={pageCardStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={headerTitleStyle}>CUSTOMER DATABASE & ORDER HISTORY</h1>
          <p style={{ margin: "10px 0 0 0", fontSize: "0.95rem", opacity: 0.9 }}>
            Complete view of customer profiles, addresses, and purchase history
          </p>
        </div>

        {/* Main Content */}
        <div style={contentStyle}>
          {message.text && <div style={alertStyle(message.type)}>{message.text}</div>}

          {/* Add New Customer Button */}
          <Link 
            to="/customers/new" 
            style={addButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#0056b3"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "linear-gradient(90deg, #007bff 0%, #0056b3 100%)"}
          >
            ➕ Add Customer
          </Link>

          {/* Filters Section */}
          <div style={filtersContainerStyle}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "1.1rem", fontWeight: "600", color: "#212529" }}>
              🔍 Advanced Filters
            </h3>
            <div style={filtersRowStyle}>
              <div style={filterGroupStyle}>
                <label style={filterLabelStyle}>Search All Fields</label>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={filterInputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#007bff"}
                  onBlur={(e) => e.target.style.borderColor = "#ced4da"}
                />
              </div>
              <div style={filterGroupStyle}>
  <label style={filterLabelStyle}>Search by ID</label>
  <input
    type="text"
    placeholder="Enter ID..."
    value={idFilter}
    onChange={(e) => setIdFilter(e.target.value)}
    style={filterInputStyle}
    onFocus={(e) => e.target.style.borderColor = "#007bff"}
    onBlur={(e) => e.target.style.borderColor = "#ced4da"}
  />
</div>
              <div style={filterGroupStyle}>
                <label style={filterLabelStyle}>City</label>
                <input
                  type="text"
                  placeholder="Enter city..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  style={filterInputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#007bff"}
                  onBlur={(e) => e.target.style.borderColor = "#ced4da"}
                />
              </div>
              
              <div style={filterGroupStyle}>
                <label style={filterLabelStyle}>State</label>
                <input
                  type="text"
                  placeholder="Enter state..."
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  style={filterInputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#007bff"}
                  onBlur={(e) => e.target.style.borderColor = "#ced4da"}
                />
              </div>
              
              <div style={filterGroupStyle}>
                <label style={filterLabelStyle}>Pincode</label>
                <input
                  type="text"
                  placeholder="Enter pincode..."
                  value={pincodeFilter}
                  onChange={(e) => setPincodeFilter(e.target.value)}
                  style={filterInputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#007bff"}
                  onBlur={(e) => e.target.style.borderColor = "#ced4da"}
                />
              </div>
              
              <div style={filterGroupStyle}>
                <label style={filterLabelStyle}>Address Count</label>
                <select
                  value={addressCountFilter}
                  onChange={(e) => setAddressCountFilter(e.target.value)}
                  style={filterSelectStyle}
                >
                  <option value="all">All Customers</option>
                  <option value="single">Only 1 Address</option>
                  <option value="multiple">Multiple Addresses</option>
                </select>
              </div>
              
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  onClick={clearFilters}
                  style={clearFiltersButtonStyle}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#5a6268"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#6c757d"}
                >
                  🧹 Clear Filters
                </button>
              </div>
            </div>
            
            {/* Active Filters Display */}
         {(searchTerm || cityFilter || stateFilter || pincodeFilter || addressCountFilter !== "all" || idFilter) && (
  <div style={{ marginTop: "15px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
    {searchTerm && <span style={filterPillStyle}>🔍 {searchTerm}</span>}
    {cityFilter && <span style={filterPillStyle}>🏙️ {cityFilter}</span>}
    {stateFilter && <span style={filterPillStyle}>🗺️ {stateFilter}</span>}
    {pincodeFilter && <span style={filterPillStyle}>🔢 {pincodeFilter}</span>}
    {idFilter && <span style={filterPillStyle}>🆔 ID: {idFilter}</span>} {/* 👈 ADD THIS */}
    {addressCountFilter !== "all" && (
      <span style={filterPillStyle}>
        {addressCountFilter === "single" ? "1️⃣ Single Address" : "🔢 Multiple Addresses"}
      </span>
    )}
  </div>
)}
          </div>

          {/* View Toggle */}
          <div style={viewToggleStyle}>
            <button
              style={toggleButtonStyle(viewMode === "card")}
              onClick={() => setViewMode("card")}
            >
              🃏 Cards
            </button>
            <button
              style={toggleButtonStyle(viewMode === "table")}
              onClick={() => setViewMode("table")}
            >
              📊 Table
            </button>
          </div>

          {/* Results Count */}
          <div style={resultsCountStyle}>
            <strong>{filteredCustomers.length}</strong> customers found
          </div>

          {/* No Customers or No Results */}
          {filteredCustomers.length === 0 ? (
            <div style={emptyStateStyle}>
              {searchTerm || cityFilter || stateFilter || pincodeFilter ? (
                <>🔍 No customers match your current filters</>
              ) : (
                <>📋 No customers in database</>
              )}
            </div>
          ) : viewMode === "card" ? (
            <div style={cardGridStyle}>
              {filteredCustomers.map(customer => (
                <div
                  key={customer.id}
                  style={customerCardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style = {...customerCardStyle, ...cardHoverStyle};
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style = customerCardStyle;
                  }}
                >
                  <div style={customerIdStyle}>ID #{customer.id}</div>
                  <h3 style={customerNameStyle}>
                    👤 {customer.first_name} {customer.last_name}
                  </h3>
                  <div style={customerInfoStyle}>
                    📱 {customer.phone_number}
                  </div>
                  <div style={customerInfoStyle}>
                    🏠 Addresses:{" "}
                    {(customer.addresses?.length || 0) === 1 ? (
                      <span style={addressCountStyle}>1 Address</span>
                    ) : (
                      <span style={multipleAddressStyle}>{customer.addresses?.length} Addresses</span>
                    )}
                  </div>
                  
                {customer.addresses && customer.addresses.length > 0 && (
  <div style={{ marginTop: "15px", fontSize: "0.85rem" }}>
    <div style={{ fontWeight: "600", color: "#212529", marginBottom: "8px" }}>
      📍 Primary Address
    </div>
    <div style={{ 
      padding: "8px", 
      background: "#f8f9fa", 
      borderRadius: "4px",
      borderLeft: "3px solid #007bff"
    }}>
      <div>{customer.addresses[0].city}</div>  {/* 👈 ONLY SHOW CITY */}
    </div>
  </div>
)}
                  
                  {/* ORDER HISTORY SECTION */}
           {/* ORDER HISTORY SECTION — SHOW ONLY COUNT */}
<div style={orderSectionStyle}>
  <div style={orderSectionTitleStyle}>
    🛒 Recent Orders ({customer.orders?.length || 0})
  </div>
  {/* 👈 ORDER LIST REMOVED — NOTHING RENDERED BELOW TITLE */}
</div>
                  
                  <div style={cardActionsStyle}>
                    <Link
                      to={`/customers/${customer.id}`}
                      style={actionButtonStyle("#007bff")}
                    >
                      👁️ View Details
                    </Link>
                    <Link
                      to={`/customers/${customer.id}/edit`}
                      style={actionButtonStyle("#ffc107", "#212529")}
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(customer.id)}
                      disabled={deletingId === customer.id}
                      style={actionButtonStyle(
                        deletingId === customer.id ? "#adb5bd" : "#dc3545"
                      )}
                    >
                      {deletingId === customer.id ? "⏳" : "🗑️ Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={tableContainerStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
<th style={thStyle}>ID</th>
<th style={thStyle}>Customer</th>
<th style={thStyle}>Phone</th>
<th style={thStyle}>City</th>          {/* 👈 ADD THIS */}
<th style={thStyle}> Addresses</th>    {/* 👈 ADD THIS */}
<th style={thStyle}>Orders</th>
<th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      style={trHoverStyle}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                    >
                 <td style={tdStyle}>{customer.id}</td>
<td style={tdStyle}>
  <div style={{ fontWeight: "600" }}>
    {customer.first_name} {customer.last_name}
  </div>
</td>
<td style={tdStyle}>{customer.phone_number}</td>

{/* 👇 NEW: City Column — Show only city name */}
<td style={tdStyle}>
  {customer.addresses && customer.addresses.length > 0 ? (
    customer.addresses[0].city
  ) : (
    <span style={{ color: "#adb5bd", fontStyle: "italic" }}>N/A</span>
  )}
</td>

{/* 👇 NEW: Address Count Column */}
<td style={tdStyle}>
  {(customer.addresses?.length || 0) === 1 ? (
    <span style={addressCountStyle}>1</span>
  ) : (
    <span style={multipleAddressStyle}>{customer.addresses?.length}</span>
  )}
</td>

{/* 👇 Keep existing “Orders” and “Actions” columns unchanged */}
<td style={tdStyle}>
  <div style={{ fontWeight: "600" }}>{customer.orders?.length || 0} orders</div>
  {customer.orders && customer.orders.length > 0 && (
    <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
      Last: {new Date(customer.orders[0].order_date).toLocaleDateString()}
    </div>
  )}
</td>
<td style={tdStyle}>
  <div style={actionCellStyle}>
    <Link to={`/customers/${customer.id}`} style={actionButtonStyle("#007bff")}>View</Link>
    <Link to={`/customers/${customer.id}/edit`} style={actionButtonStyle("#ffc107", "#212529")}>Edit</Link>
    <button
      onClick={() => handleDeleteClick(customer.id)}
      disabled={deletingId === customer.id}
      style={actionButtonStyle(deletingId === customer.id ? "#adb5bd" : "#dc3545")}
    >
      Delete
    </button>
  </div>
</td>
                     
                  
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showConfirm && (
        <div style={modalOverlayStyle} onClick={cancelDelete}>
          <div 
            style={modalStyle} 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={modalTitleStyle}>CONFIRM DELETION</div>
            <div style={modalMessageStyle}>
              Are you sure you want to delete this customer and <strong>ALL</strong> their data including orders and addresses?<br/>
              This action <strong>cannot be undone</strong>.
            </div>
            <div style={modalButtonsStyle}>
              <button
                onClick={confirmDelete}
                style={confirmButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#c82333"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "linear-gradient(90deg, #dc3545 0%, #c82333 100%)"}
              >
                💥 DELETE
              </button>
              <button
                onClick={cancelDelete}
                style={cancelButtonStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#495057"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "linear-gradient(90deg, #6c757d 0%, #495057 100%)"}
              >
                ❌ CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETING OVERLAY */}
      {deletingId && (
        <div style={deletingOverlayStyle}>
          <div style={{ fontSize: "2rem", color: "#dc3545" }}>⏳</div>
          <div style={deletingTextStyle}>Processing deletion...</div>
          <div style={{ fontSize: "0.9rem", color: "#6c757d", marginTop: "10px" }}>
            Removing customer, addresses, and order history...
          </div>
        </div>
      )}

      {/* Global Animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.8; }
          100% { opacity: 1; }
        }
        button:hover:not(:disabled),
        a:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(0,0,0,0.15) !important;
        }
        input:focus, select:focus {
          outline: none !important;
          border-color: #007bff !important;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2) !important;
        }
      `}</style>
    </div>
  );
}

export default CustomerListPage;