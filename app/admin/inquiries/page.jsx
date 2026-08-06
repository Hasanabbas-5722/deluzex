"use client";

import React, { useEffect, useState } from "react";
import styles from "../admin.module.css";
import { fetchInquiries } from "../../services/api";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInquiries = async () => {
    setLoading(true);
    const data = await fetchInquiries();
    setInquiries(data);
    setLoading(false);
  };
  
  useEffect(() => {
    loadInquiries();
  }, []);


  return (
    <div className={styles.sectionContainer}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.sectionTitle}>Inquiries Management</h2>
          <p className={styles.sectionSubtitle}>View and manage customer contact messages.</p>
        </div>
      </div>

      <div className={styles.card}>
        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>Loading inquiries...</p>
        ) : inquiries.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center' }}>No inquiries found.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact Info</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq._id}>
                    <td style={{ fontWeight: 600 }}>{inq.name}</td>
                    <td>
                      <div>{inq.email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>{inq.phone || 'N/A'}</div>
                    </td>
                    <td style={{ maxWidth: '300px' }}>
                      <div style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical' 
                      }}>
                        {inq.message}
                      </div>
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                      {/* formate will be dd/mm/yyyy */}
                      {inq.created_at ? new Date(inq.created_at).getDate() + '/' + (new Date(inq.created_at).getMonth() + 1) + '/' + new Date(inq.created_at).getFullYear() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
