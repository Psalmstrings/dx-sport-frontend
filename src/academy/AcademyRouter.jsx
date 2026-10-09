import React, { useState, useEffect } from 'react';
import { AcademyAuthProvider } from './context/AcademyAuthContext';
import AcademyNavbar from './components/AcademyNavbar';
import AcademyFooter from './components/AcademyFooter';
import Landing from './pages/Landing';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import MyApplications from './pages/MyApplications';
import CoursePlayer from './pages/CoursePlayer';
import MyCertificates from './pages/MyCertificates';
import VerifyCertificate from './pages/VerifyCertificate';
import AdminDashboard from './pages/admin/AdminDashboard';
import AcademyUnderConstruction from './pages/AcademyUnderConstruction';
import ElearningAPI from '../services/elearningApi';
import { GraduationCap } from 'lucide-react';

// Pages that use a compact authenticated layout (no full-width footer)
const AUTH_VIEWS = ['DASHBOARD', 'APPLICATIONS', 'CERTIFICATES', 'LEARN', 'ADMIN_DASHBOARD'];

export const AcademyRouter = ({ onBackToSports }) => {
  const [view, setView] = useState('LANDING');
  const [selectedProgramSlug, setSelectedProgramSlug] = useState('');
  const [verificationCertId, setVerificationCertId] = useState('');
  const [previewStatus, setPreviewStatus] = useState('CHECKING'); // 'CHECKING' | 'AUTHORIZED' | 'UNAUTHORIZED'

  // Verify server-validated preview session on mount
  useEffect(() => {
    let isMounted = true;

    const checkAuthorization = async () => {
      try {
        const res = await ElearningAPI.getPreviewStatus();
        if (isMounted) {
          if (res && res.authorized) {
            setPreviewStatus('AUTHORIZED');
          } else {
            setPreviewStatus('UNAUTHORIZED');
          }
        }
      } catch (err) {
        if (isMounted) {
          setPreviewStatus('UNAUTHORIZED');
        }
      }
    };

    checkAuthorization();
    return () => { isMounted = false; };
  }, []);

  // Synchronize with URL path on initial mount and browser back/forward
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;

      if (path.startsWith('/verify-certificate/') || path.startsWith('/academy/verify-certificate/')) {
        const id = path.split('/').pop();
        setVerificationCertId(id);
        setView('VERIFY_CERTIFICATE');
      } else if (path.startsWith('/academy/learn/')) {
        const slug = path.split('/').pop();
        setSelectedProgramSlug(slug);
        setView('LEARN');
      } else if (path.startsWith('/academy/programs/')) {
        const slug = path.split('/').pop();
        setSelectedProgramSlug(slug);
        setView('PROGRAM_DETAIL');
      } else if (path === '/academy/programs') {
        setView('PROGRAMS');
      } else if (path === '/academy/login') {
        setView('LOGIN');
      } else if (path === '/academy/register') {
        setView('REGISTER');
      } else if (path === '/academy/dashboard') {
        setView('DASHBOARD');
      } else if (path === '/academy/applications') {
        setView('APPLICATIONS');
      } else if (path === '/academy/certificates') {
        setView('CERTIFICATES');
      } else if (path.startsWith('/academy/admin')) {
        setView('ADMIN_DASHBOARD');
      } else if (path === '/academy') {
        setView('LANDING');
      } else {
        // Fallback for any unknown academy subpath — safe, no blank screen
        setView('LANDING');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Navigation state handler that pushes history state
  const navigateTo = (newView, payload = null) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let newUrl = '/academy';
    if (newView === 'PROGRAMS') newUrl = '/academy/programs';
    else if (newView === 'PROGRAM_DETAIL' && payload) {
      setSelectedProgramSlug(payload);
      newUrl = `/academy/programs/${payload}`;
    } else if (newView === 'LEARN' && payload) {
      setSelectedProgramSlug(payload);
      newUrl = `/academy/learn/${payload}`;
    } else if (newView === 'LOGIN') newUrl = '/academy/login';
    else if (newView === 'REGISTER') newUrl = '/academy/register';
    else if (newView === 'DASHBOARD') newUrl = '/academy/dashboard';
    else if (newView === 'APPLICATIONS') newUrl = '/academy/applications';
    else if (newView === 'CERTIFICATES') newUrl = '/academy/certificates';
    else if (newView === 'ADMIN_DASHBOARD') newUrl = '/academy/admin';
    else if (newView === 'VERIFY_CERTIFICATE' && payload) {
      setVerificationCertId(payload);
      newUrl = `/academy/verify-certificate/${payload}`;
    }

    window.history.pushState({}, '', newUrl);
  };

  const handleAccessGranted = () => {
    setPreviewStatus('AUTHORIZED');
    // If arriving at /academy, land on the Academy landing page
    if (view === 'LANDING' || window.location.pathname === '/academy') {
      setView('LANDING');
      window.history.pushState({}, '', '/academy');
    }
  };

  const handleExitPreview = async () => {
    try {
      await ElearningAPI.exitPreviewAccess();
    } catch (e) {}
    setPreviewStatus('UNAUTHORIZED');
    setView('LANDING');
    window.history.pushState({}, '', '/academy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── 1. LOADING STATE WHILE CHECKING SERVER AUTHORIZATION ───────────────
  if (previewStatus === 'CHECKING') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000726',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        color: '#FFFFFF',
        fontFamily: "'Outfit', sans-serif"
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #051454 0%, #000b3d 100%)',
          border: '2px solid #d6bc66',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 24px rgba(214, 188, 102, 0.35)'
        }}>
          <GraduationCap size={28} color="#d6bc66" />
        </div>
        <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: '700', letterSpacing: '0.08em' }}>
          VERIFYING ACCESS PERMISSIONS...
        </div>
      </div>
    );
  }

  // ── 2. PUBLIC VISITORS SEE ONLY THE UNDER CONSTRUCTION PAGE ────────────
  if (previewStatus === 'UNAUTHORIZED') {
    return (
      <AcademyUnderConstruction
        onBackToSports={onBackToSports}
        onAccessGranted={handleAccessGranted}
      />
    );
  }

  // ── 3. AUTHORIZED CLIENT PREVIEW: FULL LMS ACCESSIBLE ──────────────────
  const showFullFooter = !AUTH_VIEWS.includes(view);

  return (
    <AcademyAuthProvider>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000726',
        color: '#FFF',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* ── DISCREET TOP PREVIEW BANNER (CLIENT PREVIEW ACTIVE) ──────── */}
        <div style={{
          backgroundColor: '#000b3d',
          borderBottom: '1px solid rgba(214, 188, 102, 0.4)',
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#CBD5E1',
          zIndex: 1100,
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 8px #10B981'
            }} />
            <span style={{ fontWeight: '800', color: '#d6bc66', letterSpacing: '0.04em' }}>
              PRIVATE ACADEMY PREVIEW
            </span>
            <span style={{ color: '#94A3B8' }}>· Client &amp; QA Inspection Mode</span>
          </div>
          <button
            onClick={handleExitPreview}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#FCA5A5',
              padding: '3px 12px',
              borderRadius: '4px',
              fontSize: '0.72rem',
              fontWeight: '800',
              cursor: 'pointer',
              letterSpacing: '0.03em',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#EF4444';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              e.currentTarget.style.color = '#FCA5A5';
            }}
          >
            Exit Preview
          </button>
        </div>

        {/* ── ACADEMY HEADER ─────────────────────────────────────────── */}
        <AcademyNavbar
          currentView={view}
          onNavigate={(target) => navigateTo(target)}
          onBackToSports={onBackToSports}
        />

        {/* ── ACADEMY MAIN CONTENT ────────────────────────────────────── */}
        <main style={{ flex: 1, width: '100%' }}>
          {view === 'LANDING' && (
            <Landing
              onNavigate={(target) => navigateTo(target)}
              onSelectProgram={(slug) => navigateTo('PROGRAM_DETAIL', slug)}
            />
          )}

          {view === 'PROGRAMS' && (
            <Programs
              onSelectProgram={(slug) => navigateTo('PROGRAM_DETAIL', slug)}
            />
          )}

          {view === 'PROGRAM_DETAIL' && (
            <ProgramDetail
              slug={selectedProgramSlug}
              onBack={() => navigateTo('PROGRAMS')}
              onNavigate={(target) => navigateTo(target)}
            />
          )}

          {view === 'LOGIN' && (
            <Login
              onNavigate={(target) => navigateTo(target)}
            />
          )}

          {view === 'REGISTER' && (
            <Register
              onNavigate={(target) => navigateTo(target)}
            />
          )}

          {view === 'DASHBOARD' && (
            <StudentDashboard
              onNavigate={(target) => navigateTo(target)}
              onStartCourse={(slug) => navigateTo('LEARN', slug)}
            />
          )}

          {view === 'APPLICATIONS' && (
            <MyApplications
              onNavigate={(target) => navigateTo(target)}
            />
          )}

          {view === 'LEARN' && (
            <CoursePlayer
              slug={selectedProgramSlug}
              onBack={() => navigateTo('DASHBOARD')}
              onNavigate={(target) => navigateTo(target)}
            />
          )}

          {view === 'CERTIFICATES' && (
            <MyCertificates
              onNavigate={(target) => navigateTo(target)}
              onVerifyCertificate={(certId) => navigateTo('VERIFY_CERTIFICATE', certId)}
            />
          )}

          {view === 'VERIFY_CERTIFICATE' && (
            <VerifyCertificate
              initialCertificateId={verificationCertId}
              onBack={() => navigateTo('LANDING')}
            />
          )}

          {view === 'ADMIN_DASHBOARD' && (
            <AdminDashboard
              onNavigate={(target) => navigateTo(target)}
            />
          )}
        </main>

        {/* ── ACADEMY FOOTER ──────────────────────────────────────────── */}
        {showFullFooter ? (
          <AcademyFooter
            onNavigate={(target) => navigateTo(target)}
            onBackToSports={onBackToSports}
          />
        ) : (
          /* Compact footer for authenticated LMS views */
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            backgroundColor: '#000726',
          }}>
            <span style={{ color: '#64748B', fontSize: '0.75rem' }}>
              © {new Date().getFullYear()} <span style={{ color: '#d6bc66', fontWeight: '800' }}>DX Academy</span> · Football Education &amp; Professional Development
            </span>
            <button
              onClick={onBackToSports}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#d6bc66',
                fontSize: '0.75rem',
                fontWeight: '800',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ← Back to DX Sports &amp; News
            </button>
          </div>
        )}
      </div>
    </AcademyAuthProvider>
  );
};

export default AcademyRouter;
