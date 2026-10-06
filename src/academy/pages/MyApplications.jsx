import React, { useState, useEffect } from 'react';
import ElearningAPI from '../../services/elearningApi';
import {
  FileText,
  DollarSign,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  X
} from 'lucide-react';

export const MyApplications = ({ onNavigate }) => {
  const [applications, setApplications] = useState([]);
  const [bankInfo, setBankInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadModalApp, setUploadModalApp] = useState(null);

  // Upload Form state
  const [receiptFile, setReceiptFile] = useState(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      ElearningAPI.getMyApplications(),
      ElearningAPI.getPublicSettings()
    ])
      .then(([appRes, setRes]) => {
        if (appRes.success) setApplications(appRes.applications || []);
        if (setRes.success) setBankInfo(setRes.payment);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!receiptFile) {
      setUploadError('Please select a payment receipt or screenshot.');
      return;
    }

    try {
      setUploading(true);
      setUploadError('');
      const formData = new FormData();
      formData.append('receipt', receiptFile);
      if (transactionRef) formData.append('transactionReference', transactionRef);
      if (paymentDate) formData.append('paymentDate', paymentDate);
      if (notes) formData.append('paymentNotes', notes);

      const res = await ElearningAPI.uploadReceipt(uploadModalApp._id, formData);
      if (res.success) {
        setUploadSuccess('Payment receipt uploaded successfully! Admissions will verify your transfer.');
        setTimeout(() => {
          setUploadModalApp(null);
          setUploadSuccess('');
          setReceiptFile(null);
          setTransactionRef('');
          loadData();
        }, 1500);
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Page Header */}
      <div>
        <div style={{ width: '36px', height: '4px', backgroundColor: '#d6bc66', borderRadius: '2px', marginBottom: '8px' }} />
        <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFF', fontFamily: "'Outfit', sans-serif", textTransform: 'uppercase' }}>
          MY PROGRAM APPLICATIONS
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '4px' }}>
          Track application reviews, view bank transfer details, and upload proof of tuition payment.
        </p>
      </div>

      {/* Official Bank Account Details Card */}
      {bankInfo && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(5, 20, 84, 0.95) 0%, rgba(0, 11, 61, 0.98) 100%)',
          padding: '1.75rem',
          borderRadius: '16px',
          border: '1px solid rgba(214, 188, 102, 0.35)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <DollarSign size={20} color="#d6bc66" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#FFF', margin: 0 }}>
              OFFICIAL ACADEMY TUITION ACCOUNT
            </h3>
          </div>
          <p style={{ color: '#CBD5E1', fontSize: '0.82rem', marginBottom: '1rem', lineHeight: 1.5 }}>
            {bankInfo.instructions}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            background: 'rgba(0, 7, 38, 0.8)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700' }}>BANK NAME</div>
              <div style={{ fontSize: '1rem', fontWeight: '900', color: '#FFF' }}>{bankInfo.bankName}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700' }}>ACCOUNT NAME</div>
              <div style={{ fontSize: '1rem', fontWeight: '900', color: '#FFF' }}>{bankInfo.accountName}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700' }}>ACCOUNT NUMBER</div>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#d6bc66', fontFamily: 'monospace' }}>
                {bankInfo.accountNumber}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applications List */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
          Loading your applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
          <FileText size={40} color="#d6bc66" style={{ margin: '0 auto 10px auto' }} />
          <h3 style={{ color: '#FFF', fontSize: '1.1rem', fontWeight: '800' }}>No Applications Yet</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '4px', marginBottom: '1.5rem' }}>
            Choose an accredited football coaching diploma program and submit your application.
          </p>
          <button onClick={() => onNavigate('PROGRAMS')} className="btn-gold" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>
            Browse Programs
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {applications.map(app => (
            <div
              key={app._id}
              className="glass-panel"
              style={{
                padding: '1.75rem',
                borderRadius: '16px',
                border: '1px solid rgba(214, 188, 102, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.25rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: '900', color: '#d6bc66', fontFamily: 'monospace' }}>
                    {app.applicationId}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: app.status === 'Approved' ? 'rgba(16, 185, 129, 0.2)' : app.status === 'Pending' ? 'rgba(245, 158, 11, 0.2)' : app.status === 'Rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(214, 188, 102, 0.2)',
                    color: app.status === 'Approved' ? '#10B981' : app.status === 'Pending' ? '#F59E0B' : app.status === 'Rejected' ? '#EF4444' : '#d6bc66',
                    border: '1px solid currentColor'
                  }}>
                    {app.status.toUpperCase()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FFF', margin: '4px 0' }}>
                  {app.program?.title}
                </h3>

                <div style={{ fontSize: '0.82rem', color: '#94A3B8', display: 'flex', gap: '16px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <span>Tuition: <strong style={{ color: '#FFF' }}>{app.currency} {app.amount?.toLocaleString()}</strong></span>
                  <span>Submitted: {new Date(app.createdAt).toLocaleDateString()}</span>
                  {app.receiptUploadedAt && (
                    <span style={{ color: '#10B981' }}>✓ Receipt uploaded</span>
                  )}
                </div>

                {app.rejectionReason && (
                  <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#EF4444' }}>
                    <strong>Rejection reason:</strong> {app.rejectionReason}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {(app.status === 'Payment Verification Required' || app.status === 'Pending') && (
                  <button
                    onClick={() => setUploadModalApp(app)}
                    className="btn-gold"
                    style={{ padding: '9px 18px', fontSize: '0.82rem' }}
                  >
                    <Upload size={14} />
                    <span>{app.receiptUploadedAt ? 'RE-UPLOAD RECEIPT' : 'UPLOAD PAYMENT RECEIPT'}</span>
                  </button>
                )}

                {app.status === 'Approved' && (
                  <button
                    onClick={() => onNavigate('DASHBOARD')}
                    className="btn-outline-gold"
                    style={{ padding: '9px 18px', fontSize: '0.82rem' }}
                  >
                    <span>GO TO LEARNING</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Receipt Modal */}
      {uploadModalApp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid #d6bc66',
            position: 'relative'
          }}>
            <button
              onClick={() => setUploadModalApp(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', color: '#94A3B8' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFF', marginBottom: '4px' }}>
              Upload Payment Evidence
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '1.25rem' }}>
              Application ID: <strong style={{ color: '#d6bc66' }}>{uploadModalApp.applicationId}</strong> — {uploadModalApp.program?.title}
            </p>

            {uploadError && (
              <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.15)', border: '1px solid #EF4444', color: '#FCA5A5', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.15)', border: '1px solid #10B981', color: '#6EE7B7', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {uploadSuccess}
              </div>
            )}

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '6px' }}>
                  PAYMENT RECEIPT / SCREENSHOT *
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => setReceiptFile(e.target.files[0])}
                  className="form-control"
                  required
                />
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>JPG, PNG, or PDF (Max 10MB)</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '6px' }}>
                  TRANSACTION REFERENCE NUMBER (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. ZENITH-TRF-987654321"
                  className="form-control"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '6px' }}>
                  DATE OF PAYMENT
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="form-control"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="btn-gold"
                style={{ padding: '12px', marginTop: '0.5rem', width: '100%', fontSize: '0.88rem' }}
              >
                <span>{uploading ? 'UPLOADING RECEIPT...' : 'SUBMIT PAYMENT EVIDENCE'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
