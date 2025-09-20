import React from 'react';

const AddressList = ({ addresses }) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ color: '#333', marginBottom: '15px' }}>Addresses</h3>
      {addresses.length === 0 ? (
        <p style={{ color: '#777', fontStyle: 'italic' }}>No addresses found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 3px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Address</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>City</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>State</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>PIN</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map(address => (
                <tr
                  key={address.id}
                  style={{
                    borderBottom: '1px solid #ddd',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <td style={{ padding: '12px' }}>{address.address_details}</td>
                  <td style={{ padding: '12px' }}>{address.city}</td>
                  <td style={{ padding: '12px' }}>{address.state}</td>
                  <td style={{ padding: '12px' }}>{address.pin_code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AddressList;
