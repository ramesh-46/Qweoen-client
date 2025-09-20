import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import generateMockOrders from '../mockOrdersData'; // Import mock data generator

function CustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]); // NEW: Orders state
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("card"); // for addresses
  const [ordersViewMode, setOrdersViewMode] = useState("card"); // for orders

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/customers/${id}`)
      .then((response) => {
        const data = response.data.data;
        setCustomer(data);
        setAddresses(data.addresses || []);
        setOrders(generateMockOrders(id)); // Generate mock orders
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching customer:", error);
        setLoading(false);
      });
  }, [id]);

  // ========= STYLES (PROFESSIONAL, MODERN, RESPONSIVE) =========
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #6a1b9a, #42a5f5)",
    padding: "1rem",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    color: "#333",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    overflow: "hidden",
    transition: "all 0.3s ease",
  };

  const headerStyle = {
    padding: "2rem",
    borderBottom: "1px solid #eee",
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: "700",
    color: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  };

  const profileIconStyle = {
    fontSize: "2rem",
  };

  const infoBoxStyle = {
    padding: "1.5rem",
    backgroundColor: "#f8f9fa",
    margin: "0 2rem",
    borderRadius: "12px",
    borderLeft: "4px solid #4CAF50",
  };

  const infoItemStyle = {
    margin: "10px 0",
    fontSize: "1rem",
    color: "#555",
  };

  const sectionStyle = {
    padding: "1.5rem",
    borderBottom: "1px solid #eee",
  };

  const titleStyle = {
    fontSize: "1.3rem",
    fontWeight: "600",
    marginBottom: "1rem",
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const toggleButtonStyle = (isActive) => ({
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    backgroundColor: isActive ? "#4CAF50" : "#ddd",
    color: isActive ? "white" : "#555",
    transition: "all 0.2s ease",
    marginRight: "0.5rem",
  });

  const buttonContainerStyle = {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
    justifyContent: "center",
  };

  const buttonStyle = (bgColor, textColor) => ({
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    backgroundColor: bgColor,
    color: textColor,
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  });

  const addressCardStyle = {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "1.25rem",
    backgroundColor: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    transition: "all 0.2s ease",
    marginBottom: "1rem",
  };

  const addressHeaderStyle = {
    fontWeight: "600",
    fontSize: "1.1rem",
    color: "#333",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const addressDetailStyle = {
    color: "#555",
    fontSize: "1rem",
    lineHeight: "1.5",
    marginBottom: "0.5rem",
  };

  const addressPinStyle = {
    color: "#666",
    fontSize: "0.95rem",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const orderCardStyle = {
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    padding: "1.25rem",
    backgroundColor: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    transition: "all 0.2s ease",
    marginBottom: "1rem",
  };

  const orderHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem",
    paddingBottom: "0.5rem",
    borderBottom: "1px solid #eee",
  };

  const orderTitleStyle = {
    fontWeight: "600",
    fontSize: "1.1rem",
    color: "#333",
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
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "0.85rem",
      fontWeight: "600",
      backgroundColor: bgColor,
      color: color,
    };
  };

  const orderDetailStyle = {
    fontSize: "0.95rem",
    color: "#555",
    margin: "6px 0",
  };

  const paymentMethodStyle = {
    display: "inline-block",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "0.85rem",
    backgroundColor: "#e3f2fd",
    color: "#1976d2",
    fontWeight: "500",
    marginRight: "8px",
  };

  const discountStyle = {
    color: "#28a745",
    fontWeight: "600",
  };

  const amountStyle = {
    fontWeight: "600",
    fontSize: "1.1rem",
    color: "#d32f2f",
  };

  const loaderStyle = {
    textAlign: "center",
    padding: "40px",
    fontSize: "1.2rem",
    color: "#555",
  };

  // ========= RENDER =========
  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loaderStyle}>⏳ Loading customer details...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div style={containerStyle}>
        <div style={{ color: "#e74c3c", textAlign: "center", padding: "20px", fontSize: "1.1rem" }}>
          ❌ Customer not found.
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <span style={profileIconStyle}>👤</span> {customer.first_name} {customer.last_name}
          <div style={{ marginTop: "0.5rem", color: "#666", fontSize: "1rem" }}>
            <span>📞</span> Phone: {customer.phone_number}
          </div>
        </div>

        {/* Customer Info Box */}
        <div style={infoBoxStyle}>
          <div style={infoItemStyle}>
            <strong>First Name:</strong> {customer.first_name}
          </div>
          <div style={infoItemStyle}>
            <strong>Last Name:</strong> {customer.last_name}
          </div>
          <div style={infoItemStyle}>
            <strong>Phone:</strong> {customer.phone_number}
          </div>
           <div style={buttonContainerStyle}>
          <Link to={`/customers/${id}/edit`} style={buttonStyle("#2196F3", "white")}>
            ✏️ Edit Customer
          </Link>
          <Link to="/" style={buttonStyle("#9E9E9E", "white")}>
            🏠 Back to List
          </Link>
        </div>
        </div>

        {/* Address Section */}
        <div style={sectionStyle}>
          <div style={titleStyle}>
            <span>📬</span> Addresses ({addresses.length})
          </div>

          {/* Toggle Buttons */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
            <button
              style={toggleButtonStyle(viewMode === "card")}
              onClick={() => setViewMode("card")}
            >
              📱 Cards
            </button>
            <button
              style={toggleButtonStyle(viewMode === "table")}
              onClick={() => setViewMode("table")}
            >
              📊 Table
            </button>
          </div>

          {/* Render Addresses */}
          {addresses.length === 0 ? (
            <div style={{ color: "#777", textAlign: "center", padding: "1.5rem", fontSize: "1rem" }}>
              No addresses available for this customer.
            </div>
          ) : viewMode === "card" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
              {addresses.map((address) => (
                <div
                  key={address.id}
                  style={addressCardStyle}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"}
                >
                  <div style={addressHeaderStyle}>
                    <span>📍</span> {address.city}, {address.state}
                  </div>
                  <div style={addressDetailStyle}>{address.address_details}</div>
                  <div style={addressPinStyle}>
                    <span>🏷️</span> PIN: {address.pin_code}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "1rem", textAlign: "left", backgroundColor: "#f2f2f2", borderBottom: "2px solid #ddd" }}>Address</th>
                    <th style={{ padding: "1rem", textAlign: "left", backgroundColor: "#f2f2f2", borderBottom: "2px solid #ddd" }}>City</th>
                    <th style={{ padding: "1rem", textAlign: "left", backgroundColor: "#f2f2f2", borderBottom: "2px solid #ddd" }}>State</th>
                    <th style={{ padding: "1rem", textAlign: "left", backgroundColor: "#f2f2f2", borderBottom: "2px solid #ddd" }}>PIN Code</th>
                  </tr>
                </thead>
                <tbody>
                  {addresses.map((address) => (
                    <tr key={address.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "1rem", color: "#555" }}>{address.address_details}</td>
                      <td style={{ padding: "1rem", color: "#555" }}>{address.city}</td>
                      <td style={{ padding: "1rem", color: "#555" }}>{address.state}</td>
                      <td style={{ padding: "1rem", color: "#555" }}>{address.pin_code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order & Payment History */}
        <div style={sectionStyle}>
          <div style={titleStyle}>
            <span>🛒</span> Order & Payment History ({orders.length})
          </div>

          {/* Toggle Buttons */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
            <button
              style={toggleButtonStyle(ordersViewMode === "card")}
              onClick={() => setOrdersViewMode("card")}
            >
              📱 Cards
            </button>
            <button
              style={toggleButtonStyle(ordersViewMode === "table")}
              onClick={() => setOrdersViewMode("table")}
            >
              📊 Table
            </button>
          </div>

          {/* Render Orders */}
          {orders.length === 0 ? (
            <div style={{ color: "#777", textAlign: "center", padding: "1.5rem", fontSize: "1rem" }}>
              No order history available for this customer.
            </div>
          ) : ordersViewMode === "card" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  style={orderCardStyle}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={orderHeaderStyle}>
                    <div style={orderTitleStyle}>Order #{order.id}</div>
                    <div style={orderStatusStyle(order.status)}>{order.status}</div>
                  </div>
                  <div style={orderDetailStyle}>
                    <strong>📅 Date:</strong> {new Date(order.order_date).toLocaleDateString('en-GB')}
                  </div>
                  <div style={orderDetailStyle}>
                    <strong>💳 Payment Method:</strong> <span style={paymentMethodStyle}>{order.payment_method}</span>
                  </div>
                  <div style={orderDetailStyle}>
                    <strong>📦 Items:</strong> {order.items_count}
                  </div>
                  <div style={orderDetailStyle}>
                    <strong>🏷️ Offer:</strong> {order.offer_type}
                  </div>
                  {order.discount_applied > 0 && (
                    <div style={orderDetailStyle}>
                      <strong>💰 Discount:</strong> <span style={discountStyle}>₹{order.discount_applied.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={orderDetailStyle}>
                    <strong style={amountStyle}>💵 Total Amount: ₹{order.final_amount.toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "1rem", textAlign: "left", backgroundColor: "#f2f2f2", borderBottom: "2px solid #ddd" }}>Order ID</th>
                    <th style={{ padding: "1rem", textAlign: "left", backgroundColor: "#f2f2f2", borderBottom: "2px solid #ddd" }}>Date</th>
                    <th style={{ padding: "1rem", textAlign: "left", backgroundColor: "#f2f2f2", borderBottom: "2px solid #ddd" }}>Status</th>
                    <th style={{ padding: "1rem", textAlign: "left", backgroundColor: "#f2f2f2", borderBottom: "2px solid #ddd" }}>Payment</th>
                    <th style={{ padding: "1rem", textAlign: "left", backgroundColor: "#f2f2f2", borderBottom: "2px solid #ddd" }}>Items</th>
                    <th style={{ padding: "1rem", textAlign: "left", backgroundColor: "#f2f2f2", borderBottom: "2px solid #ddd" }}>Discount</th>
                    <th style={{ padding: "1rem", textAlign: "left", backgroundColor: "#f2f2f2", borderBottom: "2px solid #ddd" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "1rem", color: "#555" }}>#{order.id}</td>
                      <td style={{ padding: "1rem", color: "#555" }}>{new Date(order.order_date).toLocaleDateString('en-GB')}</td>
                      <td style={{ padding: "1rem", color: "#555" }}>
                        <span style={orderStatusStyle(order.status)}>{order.status}</span>
                      </td>
                      <td style={{ padding: "1rem", color: "#555" }}>
                        <span style={paymentMethodStyle}>{order.payment_method}</span>
                      </td>
                      <td style={{ padding: "1rem", color: "#555" }}>{order.items_count}</td>
                      <td style={{ padding: "1rem", color: "#555" }}>
                        {order.discount_applied > 0 ? (
                          <span style={discountStyle}>₹{order.discount_applied.toFixed(2)}</span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td style={{ padding: "1rem", color: "#555" }}>
                        <strong style={amountStyle}>₹{order.final_amount.toFixed(2)}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Buttons */}
       
      </div>

      {/* Global Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .order-card:hover {
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}

export default CustomerDetailPage;