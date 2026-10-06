import React, { useState, useEffect } from 'react';
import ElearningAPI from '../../services/elearningApi';
import { useAcademyAuth } from '../context/AcademyAuthContext';
import {
  GraduationCap,
  BookOpen,
  Clock,
  Award,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  FileText,
  Upload,
  Play
} from 'lucide-react';

export const StudentDashboard = ({ onNavigate, onStartCourse }) => {
  const { user } = useAcademyAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      ElearningAPI.getMyEnrollments(),
      ElearningAPI.getMyApplications(),
      ElearningAPI.getMyCertificates()
    ])
      .then(([enRes, appRes, certRes]) => {
        if (enRes.success) setEnrollments(enRes.enrollments || []);
        if (appRes.success) setApplications(appRes.applications || []);
        if (certRes.success) setCertificates(certRes.certificates || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeEnrollments = enrollments.filter(e => e.status === 'active');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. WELCOME BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 11, 61, 0.95) 0%, rgba(5, 20, 84, 0.9) 100%)',
        padding: '2rem',
        borderRadius: '20px',
        border: '1px solid rgba(214, 188, 102, 0.35)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#d6bc66', letterSpacing: '0.06em' }}>
            STUDENT LEARNING DASHBOARD
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFF', fontFamily: "'Outfit', sans-serif", margin: '4px 0' }}>
            Welcome back, {user?.fullName || 'Coach'}
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            Track your ongoing curriculum, access deadlines, and official board certifications.
          </p>
        </div>

        <button
          onClick={() => onNavigate('PROGRAMS')}
          className="btn-outline-gold"
          style={{ padding: '10px 20px', fontSize: '0.82rem' }}
        >
          <span>BROWSE PROGRAMS</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 2. STATS ROW */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '14px' }}>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '800' }}>ACTIVE PROGRAMS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#d6bc66', fontFamily: "'Outfit', sans-serif" }}>
            {activeEnrollments.length}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '14px' }}>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '800' }}>APPLICATIONS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFF', fontFamily: "'Outfit', sans-serif" }}>
            {applications.length}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '14px' }}>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: '800' }}>ISSUED CERTIFICATES</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#10B981', fontFamily: "'Outfit', sans-serif" }}>
            {certificates.length}
          </div>
        </div>
      </div>

      {/* 3. ACTIVE ENROLLMENTS & COURSE ACCESS */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
          <BookOpen size={20} color="#d6bc66" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFF', textTransform: 'uppercase', margin: 0 }}>
            MY ACTIVE COURSES ({activeEnrollments.length})
          </h2>
        </div>

        {loading ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
            Loading your courses...
          </div>
        ) : activeEnrollments.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>
            <GraduationCap size={36} color="#d6bc66" style={{ margin: '0 auto 8px auto' }} />
            <h4 style={{ color: '#FFF', fontSize: '1rem', fontWeight: '800' }}>No Active Enrollments Yet</h4>
            <p style={{ fontSize: '0.85rem', marginTop: '4px', marginBottom: '1.25rem' }}>
              Apply for an accredited coaching program or upload your tuition payment receipt.
            </p>
            <button onClick={() => onNavigate('PROGRAMS')} className="btn-gold" style={{ padding: '8px 20px', fontSize: '0.82rem' }}>
              View Programs Catalog
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem'
          }}>
            {activeEnrollments.map(en => (
              <div
                key={en._id}
                className="glass-panel interactive-card"
                style={{
                  padding: '1.75rem',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid rgba(214, 188, 102, 0.3)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '900',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'rgba(214, 188, 102, 0.2)',
                      color: '#d6bc66'
                    }}>
                      {en.program?.level?.toUpperCase()} LEVEL
                    </span>

                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: en.daysRemaining <= 5 ? '#EF4444' : '#10B981'
                    }}>
                      <Clock size={13} />
                      <span>{en.daysRemaining} Days Left</span>
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#FFF', lineHeight: 1.25, marginBottom: '1rem' }}>
                    {en.program?.title}
                  </h3>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                      <span style={{ color: '#94A3B8' }}>Curriculum Progress</span>
                      <span style={{ color: '#d6bc66', fontWeight: '900' }}>{en.progressPercentage}%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(255,255,255,0.08)',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${en.progressPercentage}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #d6bc66 0%, #10B981 100%)',
                        borderRadius: '4px',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>

                  {en.certificationStatus === 'ready_for_review' && (
                    <div style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid #F59E0B',
                      fontSize: '0.78rem',
                      color: '#FCD34D',
                      fontWeight: '700',
                      marginBottom: '1rem'
                    }}>
                      ✓ 100% Complete: Pending Academy Board Certification Approval
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onStartCourse(en.program?.slug)}
                  className="btn-gold"
                  style={{ width: '100%', padding: '11px', fontSize: '0.85rem' }}
                >
                  <Play size={16} />
                  <span>CONTINUE LEARNING</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. RECENT APPLICATIONS & RECEIPT STATUS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#d6bc66" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFF', textTransform: 'uppercase', margin: 0 }}>
              RECENT APPLICATIONS
            </h2>
          </div>
          <button
            onClick={() => onNavigate('APPLICATIONS')}
            style={{ fontSize: '0.8rem', color: '#d6bc66', fontWeight: '800' }}
          >
            VIEW ALL ({applications.length})
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
            No applications submitted.
          </div>
        ) : (
          <div className="glass-panel" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(5, 20, 84, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '12px 16px', color: '#94A3B8' }}>APP ID</th>
                    <th style={{ padding: '12px 16px', color: '#94A3B8' }}>PROGRAM</th>
                    <th style={{ padding: '12px 16px', color: '#94A3B8' }}>TUITION</th>
                    <th style={{ padding: '12px 16px', color: '#94A3B8' }}>STATUS</th>
                    <th style={{ padding: '12px 16px', color: '#94A3B8', textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 4).map(app => (
                    <tr key={app._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '800', color: '#d6bc66', fontFamily: 'monospace' }}>
                        {app.applicationId}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#FFF', fontWeight: '700' }}>
                        {app.program?.title}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#CBD5E1' }}>
                        {app.currency} {app.amount?.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: app.status === 'Approved' ? 'rgba(16, 185, 129, 0.15)' : app.status === 'Pending' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: app.status === 'Approved' ? '#10B981' : app.status === 'Pending' ? '#F59E0B' : '#EF4444'
                        }}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => onNavigate('APPLICATIONS')}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            color: '#d6bc66',
                            textDecoration: 'underline'
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 5. ISSUED CERTIFICATES */}
      {certificates.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Award size={20} color="#10B981" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#FFF', textTransform: 'uppercase', margin: 0 }}>
              MY ISSUED CERTIFICATES ({certificates.length})
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {certificates.map(cert => (
              <div
                key={cert._id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: '900' }}>
                    ID: {cert.certificateId}
                  </span>
                  <div style={{ fontSize: '1rem', fontWeight: '800', color: '#FFF', margin: '3px 0' }}>
                    {cert.programTitle}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    Issued: {new Date(cert.issuedDate).toLocaleDateString()}
                  </div>
                </div>

                <a
                  href={ElearningAPI.downloadCertificateUrl(cert.certificateId)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline-gold"
                  style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                >
                  Download PDF
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
