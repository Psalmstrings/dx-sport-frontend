import React, { useState, useEffect } from 'react';
import ElearningAPI from '../../services/elearningApi';
import {
  Award,
  CheckCircle,
  AlertTriangle,
  Search,
  Shield,
  ArrowLeft,
  Calendar,
  User,
  BookOpen
} from 'lucide-react';

export const VerifyCertificate = ({ initialCertificateId = '', onBack }) => {
  const [certIdInput, setCertIdInput] = useState(initialCertificateId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialCertificateId) {
      performVerification(initialCertificateId);
    }
  }, [initialCertificateId]);

  const performVerification = async (idToVerify) => {
    if (!idToVerify) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await ElearningAPI.verifyCertificate(idToVerify);
      setResult(res);
    } catch (err) {
      setResult({
        valid: false,
        message: err.response?.data?.message || 'Certificate verification record not found.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performVerification(certIdInput.trim());
  };

  return (
    <div style={{ maxWidth: '700px', margin: '1.5rem auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#d6bc66', fontWeight: '800', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>BACK TO ACADEMY</span>
        </button>
      )}

      {/* Verification Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(214, 188, 102, 0.15)',
          border: '2px solid #d6bc66',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px auto'
        }}>
          <Shield size={32} color="#d6bc66" />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#FFF', fontFamily: "'Outfit', sans-serif" }}>
          CERTIFICATE AUTHENTICATION PORTAL
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.88rem', maxWidth: '520px', margin: '6px auto 0 auto' }}>
          Official online verification system for football coaching diplomas and credentials issued by DX Football Academy.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={certIdInput}
          onChange={(e) => setCertIdInput(e.target.value)}
          placeholder="Enter Certificate ID (e.g. FA-2026-000001)"
          className="form-control"
          style={{ fontSize: '1rem', padding: '12px 16px' }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-gold"
          style={{ padding: '0 24px', flexShrink: 0, fontSize: '0.88rem' }}
        >
          <Search size={16} />
          <span>{loading ? 'VERIFYING...' : 'VERIFY'}</span>
        </button>
      </form>

      {/* Verification Result Card */}
      {searched && (
        <div>
          {loading ? (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>
              Querying academy ledger records...
            </div>
          ) : result?.valid && result?.certificate ? (
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 11, 61, 0.95) 0%, rgba(5, 20, 84, 0.98) 100%)',
              borderRadius: '20px',
              border: '2px solid #10B981',
              boxShadow: '0 10px 40px rgba(16, 185, 129, 0.25)',
              padding: '2.5rem',
              position: 'relative'
            }}>
              {/* Authenticity Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10B981',
                padding: '6px 14px',
                borderRadius: '20px',
                color: '#10B981',
                fontWeight: '900',
                fontSize: '0.85rem',
                marginBottom: '1.5rem'
              }}>
                <CheckCircle size={18} />
                <span>OFFICIALLY VERIFIED & AUTHENTIC</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '800' }}>CERTIFICATE ID</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#d6bc66', fontFamily: 'monospace' }}>
                    {result.certificate.certificateId}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '800' }}>RECIPIENT NAME</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFF' }}>
                    {result.certificate.studentName}
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '800' }}>PROGRAM COMPLETED</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#F0D98C' }}>
                    {result.certificate.programTitle}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>
                    Program Tier: {result.certificate.programLevel} Level
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '800' }}>DATE ISSUED</div>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#FFF' }}>
                    {new Date(result.certificate.issuedDate).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '800' }}>AUTHORIZED SIGNATORY</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#CBD5E1' }}>
                    {result.certificate.signatoryName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                    {result.certificate.signatoryTitle}
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: '2rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                fontSize: '0.75rem',
                color: '#94A3B8',
                textAlign: 'center'
              }}>
                This digital diploma is registered under the authoritative seal of DX Football Academy.
              </div>
            </div>
          ) : (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid #EF4444',
              borderRadius: '16px',
              padding: '2.5rem',
              textAlign: 'center'
            }}>
              <AlertTriangle size={36} color="#EF4444" style={{ margin: '0 auto 8px auto' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#FFF' }}>
                Invalid or Unrecognized Certificate
              </h3>
              <p style={{ color: '#CBD5E1', fontSize: '0.85rem', maxWidth: '480px', margin: '6px auto 0 auto' }}>
                {result?.message || 'The specified ID does not correspond to any valid credential issued by the DX Football Academy Technical Directorate.'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;
