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

// Pages that use a compact authenticated layout (no full-width footer)
const AUTH_VIEWS = ['DASHBOARD', 'APPLICATIONS', 'CERTIFICATES', 'LEARN', 'ADMIN_DASHBOARD'];

export const AcademyRouter = ({ onBackToSports }) => {
  const [view, setView] = useState('LANDING');
  const [selectedProgramSlug, setSelectedProgramSlug] = useState('');
  const [verificationCertId, setVerificationCertId] = useState('');

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

  // Show compact footer on authenticated/LMS pages; full footer on public pages
  const showFullFooter = !AUTH_VIEWS.includes(view);

  return (
    <AcademyAuthProvider>
      {/*
       * This div IS the entire page.
       * No sports Navbar, ScoreTicker, sports Footer or any other sports
       * component is rendered here — they are all unmounted by App.jsx when
       * activeCategory === 'ACADEMY'.
       */}
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000726',
        color: '#FFF',
        display: 'flex',
        flexDirection: 'column',
      }}>
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
              © {new Date().getFullYear()} <span style={{ color: '#d6bc66', fontWeight: '800' }}>DX Academy</span> · Football Education & Professional Development
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
