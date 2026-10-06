import React, { useState, useEffect } from 'react';
import ElearningAPI from '../../../services/elearningApi';
import {
  Shield,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  BookOpen,
  Award,
  Clock,
  Settings,
  Search,
  Check,
  X,
  ExternalLink,
  Plus,
  RefreshCw,
  Eye,
  AlertTriangle,
  Download
} from 'lucide-react';

export const AdminDashboard = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW' | 'APPLICATIONS' | 'PROGRAMS' | 'ENROLLMENTS' | 'CERTIFICATES' | 'SETTINGS'
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Data states for subtabs
  const [applications, setApplications] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [settings, setSettings] = useState(null);

  // Action Modals / Forms
  const [selectedApp, setSelectedApp] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Extend Access Modal
  const [extendModalEnrollment, setExtendModalEnrollment] = useState(null);
  const [extendDays, setExtendDays] = useState(14);
  const [extendReason, setExtendReason] = useState('');

  // Create Program Modal
  const [showCreateProgramModal, setShowCreateProgramModal] = useState(false);
  const [newProgram, setNewProgram] = useState({
    title: '',
    level: 'Beginner',
    price: 25000,
    currency: 'NGN',
    duration: '4 Weeks',
    accessDurationDays: 30,
    description: '',
    requirements: '',
    objectives: ''
  });

  // Settings form
  const [savingSettings, setSavingSettings] = useState(false);
  const [bankForm, setBankForm] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    instructions: ''
  });

  const loadAllAdminData = () => {
    setLoading(true);
    Promise.all([
      ElearningAPI.getDashboardStats(),
      ElearningAPI.getAdminApplications({ limit: 50 }),
      ElearningAPI.getAdminPrograms(),
      ElearningAPI.getAdminEnrollments({ limit: 50 }),
      ElearningAPI.getAdminCertificates({ limit: 50 }),
      ElearningAPI.getAdminSettings()
    ])
      .then(([statsRes, appRes, progRes, enRes, certRes, setRes]) => {
        if (statsRes.success) {
          setStats(statsRes.stats);
          setRecentActivity(statsRes.recentActivity || []);
        }
        if (appRes.success) setApplications(appRes.applications || []);
        if (progRes.success) setPrograms(progRes.programs || []);
        if (enRes.success) setEnrollments(enRes.enrollments || []);
        if (certRes.success) setCertificates(certRes.certificates || []);
        if (setRes.success && setRes.settings) {
          setSettings(setRes.settings);
          if (setRes.settings.payment) setBankForm(setRes.settings.payment);
        }
      })
      .catch(err => {
        console.error('Error loading admin data:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // --- Actions ---
  const handleApproveApplication = async (appId) => {
    try {
      setProcessingAction(true);
      const res = await ElearningAPI.approveApplication(appId, adminNotes);
      if (res.success) {
        setFeedback({ type: 'success', text: 'Application approved! 30-day course enrollment created.' });
        setSelectedApp(null);
        setAdminNotes('');
        loadAllAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Approval failed' });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleRejectApplication = async (appId) => {
    if (!rejectionReason) {
      alert('Please specify a rejection reason.');
      return;
    }
    try {
      setProcessingAction(true);
      const res = await ElearningAPI.rejectApplication(appId, rejectionReason, adminNotes);
      if (res.success) {
        setFeedback({ type: 'success', text: 'Application rejected.' });
        setSelectedApp(null);
        setRejectionReason('');
        loadAllAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Rejection failed' });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleExtendAccessSubmit = async (e) => {
    e.preventDefault();
    try {
      setProcessingAction(true);
      const res = await ElearningAPI.extendAccess(extendModalEnrollment._id, {
        days: extendDays,
        reason: extendReason
      });
      if (res.success) {
        setFeedback({ type: 'success', text: res.message });
        setExtendModalEnrollment(null);
        loadAllAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Extension failed' });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleApproveCertificate = async (enrollmentId) => {
    if (!window.confirm('Approve and generate official PDF certificate for this student?')) return;
    try {
      setProcessingAction(true);
      const res = await ElearningAPI.approveCertificate(enrollmentId);
      if (res.success) {
        setFeedback({ type: 'success', text: `Certificate ${res.certificate.certificateId} generated and issued!` });
        loadAllAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Certification approval failed' });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleCreateProgramSubmit = async (e) => {
    e.preventDefault();
    try {
      setProcessingAction(true);
      const res = await ElearningAPI.createProgram(newProgram);
      if (res.success) {
        setFeedback({ type: 'success', text: 'Program created successfully!' });
        setShowCreateProgramModal(false);
        loadAllAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Program creation failed' });
    } finally {
      setProcessingAction(false);
    }
  };

  const handleSaveBankSettings = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      await ElearningAPI.updateSetting('payment', bankForm);
      setFeedback({ type: 'success', text: 'Bank payment details updated successfully.' });
      loadAllAdminData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Failed to update settings' });
    } finally {
      setSavingSettings(false);
    }
  };

  const subTabs = [
    { id: 'OVERVIEW', label: 'OVERVIEW', icon: Shield },
    { id: 'APPLICATIONS', label: `APPLICATIONS (${stats?.pendingApplications || 0} PENDING)`, icon: FileText },
    { id: 'PROGRAMS', label: `PROGRAMS (${programs.length})`, icon: BookOpen },
    { id: 'ENROLLMENTS', label: `ENROLLMENTS (${enrollments.length})`, icon: Users },
    { id: 'CERTIFICATES', label: `CERTIFICATES (${stats?.readyForReviewCount ? `${stats.readyForReviewCount} PENDING REVIEW` : certificates.length})`, icon: Award },
    { id: 'SETTINGS', label: 'SETTINGS', icon: Settings }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Admin Title Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 11, 61, 0.95) 0%, rgba(5, 20, 84, 0.9) 100%)',
        padding: '2rem',
        borderRadius: '20px',
        border: '1px solid rgba(214, 188, 102, 0.4)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#EF4444', background: 'rgba(239,68,68,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
            STAFF ONLY
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFF', fontFamily: "'Outfit', sans-serif", margin: '4px 0' }}>
            Academy Administrative Portal
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            Manage admissions, verify tuition receipts, oversee 30-day enrollments, and authorize official certifications.
          </p>
        </div>

        <button
          onClick={loadAllAdminData}
          className="btn-outline-gold"
          style={{ padding: '8px 16px', fontSize: '0.8rem' }}
        >
          <RefreshCw size={14} />
          <span>REFRESH DATA</span>
        </button>
      </div>

      {/* Global Action Feedback Alert */}
      {feedback && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '8px',
          background: feedback.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
          border: feedback.type === 'error' ? '1px solid #EF4444' : '1px solid #10B981',
          color: feedback.type === 'error' ? '#FCA5A5' : '#6EE7B7',
          fontSize: '0.88rem',
          fontWeight: '700',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} style={{ color: 'inherit' }}><X size={16} /></button>
        </div>
      )}

      {/* Admin Tab Controls */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
        {subTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: isActive ? '#000b3d' : '#d6bc66',
                background: isActive ? '#d6bc66' : 'rgba(5, 20, 84, 0.7)',
                border: '1px solid rgba(214, 188, 102, 0.3)',
                transition: 'all 0.15s'
              }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 1. OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Statistics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem'
          }}>
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '800' }}>TOTAL STUDENTS</div>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#FFF', fontFamily: "'Outfit', sans-serif" }}>
                {stats?.totalStudents || 0}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10B981' }}>Active: {stats?.activeStudents || 0}</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid #F59E0B' }}>
              <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: '800' }}>PENDING APPLICATIONS</div>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#F59E0B', fontFamily: "'Outfit', sans-serif" }}>
                {stats?.pendingApplications || 0}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Awaiting verification</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '800' }}>ACTIVE ENROLLMENTS</div>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#d6bc66', fontFamily: "'Outfit', sans-serif" }}>
                {stats?.activeEnrollments || 0}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>30-day course access</div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid #10B981' }}>
              <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '800' }}>CERTIFIED STUDENTS</div>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#10B981', fontFamily: "'Outfit', sans-serif" }}>
                {stats?.certifiedStudents || 0}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#FCD34D' }}>
                {stats?.readyForReviewCount || 0} Pending Review
              </div>
            </div>
          </div>

          {/* Quick Action Queue Alerts */}
          {stats?.readyForReviewCount > 0 && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid #F59E0B',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontWeight: '900', color: '#FCD34D', fontSize: '1rem' }}>
                  Action Needed: {stats.readyForReviewCount} Student(s) Completed Coursework
                </div>
                <div style={{ color: '#CBD5E1', fontSize: '0.82rem' }}>
                  Students have completed 100% of their curriculum and are waiting for you to approve their official certificates.
                </div>
              </div>
              <button
                onClick={() => setActiveTab('CERTIFICATES')}
                className="btn-gold"
                style={{ padding: '8px 16px', fontSize: '0.8rem' }}
              >
                Review Certifications
              </button>
            </div>
          )}

          {/* Recent Activity Audit Log */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#FFF', marginBottom: '1rem' }}>
              RECENT ADMINISTRATIVE AUDIT TRAIL
            </h3>
            {recentActivity.length === 0 ? (
              <div style={{ color: '#94A3B8', fontSize: '0.85rem' }}>No recent admin actions recorded.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentActivity.map(act => (
                  <div key={act._id} style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.03)',
                    fontSize: '0.82rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <strong style={{ color: '#d6bc66' }}>{act.action}</strong> — {act.targetEntity}
                      <span style={{ color: '#94A3B8', marginLeft: '8px' }}>
                        by {act.admin?.fullName || 'Admin'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                      {new Date(act.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. APPLICATIONS MANAGEMENT */}
      {activeTab === 'APPLICATIONS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(5, 20, 84, 0.9)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '12px 16px', color: '#94A3B8' }}>APP ID</th>
                    <th style={{ padding: '12px 16px', color: '#94A3B8' }}>STUDENT</th>
                    <th style={{ padding: '12px 16px', color: '#94A3B8' }}>PROGRAM</th>
                    <th style={{ padding: '12px 16px', color: '#94A3B8' }}>AMOUNT</th>
                    <th style={{ padding: '12px 16px', color: '#94A3B8' }}>RECEIPT</th>
                    <th style={{ padding: '12px 16px', color: '#94A3B8' }}>STATUS</th>
                    <th style={{ padding: '12px 16px', color: '#94A3B8', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '800', color: '#d6bc66', fontFamily: 'monospace' }}>
                        {app.applicationId}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#FFF' }}>
                        <div style={{ fontWeight: '800' }}>{app.student?.fullName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{app.student?.email}</div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#CBD5E1', fontWeight: '700' }}>
                        {app.program?.title}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#FFF' }}>
                        {app.currency} {app.amount?.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {app.receiptFile ? (
                          <a
                            href={`http://localhost:5001/${app.receiptFile}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#d6bc66', fontWeight: '800', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Eye size={14} />
                            <span>View Proof</span>
                          </a>
                        ) : (
                          <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>No receipt</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: app.status === 'Approved' ? 'rgba(16, 185, 129, 0.2)' : app.status === 'Pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: app.status === 'Approved' ? '#10B981' : app.status === 'Pending' ? '#F59E0B' : '#EF4444'
                        }}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        {app.status !== 'Approved' && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                            <button
                              onClick={() => { setSelectedApp(app); setAdminNotes(''); }}
                              className="btn-gold"
                              style={{ padding: '5px 12px', fontSize: '0.75rem' }}
                            >
                              Review & Approve
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Review & Approve Application Modal */}
      {selectedApp && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
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
            borderRadius: '16px',
            border: '1px solid #d6bc66'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FFF', marginBottom: '0.5rem' }}>
              Admissions Review: {selectedApp.applicationId}
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Student: <strong>{selectedApp.student?.fullName}</strong> ({selectedApp.student?.email})<br />
              Program: <strong>{selectedApp.program?.title}</strong><br />
              Tuition: <strong>{selectedApp.currency} {selectedApp.amount?.toLocaleString()}</strong>
            </p>

            {selectedApp.receiptFile && (
              <div style={{ marginBottom: '1rem' }}>
                <a
                  href={`http://localhost:5001/${selectedApp.receiptFile}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline-gold"
                  style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'inline-flex' }}
                >
                  <Eye size={14} />
                  <span>Inspect Uploaded Receipt File</span>
                </a>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '4px' }}>
                  ADMINISTRATIVE NOTES (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Verified Zenith Bank credit alert"
                  className="form-control"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '4px' }}>
                  REJECTION REASON (IF REJECTING)
                </label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Unclear receipt or invalid amount"
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
                <button
                  onClick={() => handleApproveApplication(selectedApp._id)}
                  disabled={processingAction}
                  className="btn-gold"
                  style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                >
                  <Check size={16} />
                  <span>{processingAction ? 'APPROVING...' : 'APPROVE (ACTIVATE 30-DAY ACCESS)'}</span>
                </button>
                <button
                  onClick={() => handleRejectApplication(selectedApp._id)}
                  disabled={processingAction}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    background: '#EF4444',
                    color: '#FFF',
                    fontWeight: '800',
                    fontSize: '0.85rem'
                  }}
                >
                  <X size={16} />
                  <span>REJECT</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                style={{ color: '#94A3B8', fontSize: '0.8rem', marginTop: '4px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. PROGRAMS MANAGEMENT */}
      {activeTab === 'PROGRAMS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFF' }}>
              ACCREDITED PROGRAMS DIRECTORY
            </h2>
            <button
              onClick={() => setShowCreateProgramModal(true)}
              className="btn-gold"
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            >
              <Plus size={16} />
              <span>CREATE NEW PROGRAM</span>
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.25rem'
          }}>
            {programs.map(prog => (
              <div key={prog._id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '14px', border: '1px solid rgba(214,188,102,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '900', color: '#d6bc66' }}>
                    {prog.level.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: prog.status === 'published' ? '#10B981' : '#F59E0B' }}>
                    ● {prog.status.toUpperCase()}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#FFF', marginBottom: '8px' }}>
                  {prog.title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '1rem' }}>
                  Tuition: <strong>{prog.currency} {prog.price?.toLocaleString()}</strong> • Duration: {prog.duration}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      alert(`To edit modules and lessons for "${prog.title}", use the lesson creation API or future visual builder.`);
                    }}
                    className="btn-outline-gold"
                    style={{ flex: 1, padding: '6px 12px', fontSize: '0.75rem', justifyContent: 'center' }}
                  >
                    <span>Curriculum ({prog.slug})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Program Modal */}
      {showCreateProgramModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '560px',
            width: '100%',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid #d6bc66'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFF', marginBottom: '1rem' }}>
              Create New Academy Program
            </h3>

            <form onSubmit={handleCreateProgramSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '4px' }}>
                  PROGRAM TITLE *
                </label>
                <input
                  type="text"
                  value={newProgram.title}
                  onChange={(e) => setNewProgram({ ...newProgram, title: e.target.value })}
                  placeholder="e.g. Advanced Goalkeeping & Video Analysis"
                  className="form-control"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '4px' }}>
                    LEVEL
                  </label>
                  <select
                    value={newProgram.level}
                    onChange={(e) => setNewProgram({ ...newProgram, level: e.target.value })}
                    className="form-control"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '4px' }}>
                    TUITION (NGN) *
                  </label>
                  <input
                    type="number"
                    value={newProgram.price}
                    onChange={(e) => setNewProgram({ ...newProgram, price: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '4px' }}>
                  DESCRIPTION *
                </label>
                <textarea
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                  rows={3}
                  className="form-control"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
                <button type="submit" disabled={processingAction} className="btn-gold" style={{ flex: 1, padding: '10px' }}>
                  <span>{processingAction ? 'CREATING...' : 'PUBLISH PROGRAM'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateProgramModal(false)}
                  className="btn-outline-gold"
                  style={{ padding: '10px 18px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. ENROLLMENTS & ACCESS EXTENSIONS */}
      {activeTab === 'ENROLLMENTS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFF' }}>
            STUDENT ENROLLMENTS & ACCESS DURATION
          </h2>

          <div className="glass-panel" style={{ borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(5, 20, 84, 0.9)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '12px 16px', color: '#94A3B8' }}>STUDENT</th>
                    <th style={{ padding: '12px 16px', color: '#94A3B8' }}>PROGRAM</th>
                    <th style={{ padding: '12px 16px', color: '#94A3B8' }}>PROGRESS</th>
                    <th style={{ padding: '12px 16px', color: '#94A3B8' }}>ACCESS EXPIRY</th>
                    <th style={{ padding: '12px 16px', color: '#94A3B8' }}>STATUS</th>
                    <th style={{ padding: '12px 16px', color: '#94A3B8', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map(en => {
                    const isStillActive = en.status === 'active' && new Date(en.accessExpiryDate) > new Date();
                    return (
                      <tr key={en._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px 16px', color: '#FFF' }}>
                          <div style={{ fontWeight: '800' }}>{en.student?.fullName}</div>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{en.student?.email}</div>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#CBD5E1', fontWeight: '700' }}>
                          {en.program?.title}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#d6bc66', fontWeight: '900' }}>
                          {en.progressPercentage}% ({en.completionStatus})
                        </td>
                        <td style={{ padding: '12px 16px', color: isStillActive ? '#CBD5E1' : '#EF4444' }}>
                          {new Date(en.accessExpiryDate).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: isStillActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: isStillActive ? '#10B981' : '#EF4444'
                          }}>
                            {isStillActive ? 'ACTIVE' : 'EXPIRED'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => { setExtendModalEnrollment(en); setExtendDays(14); setExtendReason(''); }}
                            className="btn-outline-gold"
                            style={{ padding: '5px 12px', fontSize: '0.75rem' }}
                          >
                            Extend Access
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Extend Access Modal */}
      {extendModalEnrollment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '460px',
            width: '100%',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid #d6bc66'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FFF', marginBottom: '0.5rem' }}>
              Extend Course Access
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Student: <strong>{extendModalEnrollment.student?.fullName}</strong><br />
              Program: <strong>{extendModalEnrollment.program?.title}</strong><br />
              Current Expiry: <strong>{new Date(extendModalEnrollment.accessExpiryDate).toLocaleDateString()}</strong>
            </p>

            <form onSubmit={handleExtendAccessSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '4px' }}>
                  EXTENSION DURATION
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[7, 14, 30].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setExtendDays(d)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        color: extendDays === d ? '#000b3d' : '#d6bc66',
                        background: extendDays === d ? '#d6bc66' : 'rgba(5,20,84,0.8)',
                        border: '1px solid #d6bc66'
                      }}
                    >
                      +{d} Days
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '4px' }}>
                  REASON FOR EXTENSION (AUDIT LOG)
                </label>
                <input
                  type="text"
                  value={extendReason}
                  onChange={(e) => setExtendReason(e.target.value)}
                  placeholder="e.g. Student requested time for practical exam"
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
                <button type="submit" disabled={processingAction} className="btn-gold" style={{ flex: 1, padding: '10px' }}>
                  <span>{processingAction ? 'EXTENDING...' : 'CONFIRM EXTENSION'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setExtendModalEnrollment(null)}
                  className="btn-outline-gold"
                  style={{ padding: '10px 18px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. CERTIFICATES & BOARD APPROVALS */}
      {activeTab === 'CERTIFICATES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Section A: Pending Board Certification Queue */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Award size={20} color="#F59E0B" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FFF', textTransform: 'uppercase', margin: 0 }}>
                PENDING BOARD CERTIFICATION APPROVALS
              </h2>
            </div>

            {enrollments.filter(e => e.certificationStatus === 'ready_for_review').length === 0 ? (
              <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                No students currently waiting for certificate authorization.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {enrollments.filter(e => e.certificationStatus === 'ready_for_review').map(en => (
                  <div
                    key={en._id}
                    className="glass-panel"
                    style={{
                      padding: '1.5rem',
                      borderRadius: '14px',
                      border: '1px solid #F59E0B',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#FCD34D', fontWeight: '900' }}>
                        ★ 100% MODULES COMPLETED
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#FFF', margin: '4px 0' }}>
                        {en.student?.fullName}
                      </h3>
                      <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                        Program: <strong style={{ color: '#FFF' }}>{en.program?.title}</strong> ({en.program?.level})
                      </div>
                    </div>

                    <button
                      onClick={() => handleApproveCertificate(en._id)}
                      disabled={processingAction}
                      className="btn-gold"
                      style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                    >
                      <Award size={16} />
                      <span>APPROVE & ISSUE OFFICIAL PDF CERTIFICATE</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section B: All Issued Certificates */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <CheckCircle size={20} color="#10B981" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FFF', textTransform: 'uppercase', margin: 0 }}>
                ISSUED CERTIFICATES REGISTER ({certificates.length})
              </h2>
            </div>

            <div className="glass-panel" style={{ borderRadius: '14px', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(5, 20, 84, 0.9)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th style={{ padding: '12px 16px', color: '#94A3B8' }}>CERT ID</th>
                      <th style={{ padding: '12px 16px', color: '#94A3B8' }}>RECIPIENT</th>
                      <th style={{ padding: '12px 16px', color: '#94A3B8' }}>PROGRAM</th>
                      <th style={{ padding: '12px 16px', color: '#94A3B8' }}>ISSUED DATE</th>
                      <th style={{ padding: '12px 16px', color: '#94A3B8' }}>QR LINK</th>
                      <th style={{ padding: '12px 16px', color: '#94A3B8', textAlign: 'right' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map(cert => (
                      <tr key={cert._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: '900', color: '#10B981', fontFamily: 'monospace' }}>
                          {cert.certificateId}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#FFF', fontWeight: '800' }}>
                          {cert.studentName}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#CBD5E1' }}>
                          {cert.programTitle}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#94A3B8' }}>
                          {new Date(cert.issuedDate).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <a
                            href={cert.verificationUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: '#d6bc66', fontSize: '0.75rem', textDecoration: 'underline' }}
                          >
                            Verify Online
                          </a>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          <a
                            href={ElearningAPI.downloadCertificateUrl(cert.certificateId)}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-outline-gold"
                            style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex' }}
                          >
                            <Download size={12} />
                            <span>PDF</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 6. ACADEMY & PAYMENT SETTINGS */}
      {activeTab === 'SETTINGS' && (
        <div style={{ maxWidth: '650px' }}>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid rgba(214,188,102,0.3)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FFF', marginBottom: '0.5rem' }}>
              Bank Payment Instructions Configuration
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              These account details are dynamically displayed to all students during program application.
            </p>

            <form onSubmit={handleSaveBankSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '4px' }}>
                  BANK NAME *
                </label>
                <input
                  type="text"
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '4px' }}>
                  ACCOUNT NAME *
                </label>
                <input
                  type="text"
                  value={bankForm.accountName}
                  onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '4px' }}>
                  ACCOUNT NUMBER *
                </label>
                <input
                  type="text"
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#CBD5E1', marginBottom: '4px' }}>
                  PAYMENT INSTRUCTIONS
                </label>
                <textarea
                  value={bankForm.instructions}
                  onChange={(e) => setBankForm({ ...bankForm, instructions: e.target.value })}
                  rows={3}
                  className="form-control"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="btn-gold"
                style={{ padding: '12px', marginTop: '0.5rem', width: '100%', fontSize: '0.88rem' }}
              >
                <span>{savingSettings ? 'SAVING...' : 'SAVE BANK SETTINGS'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
