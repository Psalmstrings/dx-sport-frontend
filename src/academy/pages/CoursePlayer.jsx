import React, { useState, useEffect } from 'react';
import ElearningAPI from '../../services/elearningApi';
import {
  BookOpen,
  CheckCircle,
  Clock,
  ArrowLeft,
  ArrowRight,
  FileText,
  Video,
  Download,
  Award,
  ChevronLeft,
  ChevronRight,
  Shield,
  Play
} from 'lucide-react';

export const CoursePlayer = ({ slug, onBack, onNavigate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [activeLessonDetail, setActiveLessonDetail] = useState(null);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [togglingProgress, setTogglingProgress] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    setLoading(true);
    try {
      const res = await ElearningAPI.getCourseData(slug);
      if (res.success) {
        setData(res);
        // Default to first lesson if none active
        if (!activeLessonId && res.curriculum?.length > 0) {
          const firstLesson = res.curriculum[0].lessons[0];
          if (firstLesson) {
            selectLesson(firstLesson._id);
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load course curriculum.');
    } finally {
      setLoading(false);
    }
  };

  const selectLesson = async (lessonId) => {
    setActiveLessonId(lessonId);
    setLoadingLesson(true);
    try {
      const res = await ElearningAPI.getLesson(lessonId);
      if (res.success) {
        setActiveLessonDetail(res.lesson);
      }
    } catch (err) {
      console.error('Error fetching lesson:', err);
    } finally {
      setLoadingLesson(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!data?.enrollment?._id || !activeLessonId) return;

    try {
      setTogglingProgress(true);
      const res = await ElearningAPI.toggleLessonProgress(data.enrollment._id, activeLessonId);
      if (res.success) {
        // Refresh course progress state
        await loadCourse();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update progress');
    } finally {
      setTogglingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
        Loading interactive learning portal...
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: '#EF4444' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>Course Access Notice</h3>
        <p style={{ color: '#CBD5E1', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{error}</p>
        <button onClick={onBack} className="btn-outline-gold" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { program, enrollment, curriculum = [], completedLessonIds = [] } = data || {};
  const isCurrentCompleted = activeLessonId && completedLessonIds.includes(activeLessonId);

  // Flatten lessons for previous / next navigation
  const allLessons = [];
  curriculum.forEach(m => {
    m.lessons.forEach(l => {
      allLessons.push({ ...l, moduleTitle: m.title });
    });
  });
  const currentIndex = allLessons.findIndex(l => l._id === activeLessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Bar Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d6bc66', fontWeight: '800', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} />
          <span>BACK TO DASHBOARD</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {enrollment && (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '800',
              padding: '3px 10px',
              borderRadius: '6px',
              background: enrollment.daysRemaining <= 5 ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
              color: enrollment.daysRemaining <= 5 ? '#EF4444' : '#10B981',
              border: '1px solid currentColor'
            }}>
              ⏳ {enrollment.daysRemaining} Days of Access Remaining
            </span>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Progress:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#d6bc66' }}>
              {enrollment?.progressPercentage || 0}%
            </span>
          </div>
        </div>
      </div>

      {/* 100% Completion Celebration Banner */}
      {enrollment?.certificationStatus === 'ready_for_review' && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 20, 84, 0.8) 100%)',
          border: '1px solid #10B981',
          padding: '1.25rem 1.5rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Award size={28} color="#10B981" />
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#FFF' }}>
                Course Completed (100%) — Ready for Official Certification! 🎓
              </div>
              <div style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>
                Your coursework is currently under board review. An official verifiable landscape certificate will be issued upon approval.
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('CERTIFICATES')}
            className="btn-gold"
            style={{ padding: '6px 14px', fontSize: '0.75rem' }}
          >
            Check Certificates
          </button>
        </div>
      )}

      {/* Main LMS Screen: Sidebar (1fr) + Main Reader (2.5fr) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 1fr) 2.5fr',
        gap: '1.5rem',
        alignItems: 'start'
      }} className="course-player-grid">
        {/* LEFT SIDEBAR: Modules & Lessons */}
        <div className="glass-panel" style={{
          padding: '1.25rem',
          borderRadius: '16px',
          border: '1px solid rgba(214, 188, 102, 0.25)',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <div style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#d6bc66', fontWeight: '900', letterSpacing: '0.05em' }}>
              COURSE CURRICULUM
            </span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#FFF', margin: '4px 0 0 0' }}>
              {program?.title}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {curriculum.map((mod, mIdx) => (
              <div key={mod._id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  color: '#94A3B8',
                  padding: '4px 8px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '4px'
                }}>
                  MODULE {mIdx + 1}: {mod.title.toUpperCase()}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '4px' }}>
                  {mod.lessons.map(lesson => {
                    const isSelected = lesson._id === activeLessonId;
                    const isDone = completedLessonIds.includes(lesson._id);
                    return (
                      <button
                        key={lesson._id}
                        onClick={() => selectLesson(lesson._id)}
                        style={{
                          textAlign: 'left',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: isSelected ? '800' : '600',
                          color: isSelected ? '#000b3d' : '#CBD5E1',
                          background: isSelected ? '#d6bc66' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                          {lesson.type === 'video' || lesson.type === 'external_video' ? (
                            <Video size={14} color={isSelected ? '#000b3d' : '#d6bc66'} />
                          ) : (
                            <FileText size={14} color={isSelected ? '#000b3d' : '#d6bc66'} />
                          )}
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {lesson.title}
                          </span>
                        </div>
                        {isDone && <CheckCircle size={14} color={isSelected ? '#000b3d' : '#10B981'} style={{ flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT MAIN VIEWER: Lesson Content Player */}
        <div className="glass-panel" style={{
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid rgba(214, 188, 102, 0.25)',
          minHeight: '500px'
        }}>
          {loadingLesson ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
              Loading lesson content...
            </div>
          ) : activeLessonDetail ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Lesson Header */}
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#d6bc66', fontWeight: '800' }}>
                  {activeLessonDetail.module?.title || 'CURRICULUM MODULE'}
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#FFF', margin: '4px 0 0 0' }}>
                  {activeLessonDetail.title}
                </h2>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                  Duration: {activeLessonDetail.durationMinutes} Minutes • Type: {activeLessonDetail.type.toUpperCase()}
                </div>
              </div>

              {/* Video Embed Player */}
              {(activeLessonDetail.type === 'video' || activeLessonDetail.type === 'external_video') && activeLessonDetail.mediaUrl && (
                <div style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: '12px',
                  border: '1px solid rgba(214,188,102,0.3)',
                  background: '#000'
                }}>
                  <iframe
                    src={activeLessonDetail.mediaUrl.replace('watch?v=', 'embed/')}
                    title={activeLessonDetail.title}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Lesson Description */}
              {activeLessonDetail.description && (
                <div style={{ fontSize: '0.9rem', color: '#CBD5E1', fontStyle: 'italic' }}>
                  {activeLessonDetail.description}
                </div>
              )}

              {/* Lesson Rich Content Body */}
              {activeLessonDetail.content && (
                <div
                  style={{
                    fontSize: '0.95rem',
                    color: '#E2E8F0',
                    lineHeight: 1.7,
                    padding: '1rem 0'
                  }}
                  dangerouslySetInnerHTML={{ __html: activeLessonDetail.content }}
                />
              )}

              {/* Attached Material File Download (PDF / Notes) */}
              {activeLessonDetail.filePath && (
                <div style={{
                  background: 'rgba(5, 20, 84, 0.7)',
                  border: '1px solid #d6bc66',
                  padding: '1.25rem',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#FFF' }}>
                      Official Course Material Note
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                      {activeLessonDetail.fileName || 'Downloadable Course Document'}
                    </div>
                  </div>
                  <a
                    href={ElearningAPI.downloadMaterial(activeLessonDetail._id)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-gold"
                    style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                  >
                    <Download size={14} />
                    <span>DOWNLOAD FILE</span>
                  </a>
                </div>
              )}

              {/* Bottom Actions: Previous, Toggle Complete, Next */}
              <div style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                paddingTop: '1.5rem',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <button
                  onClick={() => prevLesson && selectLesson(prevLesson._id)}
                  disabled={!prevLesson}
                  className="btn-outline-gold"
                  style={{ padding: '8px 16px', fontSize: '0.8rem', opacity: prevLesson ? 1 : 0.4 }}
                >
                  <ChevronLeft size={16} />
                  <span>PREVIOUS</span>
                </button>

                <button
                  onClick={handleToggleComplete}
                  disabled={togglingProgress}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontWeight: '900',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: isCurrentCompleted ? '#10B981' : '#d6bc66',
                    color: '#000b3d',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
                  }}
                >
                  <CheckCircle size={16} />
                  <span>{isCurrentCompleted ? 'COMPLETED ✓ (CLICK TO REVERT)' : 'MARK AS COMPLETED'}</span>
                </button>

                <button
                  onClick={() => nextLesson && selectLesson(nextLesson._id)}
                  disabled={!nextLesson}
                  className="btn-outline-gold"
                  style={{ padding: '8px 16px', fontSize: '0.8rem', opacity: nextLesson ? 1 : 0.4 }}
                >
                  <span>NEXT</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
              Select a lesson from the left sidebar to begin.
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .course-player-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CoursePlayer;
