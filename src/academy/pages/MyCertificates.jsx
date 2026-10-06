import React, { useState, useEffect } from 'react';
import ElearningAPI from '../../services/elearningApi';
import {
  Award,
  Download,
  ExternalLink,
  CheckCircle,
  Calendar,
  Shield,
  ArrowRight
} from 'lucide-react';

export const MyCertificates = ({ onNavigate, onVerifyCertificate }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ElearningAPI.getMyCertificates()
      .then(res => {
        if (res.success) setCertificates(res.certificates || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div>
        <div style={{ width: '36px', height: '4px', backgroundColor: '#10B981', borderRadius: '2px', marginBottom: '8px' }} />
        <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFF', fontFamily: "'Outfit', sans-serif", textTransform: 'uppercase' }}>
          OFFICIAL ACADEMY CERTIFICATES
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '4px' }}>
          Official digital diplomas issued by the Technical Directorate of DX Football Academy.
        </p>
      </div>

      {loading ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
          Loading your certificates...
        </div>
      ) : certificates.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
          <Award size={44} color="#d6bc66" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ color: '#FFF', fontSize: '1.2rem', fontWeight: '800' }}>No Certificates Issued Yet</h3>
          <p style={{ fontSize: '0.85rem', maxWidth: '500px', margin: '6px auto 1.5rem auto' }}>
            Complete 100% of all required modules in your enrolled program to submit your coursework for board certification approval.
          </p>
          <button onClick={() => onNavigate('DASHBOARD')} className="btn-gold" style={{ padding: '10px 22px', fontSize: '0.85rem' }}>
            Go to My Courses
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem'
        }}>
          {certificates.map(cert => (
            <div
              key={cert._id}
              className="glass-panel interactive-card"
              style={{
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.5rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '900',
                    padding: '3px 10px',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10B981',
                    border: '1px solid #10B981'
                  }}>
                    ✓ STATUS: VALID
                  </span>

                  <span style={{ fontSize: '0.78rem', color: '#d6bc66', fontWeight: '900', fontFamily: 'monospace' }}>
                    {cert.certificateId}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFF', lineHeight: 1.25, marginBottom: '0.5rem' }}>
                  {cert.programTitle}
                </h3>

                <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '1rem' }}>
                  Recipient: <strong style={{ color: '#FFF' }}>{cert.studentName}</strong>
                </div>

                <div style={{
                  background: 'rgba(0, 7, 38, 0.6)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  color: '#CBD5E1',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div>Date Issued: {new Date(cert.issuedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  <div>Certified By: {cert.signatoryName} ({cert.signatoryTitle})</div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href={ElearningAPI.downloadCertificateUrl(cert.certificateId)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-gold"
                  style={{ flex: 1, padding: '10px', fontSize: '0.8rem', justifyContent: 'center' }}
                >
                  <Download size={14} />
                  <span>DOWNLOAD PDF</span>
                </a>

                <button
                  onClick={() => onVerifyCertificate(cert.certificateId)}
                  className="btn-outline-gold"
                  style={{ padding: '10px 14px', fontSize: '0.8rem' }}
                >
                  <ExternalLink size={14} />
                  <span>VERIFY</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCertificates;
