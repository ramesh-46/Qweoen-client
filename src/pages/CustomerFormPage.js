import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function CustomerFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // Customer Core Info
  const [customerData, setCustomerData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address_details: "",
    city: "",
    state: "",
    pin_code: "",
  });

  // Addresses Management
  const [addresses, setAddresses] = useState([]);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    address_details: "",
    city: "",
    state: "",
    pin_code: "",
  });
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'

  // UI State
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [customerErrors, setCustomerErrors] = useState({});
  const [addressErrors, setAddressErrors] = useState({});
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // Load customer + addresses if editing
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      axios
        .get(`https://qwoen.onrender.com/api/customers/${id}`)
        .then((res) => {
          const data = res.data.data;
          setCustomerData({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            phone_number: data.phone_number || "",
            address_details: data.address_details || "",
            city: data.city || "",
            state: data.state || "",
            pin_code: data.pin_code || "",
          });
          setAddresses(data.addresses || []);
          setLoading(false);
        })
        .catch((err) => {
          setMessage({
            text: "❌ Failed to load customer. Redirecting...",
            type: "error",
          });
          setLoading(false);
          setTimeout(() => navigate("/"), 1500);
        });
    }
  }, [id, isEdit, navigate]);

  // ========= CUSTOMER FORM HANDLERS =========
  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
    if (customerErrors[name]) setCustomerErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateCustomer = () => {
    const errors = {};
    if (!customerData.first_name.trim()) errors.first_name = "First name is required.";
    if (!customerData.last_name.trim()) errors.last_name = "Last name is required.";
    if (!customerData.phone_number) {
      errors.phone_number = "Phone number is required.";
    } else if (!/^\d{10}$/.test(customerData.phone_number)) {
      errors.phone_number = "Phone number must be 10 digits.";
    }
    setCustomerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!validateCustomer()) return;

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      let customerId = id;

      if (isEdit) {
        await axios.put(`https://qwoen.onrender.com/api/customers/${id}`, customerData);
        setMessage({ text: "🎉 Customer info updated successfully!", type: "success" });
      } else {
        const res = await axios.post("https://qwoen.onrender.com/api/customers", customerData);
        customerId = res.data.customerId;
        setMessage({ text: "🎉 Customer created! Now add addresses.", type: "success" });
      }

      if (!isEdit) {
        navigate(`/customers/${customerId}/edit`, { replace: true });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || (isEdit ? "Update failed." : "Creation failed.");
      setMessage({ text: `⚠️ ${ errorMsg }`, type: "error" });
      if (error.response?.data?.field) {
        setCustomerErrors({ [error.response.data.field]: errorMsg });
      }
    } finally {
      setLoading(false);
    }
  };

  // ========= ADDRESS FORM HANDLERS =========
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
    if (addressErrors[name]) setAddressErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateAddress = () => {
    const errors = {};
    if (!addressForm.address_details.trim()) errors.address_details = "Address is required.";
    if (!addressForm.city.trim()) errors.city = "City is required.";
    if (!addressForm.state.trim()) errors.state = "State is required.";
    if (!addressForm.pin_code) {
      errors.pin_code = "Pin code is required.";
    } else if (!/^\d{6}$/.test(addressForm.pin_code)) {
      errors.pin_code = "Pin code must be 6 digits.";
    }
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddress()) return;

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (editingAddressId) {
        const res = await axios.put(`https://qwoen.onrender.com/api/addresses/${editingAddressId}`, addressForm);
        setAddresses((prev) =>
          prev.map((addr) => (addr.id === editingAddressId ? res.data.address : addr))
        );
        setMessage({ text: "🎉 Address updated successfully!", type: "success" });
      } else {
        const res = await axios.post("https://qwoen.onrender.com/api/addresses", {
          customer_id: id,
          ...addressForm,
        });
        setAddresses((prev) => [...prev, res.data.address]);
        setMessage({ text: "🎉 New address added successfully!", type: "success" });
      }

      setAddressForm({ address_details: "", city: "", state: "", pin_code: "" });
      setEditingAddressId(null);
      setIsAddingAddress(false);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Operation failed.";
      setMessage({ text: `⚠️ ${ errorMsg }`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const startEditingAddress = (address) => {
    setEditingAddressId(address.id);
    setAddressForm({
      address_details: address.address_details,
      city: address.city,
      state: address.state,
      pin_code: address.pin_code,
    });
    setIsAddingAddress(false);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this address? This action cannot be undone.")) return;

    try {
      await axios.delete(`https://qwoen.onrender.com/api/addresses/${addressId}`);
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
      setMessage({ text: "🗑️ Address deleted successfully.", type: "success" });
    } catch (error) {
      setMessage({ text: "⚠️ Failed to delete address.", type: "error" });
    }
  };

  const cancelAddressForm = () => {
    setAddressForm({ address_details: "", city: "", state: "", pin_code: "" });
    setEditingAddressId(null);
    setIsAddingAddress(false);
    setAddressErrors({});
  };

  // ========= STYLES (PROFESSIONAL, MODERN, RESPONSIVE) =========
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #00b894, #0077b5)",
    padding: "1rem",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    color: "#333",
  };

  const pageCardStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    overflow: "hidden",
    border: "1px solid #e0e0e0",
  };

  const headerStyle = {
    background: "linear-gradient(to right, #0077b5, #00b894)",
    padding: "2rem",
    textAlign: "center",
    color: "white",
    position: "relative",
  };

  const headerTitleStyle = {
    margin: "0",
    fontSize: "2rem",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    justifyContent: "center",
  };

  const headerIconStyle = {
    fontSize: "2rem",
  };

  const sectionStyle = {
    padding: "2rem",
    backgroundColor: "#f9f9f9",
  };

  const subtitleStyle = {
    color: "#2c3e50",
    fontSize: "1.4rem",
    fontWeight: "700",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderBottom: "2px solid #00b894",
    paddingBottom: "6px",
  };

  const formRowStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "1.5rem",
  };

  const formGroupStyle = {
    display: "flex",
    flexDirection: "column",
  };

  const labelStyle = {
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "0.5rem",
    fontSize: "0.95rem",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  const inputStyle = (hasError) => ({
    padding: "10px",
    border: hasError ? "2px solid #e74c3c" : "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "1rem",
    backgroundColor: "#f8f9fa",
    transition: "all 0.2s ease",
    outline: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  });

  const errorTextStyle = {
    color: "#e74c3c",
    fontSize: "0.85rem",
    marginTop: "5px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "1rem",
    marginTop: "1.5rem",
  };

  const buttonStyle = (bgColor, textColor = "white", disabled = false) => ({
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: disabled ? "not-allowed" : "pointer",
    backgroundColor: disabled ? "#ccc" : bgColor,
    color: textColor,
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  });

  const alertStyle = (type) => ({
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    fontWeight: "600",
    textAlign: "center",
    fontSize: "1rem",
    background: type === "success"
      ? "linear-gradient(to right, #27ae60, #2ecc71)"
      : "linear-gradient(to right, #e74c3c, #c0392b)",
    color: "white",
    border: "none",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  });

  const viewToggleStyle = {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "1.5rem",
    justifyContent: "flex-end",
  };

  const toggleButtonStyle = (isActive) => ({
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    backgroundColor: isActive ? "#0077b5" : "#e0e0e0",
    color: isActive ? "white" : "#555",
    transition: "all 0.2s ease",
  });

  const addressCardStyle = {
    background: "white",
    border: "1px solid #e0e0e0",
    borderRadius: "10px",
    padding: "1.25rem",
    marginBottom: "1rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    transition: "all 0.2s ease",
  };

  const addressCardHoverStyle = {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    borderLeft: "4px solid #00b894",
  };

  const addressHeaderStyle = {
    fontWeight: "600",
    fontSize: "1.1rem",
    color: "#2c3e50",
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
    color: "#00b894",
    fontWeight: "600",
    fontSize: "1rem",
  };

  const addressActionButtons = {
    display: "flex",
    gap: "0.75rem",
    marginTop: "0.75rem",
    justifyContent: "flex-end",
  };

  const editBtnStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: "#0077b5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "all 0.2s ease",
  };

  const deleteBtnStyle = {
    padding: "0.5rem 1rem",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "all 0.2s ease",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    margin: "1.5rem 0",
    fontSize: "0.95rem",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    borderRadius: "10px",
    overflow: "hidden",
  };

  const thStyle = {
    padding: "1rem",
    textAlign: "left",
    backgroundColor: "#2c3e50",
    color: "white",
    fontWeight: "600",
    fontSize: "0.95rem",
  };

  const tdStyle = {
    padding: "1rem",
    borderBottom: "1px solid #ddd",
    color: "#333",
  };

  const trHoverStyle = {
    backgroundColor: "#f8f9fa",
    transition: "background-color 0.15s ease",
  };

  const loaderStyle = {
    textAlign: "center",
    padding: "60px",
    fontSize: "1.2rem",
    color: "#555",
  };

  const addButtonStyle = {
    padding: "0.75rem 1.5rem",
    background: "linear-gradient(to right, #00b894, #0077b5)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(0,184,148,0.3)",
    alignSelf: "flex-start",
  };

  // ========= RENDER =========
  if (loading && isEdit) {
    return (
      <div style={containerStyle}>
        <div style={loaderStyle}>⏳ Loading your customer data...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={pageCardStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={headerTitleStyle}>
            <span style={headerIconStyle}>💼</span> Customer Management Hub
          </h1>
        </div>

        {/* Main Content */}
        <div style={sectionStyle}>
          {message.text && <div style={alertStyle(message.type)}>{message.text}</div>}

          {/* Customer Info Form */}
          <form onSubmit={handleCustomerSubmit}>
            <h2 style={subtitleStyle}>
              <span>👤</span>Edit Customer Profile
            </h2>
            <div style={formRowStyle}>
              {[
                { label: "🔤 First Name", name: "first_name", placeholder: "John" },
                { label: "🔤 Last Name", name: "last_name", placeholder: "Doe" },
                { label: "📞 Phone Number", name: "phone_number", placeholder: "9876543210" },
                { label: "🏠 Address Details", name: "address_details", placeholder: "123 Main St, Apt 4B" },
                { label: "🏙️ City", name: "city", placeholder: "New York" },
                { label: "🗺️ State", name: "state", placeholder: "NY" },
                { label: "🔢 Pin Code", name: "pin_code", placeholder: "123456" },
              ].map((field) => (
                <div key={field.name} style={formGroupStyle}>
                  <label style={labelStyle} htmlFor={field.name}>
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    type="text"
                    name={field.name}
                    value={customerData[field.name] || ""}
                    onChange={handleCustomerChange}
                    placeholder={field.placeholder}
                    required
                    style={inputStyle(!!customerErrors[field.name])}
                  />
                  {customerErrors[field.name] && (
                    <span style={errorTextStyle}>⚠️ {customerErrors[field.name]}</span>
                  )}
                </div>
              ))}
            </div>
            <div style={buttonContainerStyle}>
              <button
                type="submit"
                style={buttonStyle("#00b894", "white", loading)}
                disabled={loading}
              >
                {loading ? "⏳ Processing..." : isEdit ? "💾 Update Profile" : "✅ Create Customer"}
              </button>
              <button
                type="button"
                style={buttonStyle("#95a5a6", "white", loading)}
                onClick={() => navigate("/")}
                disabled={loading}
              >
                🚫 Cancel & Go Back
              </button>
            </div>
          </form>

          {/* Addresses Section (Only if editing) */}
          {isEdit && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "2rem 0 1rem 0" }}>
                <h2 style={subtitleStyle}>
                  <span>🏠</span> Address Management ({addresses.length})
                </h2>
                {!isAddingAddress && !editingAddressId && (
                  <button
                    onClick={() => {
                      setIsAddingAddress(true);
                      setEditingAddressId(null);
                      setAddressForm({ address_details: "", city: "", state: "", pin_code: "" });
                    }}
                    style={addButtonStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    ➕ Add New Address
                  </button>
                )}
              </div>

              {/* Address Form (Add/Edit) */}
              {(isAddingAddress || editingAddressId) && (
                <div style={{
                  background: "linear-gradient(to right, #e3f2fd, #bbdefb)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  marginBottom: "1.5rem",
                  border: "1px dashed #00b894",
                }}>
                  <h3 style={{
                    margin: "0 0 1rem 0",
                    color: "#0077b5",
                    fontSize: "1.3rem",
                    fontWeight: "700",
                    textAlign: "center",
                  }}>
                    {editingAddressId ? "✏️ Edit Existing Address" : "✨ Create New Address"}
                  </h3>
                  <form onSubmit={handleAddressSubmit}>
                    <div style={formRowStyle}>
                      {[
                        { label: "📍 Address Details", name: "address_details", placeholder: "123 Main St, Apt 4B" },
                        { label: "🏙️ City", name: "city", placeholder: "New York" },
                        { label: "🗺️ State", name: "state", placeholder: "NY" },
                        { label: "🔢 Pin Code", name: "pin_code", placeholder: "123456" },
                      ].map((field) => (
                        <div key={field.name} style={formGroupStyle}>
                          <label style={labelStyle} htmlFor={field.name}>
                            {field.label}
                          </label>
                          <input
                            id={field.name}
                            type="text"
                            name={field.name}
                            value={addressForm[field.name] || ""}
                            onChange={handleAddressChange}
                            placeholder={field.placeholder}
                            required
                            style={inputStyle(!!addressErrors[field.name])}
                          />
                          {addressErrors[field.name] && (
                            <span style={errorTextStyle}>⚠️ {addressErrors[field.name]}</span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div style={buttonContainerStyle}>
                      <button
                        type="submit"
                        style={buttonStyle("#00b894", "white", loading)}
                        disabled={loading}
                      >
                        {loading ? "⏳ Processing..." : editingAddressId ? "🔄 Update Address" : "✅ Save Address"}
                      </button>
                      <button
                        type="button"
                        style={buttonStyle("#e74c3c", "white", loading)}
                        onClick={cancelAddressForm}
                        disabled={loading}
                      >
                        🚫 Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* View Toggle */}
              {addresses.length > 0 && !isAddingAddress && !editingAddressId && (
                <div style={viewToggleStyle}>
                  <button
                    style={toggleButtonStyle(viewMode === "card")}
                    onClick={() => setViewMode("card")}
                  >
                    🃏 Card View
                  </button>
                  <button
                    style={toggleButtonStyle(viewMode === "table")}
                    onClick={() => setViewMode("table")}
                  >
                    📊 Table View
                  </button>
                </div>
              )}

              {/* Address List */}
              {addresses.length === 0 && !isAddingAddress && !editingAddressId ? (
                <div style={{
                  textAlign: "center",
                  color: "#7f8c8d",
                  padding: "2rem",
                  fontSize: "1.1rem",
                  background: "#f8f9fa",
                  borderRadius: "12px",
                  border: "2px dashed #bdc3c7",
                }}>
                  🗺️ No addresses found. Click "Add New Address" to get started!
                </div>
              ) : viewMode === "card" ? (
                <div>
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      style={addressCardStyle}
                      onMouseEnter={(e) => {
                        e.currentTarget.style = {...addressCardStyle, ...addressCardHoverStyle};
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style = addressCardStyle;
                      }}
                    >
                      <div style={addressHeaderStyle}>
                        🏠 {address.city}, {address.state}
                      </div>
                      <div style={addressDetailStyle}>
                        {address.address_details}
                      </div>
                      <div style={addressPinStyle}>
                        📬 PIN: {address.pin_code}
                      </div>
                      <div style={addressActionButtons}>
                        <button
                          style={editBtnStyle}
                          onClick={() => startEditingAddress(address)}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px) scale(1.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
                        >
                          ✏️ Edit Address
                        </button>
                        <button
                          style={deleteBtnStyle}
                          onClick={() => handleDeleteAddress(address.id)}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px) scale(1.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
                        >
                          🗑️ Delete Address
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={tableStyle}>
                    <thead>
                      <tr>
                        <th style={thStyle}>📍 Address</th>
                        <th style={thStyle}>🏙️ City</th>
                        <th style={thStyle}>🗺️ State</th>
                        <th style={thStyle}>🔢 PIN</th>
                        <th style={thStyle}>⚙️ Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addresses.map((address) => (
                        <tr
                          key={address.id}
                          style={trHoverStyle}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                        >
                          <td style={tdStyle}>{address.address_details}</td>
                          <td style={tdStyle}>{address.city}</td>
                          <td style={tdStyle}>{address.state}</td>
                          <td style={tdStyle}>{address.pin_code}</td>
                          <td style={tdStyle}>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button
                                style={{
                                  ...editBtnStyle,
                                  padding: "0.5rem 1rem",
                                  fontSize: "0.85rem",
                                }}
                                onClick={() => startEditingAddress(address)}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                style={{
                                  ...deleteBtnStyle,
                                  padding: "0.5rem 1rem",
                                  fontSize: "0.85rem",
                                }}
                                onClick={() => handleDeleteAddress(address.id)}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Global Animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.8; }
          100% { opacity: 1; }
        }
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important;
        }
        input:focus {
          border-color: #00b894 !important;
          box-shadow: 0 0 0 3px rgba(0,184,148,0.1) !important;
        }
      `}</style>
    </div>
  );
}

export default CustomerFormPage;