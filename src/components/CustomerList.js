import React from 'react';
import { Link } from 'react-router-dom';

const CustomerList = ({ customers }) => {
  return (
    <div style={{ overflowX: 'auto', marginTop: '20px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 3px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>First Name</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Last Name</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(customer => (
            <tr
              key={customer.id}
              style={{
                borderBottom: '1px solid #ddd',
                transition: 'background-color 0.2s',
                ':hover': { backgroundColor: '#f5f5f5' }
              }}
            >
              <td style={{ padding: '12px' }}>{customer.id}</td>
              <td style={{ padding: '12px' }}>{customer.first_name}</td>
              <td style={{ padding: '12px' }}>{customer.last_name}</td>
              <td style={{ padding: '12px' }}>{customer.phone_number}</td>
              <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                <Link
                  to={`/customers/${customer.id}`}
                  style={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    padding: '6px 10px',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    marginRight: '5px',
                    fontSize: '14px'
                  }}
                >
                  View
                </Link>
                <Link
                  to={`/customers/${customer.id}/edit`}
                  style={{
                    backgroundColor: '#f39c12',
                    color: 'white',
                    padding: '6px 10px',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
