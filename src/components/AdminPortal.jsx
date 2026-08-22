import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusCircle, RefreshCw, ShieldCheck, Upload, Image as ImageIcon, 
  CheckCircle, UserPlus, Users, Activity, Trash2, Shield, Calendar,
  AlertCircle, Edit2, FileText, X, Save
} from 'lucide-react';
import { API } from '../services/api';
import { getImageUrl } from '../utils/imageUrl';


const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const AdminPortal = ({ user, onRefreshData }) => {
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState('POST'); // 'POST', 'MEDIA', 'MATCHES', 'FIXTURES', 'TEAMS', 'USERS', 'LOGS', 'MANAGE_POSTS'
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // --- 1. POST ARTICLE STATE ---
  const [postTitle, setPostTitle] = useState('');
  const [category, setCategory] = useState('NEWS');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  // --- 2. MEDIA GALLERY STATE ---
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [galleryList, setGalleryList] = useState([]);

  // --- 3. TEAM MANAGEMENT STATE ---
  const [registeredTeams, setRegisteredTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [teamShortName, setTeamShortName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [teamStadium, setTeamStadium] = useState('');
  const [teamCity, setTeamCity] = useState('');
  const [teamLogo, setTeamLogo] = useState('');
  const [teamLogoPreview, setTeamLogoPreview] = useState('');
  const [uploadingTeamLogo, setUploadingTeamLogo] = useState(false);
  const teamLogoInputRef = useRef(null);

  // --- 4. MATCH STATE ---
  const [matches, setMatches] = useState([]);
  const [activeLeagueId, setActiveLeagueId] = useState(''); // populated from /api/v1/leagues
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');
  const [matchDate, setMatchDate] = useState(new Date().toISOString().slice(0, 16));
  const [venue, setVenue] = useState('');

  // Score update state
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [matchStatus, setMatchStatus] = useState('LIVE');
  const [currentMinute, setCurrentMinute] = useState("75'");

  // --- 5. USER MANAGEMENT STATE ---
  const [editorsList, setEditorsList] = useState([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('editor');

  // --- 6. AUDIT LOGS STATE ---
  const [auditLogs, setAuditLogs] = useState([]);

  // --- 7. MANAGE POSTS STATE ---
  const [allPosts, setAllPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null); // the post object being edited
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostSummary, setEditPostSummary] = useState('');
  const [editPostContent, setEditPostContent] = useState('');
  const [editPostCategory, setEditPostCategory] = useState('NEWS');
  const [editPostImage, setEditPostImage] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Load initial portal data
  const loadPortalData = async () => {
    try {
      setLoading(true);

      const [
        leagues,
        teams,
        fetchedMatches,
        fetchedMedia,
        fetchedPosts,
        editors,
        logs
      ] = await Promise.all([
        API.getLeagues(),
        API.getTeams(),
        API.getMatches(),
        API.getMedia(),
        API.getPosts('ALL'),
        isAdmin ? API.listEditors() : Promise.resolve([]),
        isAdmin ? API.getAuditLogs() : Promise.resolve([])
      ]);

      const safeLeagues = Array.isArray(leagues) ? leagues : [];
      const safeTeams = Array.isArray(teams) ? teams : [];
      const safeMatches = Array.isArray(fetchedMatches) ? fetchedMatches : [];
      const safeMedia = Array.isArray(fetchedMedia) ? fetchedMedia : [];
      const safePosts = Array.isArray(fetchedPosts) ? fetchedPosts : [];

      const activeLeague = safeLeagues.find((league) => league.isActive) || safeLeagues[0];
      setActiveLeagueId(activeLeague?._id || '');

      setRegisteredTeams(safeTeams);
      setMatches(safeMatches);
      setGalleryList(safeMedia);
      setAllPosts(safePosts);

      if (safeTeams.length > 0) {
        setHomeTeamId((current) =>
          safeTeams.some((team) => team._id === current) ? current : safeTeams[0]._id
        );
        setAwayTeamId((current) => {
          if (safeTeams.some((team) => team._id === current) && current !== safeTeams[0]._id) {
            return current;
          }
          return safeTeams[1]?._id || safeTeams[0]._id;
        });
      } else {
        setHomeTeamId('');
        setAwayTeamId('');
      }

      if (safeMatches.length > 0) {
        const firstMatch = safeMatches[0];
        setSelectedMatchId((current) =>
          safeMatches.some((match) => match._id === current) ? current : firstMatch._id
        );
        setHomeScore(Number(firstMatch.homeScore) || 0);
        setAwayScore(Number(firstMatch.awayScore) || 0);
        setMatchStatus(firstMatch.status || 'LIVE');
        setCurrentMinute(firstMatch.currentMinute || firstMatch.minute || "75'");
      } else {
        setSelectedMatchId('');
        setHomeScore(0);
        setAwayScore(0);
        setMatchStatus('LIVE');
      }

      if (isAdmin) {
        setEditorsList(Array.isArray(editors) ? editors : []);
        setAuditLogs(Array.isArray(logs) ? logs : []);
      }
    } catch (error) {
      console.error('Failed to load admin portal data:', error);
      setMsg(`❌ Failed to load portal data: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, user?._id]);

  // Article Picture Upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setMsg('');
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      const res = await API.uploadImage(file);
      if (res.success && res.url) {
        setImage(res.url);
        setImagePreview(res.url);
        setMsg('📸 Article picture uploaded successfully!');
      } else {
        setMsg(`❌ Image Upload Error: ${res.error || 'Upload failed.'}`);
      }
    } catch (error) {
      console.error('Article image upload failed:', error);
      setMsg(`❌ Image Upload Error: ${error?.message || 'Upload failed.'}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Team Logo Picture Upload handler — dedicated, does NOT touch media gallery
  const handleTeamLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTeamLogo(true);
    setMsg('');
    // Show local blob preview immediately
    const localPreview = URL.createObjectURL(file);
    setTeamLogoPreview(localPreview);

    try {
      const res = await API.uploadImage(file);
      if (res.success && res.url) {
        setTeamLogo(res.url);
        setTeamLogoPreview(res.url);
        setMsg('🛡️ Team logo uploaded successfully!');
      } else {
        setMsg(`❌ Team Logo Upload Error: ${res.error || 'Upload failed.'}`);
      }
    } catch (error) {
      console.error('Team logo upload failed:', error);
      setMsg(`❌ Team Logo Upload Error: ${error?.message || 'Upload failed.'}`);
    } finally {
      setUploadingTeamLogo(false);
    }
  };

  // Submit New Article (News/Media Story)
  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    const finalImage = image || imagePreview || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80';

    const res = await API.createPost({
      title: postTitle,
      category,
      summary,
      content: `<p>${escapeHtml(content).replace(/\n/g, '<br />')}</p>`,
      image: finalImage,
      status: 'published'
    });

    setLoading(false);
    if (res.success) {
      setMsg('✅ News article published to database!');
      setPostTitle('');
      setSummary('');
      setContent('');
      setImage('');
      setImagePreview('');
      if (onRefreshData) onRefreshData();
    } else {
      setMsg(`❌ Error: ${res.error}`);
    }
  };

  // Submit New Media Upload — uploads file and saves Media record to database
  const handleCreateMedia = async (e) => {
    e.preventDefault();
    if (!mediaFile) {
      setMsg('Please select a media photo file to upload.');
      return;
    }

    setUploadingMedia(true);
    setMsg('');

    const res = await API.createMedia(mediaFile, mediaTitle, mediaCaption);
    setUploadingMedia(false);

    if (res.success) {
      setMsg('✅ Media item uploaded and published to gallery!');
      setMediaTitle('');
      setMediaCaption('');
      setMediaFile(null);
      // Reset the file input
      const fileInput = document.getElementById('media-file-input');
      if (fileInput) fileInput.value = '';
      loadPortalData();
      if (onRefreshData) onRefreshData();
    } else {
      setMsg(`❌ Media Upload Error: ${res.error}`);
    }
  };

  // Delete Media Item
  const handleDeleteMedia = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media item?')) return;
    const res = await API.deleteMedia(id);
    if (res.success) {
      setMsg('Media item deleted.');
      loadPortalData();
      if (onRefreshData) onRefreshData();
    }
  };

  // Submit Register New Team (Admin Only)
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName || !teamShortName) {
      setMsg('Please fill in team name and short name.');
      return;
    }
    setLoading(true);
    const res = await API.createTeam({
      name: teamName,
      shortName: teamShortName,
      code: teamCode || teamShortName.slice(0, 3).toUpperCase(),
      stadium: teamStadium,
      city: teamCity,
      logo: teamLogo
    });
    setLoading(false);

    if (res.success) {
      setMsg(`⚽ Registered Team "${teamName}" with logo successfully! League table updated.`);
      setTeamName('');
      setTeamShortName('');
      setTeamCode('');
      setTeamStadium('');
      setTeamCity('');
      setTeamLogo('');
      setTeamLogoPreview('');
      loadPortalData();
      if (onRefreshData) onRefreshData();
    } else {
      setMsg(`❌ Error: ${res.error}`);
    }
  };

  // Delete Registered Team (Admin)
  const handleDeleteTeam = async (id, name) => {
  if (
    !window.confirm(
      `Are you sure you want to delete "${name}"?\n\n` +
      `This will permanently remove the team from the league table ` +
      `and reset its league statistics.`
    )
  ) {
    return;
  }

  setLoading(true);
  setMsg('');

  const res = await API.deleteTeam(id);

  setLoading(false);

  if (!res.success) {
    setMsg(`❌ Error deleting team: ${res.error}`);
    return;
  }

  // Clear any currently selected team/match that may reference
  // the deleted team.
  setHomeTeamId('');
  setAwayTeamId('');
  setSelectedMatchId('');

  // Reload teams, matches and standings.
  await loadPortalData();

  // Refresh parent/public pages.
  if (onRefreshData) {
    await onRefreshData();
  }

  setMsg(
    `✅ Team "${name}" deleted successfully. ` +
    `League table has been automatically recalculated.`
  );
};

  // Submit Create New Match / Feature (Using ONLY Admin registered teams!)
  const handleCreateMatch = async (e) => {
    e.preventDefault();
    if (!homeTeamId || !awayTeamId) {
      setMsg('Please select home and away teams.');
      return;
    }
    if (homeTeamId === awayTeamId) {
      setMsg('Home and Away teams must be different.');
      return;
    }

    if (!activeLeagueId) {
      setMsg('❌ No active league found. Please ensure a league is configured in the database.');
      return;
    }

    setLoading(true);
    const res = await API.createMatch({
      league: activeLeagueId,
      homeTeam: homeTeamId,
      awayTeam: awayTeamId,
      matchDate,
      venue
    });
    setLoading(false);

    if (res.success) {
      setMsg('🏟 Match Feature scheduled successfully!');
      loadPortalData();
      if (onRefreshData) onRefreshData();
    } else {
      setMsg(`❌ Error: ${res.error}`);
    }
  };

  // Submit Score Update (Automated Table Recalculation)
  const handleUpdateScore = async (e) => {
    e.preventDefault();
    if (!selectedMatchId) {
      setMsg('Please select a match to update.');
      return;
    }
    setLoading(true);
    const res = await API.updateScoreline(selectedMatchId, homeScore, awayScore, matchStatus, currentMinute);
    setLoading(false);

    if (res.success) {
      setMsg(`✅ Scoreline updated! ${res.tableAutoUpdated ? 'League Table Automatically Recalculated!' : ''}`);
      loadPortalData();
      if (onRefreshData) onRefreshData();
    } else {
      setMsg(`❌ Error: ${res.error}`);
    }
  };

  // Delete Match (Admin only)
  const handleDeleteMatch = async (id) => {
    if (!window.confirm('Are you sure you want to delete this match fixture permanently?')) return;
    const res = await API.deleteMatch(id);
    if (res.success) {
      setMsg('✅ Match deleted and league table recalculated.');
      loadPortalData();
      if (onRefreshData) onRefreshData();
    } else {
      setMsg(`❌ Error: ${res.error}`);
    }
  };

  // Cancel Match — sets status to CANCELLED (Admin & Editor)
  const handleCancelMatch = async (id, matchLabel) => {
    if (!window.confirm(`Cancel the fixture: "${matchLabel}"?\n\nThis will mark it as CANCELLED and remove its result from standings if it was completed.`)) return;
    const res = await API.cancelMatch(id);
    if (res.success) {
      setMsg(`✅ Fixture cancelled. League table updated.`);
      loadPortalData();
      if (onRefreshData) onRefreshData();
    } else {
      setMsg(`❌ Error: ${res.error}`);
    }
  };

  // Submit Add New User / Editor (Admin Only)
  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await API.addEditor({
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole
    });
    setLoading(false);

    if (res.success) {
      setMsg(`👤 User "${newUserName}" created as ${newUserRole}!`);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      loadPortalData();
    } else {
      setMsg(`❌ Error: ${res.error}`);
    }
  };

  // Delete User (Admin Only)
  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Remove user ${name}?`)) return;
    const res = await API.deleteEditor(id);
    if (res.success) {
      setMsg(`User ${name} removed.`);
      loadPortalData();
    }
  };

  // --- MANAGE POSTS HANDLERS ---

  // Open the inline edit form for a post
  const handleStartEditPost = (post) => {
    setEditingPost(post);
    setEditPostTitle(post.title || '');
    setEditPostSummary(post.summary || '');
    // Strip wrapping <p> tags that the create handler adds
    setEditPostContent(
      String(post.content || '')
        .replace(/^<p>/i, '')
        .replace(/<\/p>$/i, '')
        .replace(/<br\s*\/?>/gi, '\n')
    );
    setEditPostCategory(post.category || 'NEWS');
    setEditPostImage(post.image || post.coverImage || '');
    setMsg('');
  };

  // Cancel editing
  const handleCancelEditPost = () => {
    setEditingPost(null);
  };

  // Save edited post
  const handleSaveEditPost = async (e) => {
    e.preventDefault();
    if (!editingPost) return;
    setSavingEdit(true);
    setMsg('');
    const res = await API.updatePost(editingPost._id, {
      title: editPostTitle,
      summary: editPostSummary,
      content: `<p>${escapeHtml(editPostContent).replace(/\n/g, '<br />')}</p>`,
      category: editPostCategory,
      image: editPostImage,
      coverImage: editPostImage
    });
    setSavingEdit(false);
    if (res.success) {
      setMsg('✅ Post updated successfully!');
      setEditingPost(null);
      loadPortalData();
      if (onRefreshData) onRefreshData();
    } else {
      setMsg(`❌ Error: ${res.error}`);
    }
  };

  // Delete a post from Manage Posts tab
  const handleDeletePostFromManage = async (id, title) => {
    if (!window.confirm(`Delete post: "${title}"?`)) return;
    const res = await API.deletePost(id);
    if (res.success) {
      setMsg(`🗑️ Post "${title}" deleted.`);
      loadPortalData();
      if (onRefreshData) onRefreshData();
    } else {
      setMsg(`❌ Error: ${res.error}`);
    }
  };

  return (
    <div className="glass-panel-gold" style={{ padding: '1.5rem', marginBottom: '2rem', borderRadius: '16px' }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.25rem',
        borderBottom: '1px solid rgba(214, 188, 102, 0.3)',
        paddingBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={26} color="#d6bc66" />
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FFF' }}>
              DX SPORT CONTROL PORTAL
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#d6bc66', fontWeight: '800' }}>
              LOGGED IN AS: {user?.name} ({user?.role?.toUpperCase()})
            </span>
          </div>
        </div>

        {/* Tab Selector Buttons */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('POST')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: '800',
              fontSize: '0.78rem',
              background: activeTab === 'POST' ? 'var(--gold-gray-yellow)' : '#000b3d',
              color: activeTab === 'POST' ? '#000b3d' : '#FFF'
            }}
          >
            POST / EDIT NEWS
          </button>

          <button
            onClick={() => setActiveTab('MEDIA')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: '800',
              fontSize: '0.78rem',
              background: activeTab === 'MEDIA' ? 'var(--gold-gray-yellow)' : '#000b3d',
              color: activeTab === 'MEDIA' ? '#000b3d' : '#FFF'
            }}
          >
            MEDIA GALLERY
          </button>

          <button
            onClick={() => setActiveTab('MATCHES')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: '800',
              fontSize: '0.78rem',
              background: activeTab === 'MATCHES' ? 'var(--gold-gray-yellow)' : '#000b3d',
              color: activeTab === 'MATCHES' ? '#000b3d' : '#FFF'
            }}
          >
            CREATE FEATURE & SCORES
          </button>

          <button
            onClick={() => setActiveTab('FIXTURES')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: '800',
              fontSize: '0.78rem',
              background: activeTab === 'FIXTURES' ? 'var(--gold-gray-yellow)' : '#000b3d',
              color: activeTab === 'FIXTURES' ? '#000b3d' : '#FFF',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Calendar size={13} />
            MANAGE FIXTURES ({matches.length})
          </button>

          <button
            onClick={() => setActiveTab('TEAMS')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: '800',
              fontSize: '0.78rem',
              background: activeTab === 'TEAMS' ? 'var(--gold-gray-yellow)' : '#000b3d',
              color: activeTab === 'TEAMS' ? '#000b3d' : '#FFF'
            }}
          >
            REGISTER TEAMS ({registeredTeams.length})
          </button>

          <button
            onClick={() => setActiveTab('MANAGE_POSTS')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: '800',
              fontSize: '0.78rem',
              background: activeTab === 'MANAGE_POSTS' ? 'var(--gold-gray-yellow)' : '#000b3d',
              color: activeTab === 'MANAGE_POSTS' ? '#000b3d' : '#FFF',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <FileText size={13} />
            MANAGE POSTS ({allPosts.length})
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => setActiveTab('USERS')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontWeight: '800',
                  fontSize: '0.78rem',
                  background: activeTab === 'USERS' ? 'var(--gold-gray-yellow)' : '#000b3d',
                  color: activeTab === 'USERS' ? '#000b3d' : '#FFF'
                }}
              >
                USER MANAGEMENT
              </button>

              <button
                onClick={() => setActiveTab('LOGS')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontWeight: '800',
                  fontSize: '0.78rem',
                  background: activeTab === 'LOGS' ? 'var(--gold-gray-yellow)' : '#000b3d',
                  color: activeTab === 'LOGS' ? '#000b3d' : '#FFF'
                }}
              >
                AUDIT LOGS
              </button>
            </>
          )}
        </div>
      </div>

      {/* Alert Message Banner */}
      {msg && (
        <div style={{
          background: msg.includes('❌') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
          border: msg.includes('❌') ? '1px solid #EF4444' : '1px solid #10B981',
          color: msg.includes('❌') ? '#FCA5A5' : '#10B981',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '0.88rem',
          fontWeight: '700',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle size={18} />
          <span>{msg}</span>
        </div>
      )}

      {/* TAB 1: PUBLISH ARTICLE / NEWS */}
      {activeTab === 'POST' && (
        <form onSubmit={handleCreatePost} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label className="form-label">News Article Title</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Enyimba FC Host Remo Stars in Championship Showdown..."
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ background: '#000b3d' }}
            >
              <option value="NEWS">NEWS</option>
              <option value="NPFL">NPFL</option>
              <option value="SUPER EAGLES">SUPER EAGLES</option>
              <option value="EUROPE">EUROPE</option>
              <option value="TRANSFERS">TRANSFERS</option>
            </select>
          </div>

          {/* Picture Upload Field */}
          <div>
            <label className="form-label">Upload Article Cover Picture</label>
            <div style={{ position: 'relative' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                id="file-upload-input"
                style={{ display: 'none' }}
              />
              <label
                htmlFor="file-upload-input"
                className="btn-dark"
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  justifyContent: 'center',
                  fontSize: '0.85rem'
                }}
              >
                <Upload size={16} color="#d6bc66" />
                <span>{uploadingImage ? 'Uploading Picture...' : 'CHOOSE IMAGE FILE FROM DEVICE'}</span>
              </label>
            </div>
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Image URL / File Path</label>
            <input
              type="text"
              className="form-control"
              placeholder="https://... or auto-filled from picture upload"
              value={image}
              onChange={(e) => { setImage(e.target.value); setImagePreview(e.target.value); }}
            />
          </div>

          {(imagePreview || image) && (
            <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
              <img
                src={image || imagePreview}
                alt="Upload Preview"
                style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #d6bc66' }}
              />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#10B981' }}>✓ Picture Attached</div>
                <div style={{ fontSize: '0.75rem', color: '#CBD5E1', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {image || 'Local file attached'}
                </div>
              </div>
            </div>
          )}

          <div style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Summary / Teaser</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="Brief 1-2 sentence overview of the news story..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Main Article Body</label>
            <textarea
              required
              rows={4}
              className="form-control"
              placeholder="Write full story here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" disabled={loading || uploadingImage} className="btn-gold" style={{ width: '100%' }}>
              <PlusCircle size={18} />
              <span>{loading ? 'Publishing Story...' : 'PUBLISH NEWS ARTICLE'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: POST / EDIT MEDIA GALLERY */}
      {activeTab === 'MEDIA' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
          <form onSubmit={handleCreateMedia} className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#d6bc66', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ImageIcon size={18} /> UPLOAD MEDIA PHOTO TO GALLERY
            </h4>

            <div className="form-group">
              <label className="form-label">Media Title</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Super Eagles Victory Celebration Shot"
                value={mediaTitle}
                onChange={(e) => setMediaTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Upload Image File</label>
              <input
                id="media-file-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                required
                onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                className="form-control"
                style={{ padding: '8px' }}
              />
              {mediaFile && (
                <div style={{ fontSize: '0.78rem', color: '#10B981', marginTop: '4px', fontWeight: '700' }}>
                  ✓ {mediaFile.name} ({(mediaFile.size / 1024).toFixed(0)} KB) selected
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Caption / Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="Describe the media photo moment..."
                value={mediaCaption}
                onChange={(e) => setMediaCaption(e.target.value)}
              />
            </div>

            <button type="submit" disabled={uploadingMedia} className="btn-gold" style={{ width: '100%' }}>
              <Upload size={16} />
              <span>{uploadingMedia ? 'Uploading Media...' : 'PUBLISH MEDIA TO GALLERY'}</span>
            </button>
          </form>

          {/* Media Items Directory */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#FFF', fontWeight: '800', marginBottom: '1rem' }}>
              PUBLISHED MEDIA ITEMS ({galleryList.length})
            </h4>

            <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
              {galleryList.map((m) => (
                <div
                  key={m._id}
                  style={{
                    background: 'rgba(0, 11, 61, 0.7)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={getImageUrl(m.url)} alt={m.title} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }}
                      onError={(e) => { e.target.style.opacity = '0.3'; }}
                    />
                    <div>
                      <div style={{ fontWeight: '800', color: '#FFF', fontSize: '0.9rem' }}>{m.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>{m.caption || 'Photo item'}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMedia(m._id)}
                    style={{ color: '#EF4444', padding: '6px' }}
                    title="Delete Media"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CREATE FEATURE & MATCH SCORES (Registered Teams Only) */}
      {activeTab === 'MATCHES' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Subform A: Schedule New Match Feature */}
          <form onSubmit={handleCreateMatch} className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#d6bc66', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={18} /> CREATE MATCH FEATURE
            </h4>

            <div className="form-group">
              <label className="form-label">Home Team (Select Admin Registered Team)</label>
              <select
                required
                className="form-control"
                value={homeTeamId}
                onChange={(e) => setHomeTeamId(e.target.value)}
              >
                {registeredTeams.map((t) => (
                  <option key={t._id} value={t._id}>{t.name} ({t.code})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Away Team (Select Admin Registered Team)</label>
              <select
                required
                className="form-control"
                value={awayTeamId}
                onChange={(e) => setAwayTeamId(e.target.value)}
              >
                {registeredTeams.map((t) => (
                  <option key={t._id} value={t._id}>{t.name} ({t.code})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Match Date & Time</label>
              <input
                type="datetime-local"
                required
                className="form-control"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Venue Stadium</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Enyimba International Stadium, Aba"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%' }}>
              <PlusCircle size={16} />
              <span>CREATE MATCH FEATURE</span>
            </button>
          </form>

          {/* Subform B: Live Scoreline Update */}
          <form onSubmit={handleUpdateScore} className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#d6bc66', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={18} /> UPDATE LIVE SCORELINE
            </h4>

            <div className="form-group">
              <label className="form-label">Select Active Match</label>
              <select
                className="form-control"
                value={selectedMatchId}
                onChange={(e) => {
                  setSelectedMatchId(e.target.value);
                  const m = matches.find(item => item._id === e.target.value);
                  if (m) {
                    setHomeScore(m.homeScore || 0);
                    setAwayScore(m.awayScore || 0);
                    setMatchStatus(m.status || 'LIVE');
                    setCurrentMinute(m.currentMinute || m.minute || "75'");
                  }
                }}
              >
                {matches.map((m) => (
                  <option key={m._id} value={m._id}>
                    {typeof m.homeTeam === 'object' ? m.homeTeam?.name : m.homeTeam} vs {typeof m.awayTeam === 'object' ? m.awayTeam?.name : m.awayTeam} ({m.status})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label">Home Score</label>
                <input
                  type="number"
                  className="form-control"
                  value={homeScore}
                  onChange={(e) => setHomeScore(Number(e.target.value))}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="form-label">Away Score</label>
                <input
                  type="number"
                  className="form-control"
                  value={awayScore}
                  onChange={(e) => setAwayScore(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Match Minute</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 75'"
                value={currentMinute}
                onChange={(e) => setCurrentMinute(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Match Status</label>
              <select
                className="form-control"
                value={matchStatus}
                onChange={(e) => setMatchStatus(e.target.value)}
              >
                <option value="LIVE">LIVE (In Progress)</option>
                <option value="FINISHED">FINISHED (Full Time - Triggers Table Recalculation)</option>
                <option value="UPCOMING">UPCOMING</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', marginTop: '1rem' }}>
              <RefreshCw size={16} />
              <span>UPDATE SCORELINE & RECALCULATE TABLE</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB: MANAGE FIXTURES (Admin & Editor) — list all fixtures with cancel/delete */}
      {activeTab === 'FIXTURES' && (
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h4 style={{ color: '#d6bc66', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={18} /> ALL MATCH FIXTURES ({matches.length})
          </h4>

          {matches.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>
              No fixtures scheduled yet. Use the CREATE FEATURE & SCORES tab to schedule matches.
            </div>
          ) : (
            <div style={{ maxHeight: '580px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {matches.map((m) => {
                const homeName = typeof m.homeTeam === 'object'
                  ? (m.homeTeam?.shortName || m.homeTeam?.name)
                  : m.homeTeam || 'Home';
                const awayName = typeof m.awayTeam === 'object'
                  ? (m.awayTeam?.shortName || m.awayTeam?.name)
                  : m.awayTeam || 'Away';
                const matchLabel = `${homeName} vs ${awayName}`;

                // Status colour coding
                const statusColors = {
                  UPCOMING: { color: '#d6bc66', bg: 'rgba(214,188,102,0.12)' },
                  LIVE: { color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
                  FINISHED: { color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' },
                  POSTPONED: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
                  CANCELLED: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)' }
                };
                const sc = statusColors[m.status] || statusColors.UPCOMING;

                return (
                  <div
                    key={m._id}
                    style={{
                      background: 'rgba(0, 11, 61, 0.7)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}
                  >
                    {/* Match identity */}
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <div style={{ fontWeight: '800', color: '#FFF', fontSize: '0.95rem' }}>
                        {homeName} <span style={{ color: '#d6bc66' }}>vs</span> {awayName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#CBD5E1', marginTop: '3px' }}>
                        {m.matchDate
                          ? new Date(m.matchDate).toLocaleDateString('en-GB', {
                              weekday: 'short', day: 'numeric', month: 'short',
                              year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })
                          : 'Date TBD'}
                        {m.venue ? ` · ${m.venue}` : ''}
                      </div>
                    </div>

                    {/* Score (if started) */}
                    {(m.status === 'LIVE' || m.status === 'FINISHED') && (
                      <div style={{
                        fontWeight: '900',
                        fontSize: '1.1rem',
                        color: m.status === 'LIVE' ? '#10B981' : '#FFF',
                        fontFamily: 'monospace',
                        minWidth: '60px',
                        textAlign: 'center'
                      }}>
                        {m.homeScore ?? 0} – {m.awayScore ?? 0}
                      </div>
                    )}

                    {/* Status badge */}
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      color: sc.color,
                      background: sc.bg,
                      padding: '3px 10px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap'
                    }}>
                      {m.status}
                    </span>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      {/* Cancel — only show if not already cancelled/finished */}
                      {m.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleCancelMatch(m._id, matchLabel)}
                          title="Cancel this fixture"
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            background: 'rgba(245,158,11,0.12)',
                            border: '1px solid rgba(245,158,11,0.4)',
                            color: '#F59E0B',
                            fontWeight: '800',
                            fontSize: '0.78rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <AlertCircle size={13} /> CANCEL
                        </button>
                      )}

                      {/* Delete — admin only */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteMatch(m._id)}
                          title="Permanently delete this fixture"
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            background: 'rgba(239,68,68,0.12)',
                            border: '1px solid rgba(239,68,68,0.35)',
                            color: '#EF4444',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.78rem',
                            fontWeight: '800'
                          }}
                        >
                          <Trash2 size={13} /> DELETE
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: REGISTER TEAMS (With Dedicated Logo Upload) */}
      {activeTab === 'TEAMS' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
          {/* Register Team Form */}
          <form onSubmit={handleCreateTeam} className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#d6bc66', fontWeight: '800', marginBottom: '1rem' }}>
              ⚽ REGISTER OFFICIAL TEAM
            </h4>

            {/* Team Name field with logo preview beside it */}
            <div className="form-group">
              <label className="form-label">Official Team Name</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Logo preview bubble */}
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  border: '2px solid rgba(214,188,102,0.5)',
                  background: 'rgba(0,11,61,0.7)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {(teamLogo || teamLogoPreview) ? (
                    <img src={teamLogo || teamLogoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Shield size={20} color="#d6bc66" />
                  )}
                </div>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Enyimba FC"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Short Name</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Enyimba"
                value={teamShortName}
                onChange={(e) => setTeamShortName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Team Code (3 Letters)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. ENY"
                maxLength={4}
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
              />
            </div>

            {/* Dedicated Team Logo Upload — separate from media gallery */}
            <div className="form-group">
              <label className="form-label">Team Logo</label>
              {/* Hidden input wired to ref — completely separate from media gallery */}
              <input
                ref={teamLogoInputRef}
                type="file"
                accept="image/*"
                onChange={handleTeamLogoUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => teamLogoInputRef.current?.click()}
                disabled={uploadingTeamLogo}
                className="btn-dark"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
              >
                <Upload size={15} color="#d6bc66" />
                <span>{uploadingTeamLogo ? 'Uploading Logo...' : 'UPLOAD TEAM LOGO FROM DEVICE'}</span>
              </button>
              {(teamLogo || teamLogoPreview) && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.25)', padding: '8px 10px', borderRadius: '8px' }}>
                  <img
                    src={teamLogo || teamLogoPreview}
                    alt="Logo Preview"
                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #d6bc66', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#10B981' }}>✓ Logo ready</div>
                    {teamName && <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>{teamName}</div>}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Home Stadium</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Enyimba Stadium"
                value={teamStadium}
                onChange={(e) => setTeamStadium(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Aba"
                value={teamCity}
                onChange={(e) => setTeamCity(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading || uploadingTeamLogo} className="btn-gold" style={{ width: '100%' }}>
              <PlusCircle size={16} />
              <span>REGISTER TEAM</span>
            </button>
          </form>

          {/* Registered Teams Table */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#FFF', fontWeight: '800', marginBottom: '1rem' }}>
              REGISTERED TEAMS IN DATABASE ({registeredTeams.length})
            </h4>

            <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
              {registeredTeams.map((t) => (
                <div
                  key={t._id}
                  style={{
                    background: 'rgba(0, 11, 61, 0.7)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {t.logo ? (
                      <img src={getImageUrl(t.logo)} alt={t.name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Shield size={22} color="#d6bc66" />
                    )}
                    <div>
                      <div style={{ fontWeight: '800', color: '#FFF', fontSize: '0.95rem' }}>
                        {t.name} <span style={{ color: '#d6bc66' }}>({t.code})</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
                        Stadium: {t.stadium || 'N/A'} • {t.city || 'Nigeria'}
                      </div>
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteTeam(t._id, t.name)}
                      style={{ color: '#EF4444', padding: '6px' }}
                      title="Delete Team"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: USER MANAGEMENT (ADMIN ONLY) */}
      {activeTab === 'USERS' && isAdmin && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
          {/* Add User Form */}
          <form onSubmit={handleAddUser} className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#d6bc66', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <UserPlus size={18} /> ADD NEW USER / EDITOR
            </h4>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Chidi Editor"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="editor@dxsport.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-control"
                placeholder="••••••••"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assign Role</label>
              <select
                className="form-control"
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%' }}>
              <UserPlus size={16} />
              <span>CREATE USER ACCOUNT</span>
            </button>
          </form>

          {/* Users List */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#FFF', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={18} /> EDITORS & USERS DIRECTORY ({editorsList.length})
            </h4>

            <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
              {editorsList.map((usr) => (
                <div
                  key={usr._id}
                  style={{
                    background: 'rgba(0, 11, 61, 0.7)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '800', color: '#FFF', fontSize: '0.95rem' }}>
                      {usr.name} <span className="badge-gold" style={{ fontSize: '0.65rem' }}>{usr.role}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>{usr.email}</div>
                  </div>

                  <button
                    onClick={() => handleDeleteUser(usr._id, usr.name)}
                    style={{ color: '#EF4444', padding: '6px' }}
                    title="Remove User"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT LOGS (ADMIN ONLY MONITORING) */}
      {activeTab === 'LOGS' && isAdmin && (
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h4 style={{ color: '#d6bc66', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Activity size={18} /> SYSTEM ACTIVITY AUDIT LOGS
          </h4>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {auditLogs.length > 0 ? auditLogs.map((log, idx) => (
              <div
                key={log._id || idx}
                style={{
                  background: 'rgba(0, 11, 61, 0.7)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  fontSize: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '800', color: '#d6bc66' }}>{log.action}</span>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                    {new Date(log.timestamp || Date.now()).toLocaleString()}
                  </span>
                </div>
                <div style={{ color: '#CBD5E1' }}>
                  Entity: <b>{log.targetEntity}</b> | IP: <code>{log.ipAddress || '127.0.0.1'}</code>
                </div>
              </div>
            )) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                No audit logs recorded yet. Action logs will stream here live.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: MANAGE ALL POSTS */}
      {activeTab === 'MANAGE_POSTS' && (
        <div>
          {editingPost ? (
            /* ── INLINE EDIT FORM ── */
            <form onSubmit={handleSaveEditPost} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h4 style={{ color: '#d6bc66', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Edit2 size={18} /> EDITING POST
                </h4>
                <button
                  type="button"
                  onClick={handleCancelEditPost}
                  style={{ color: '#94A3B8', padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem' }}
                >
                  <X size={14} /> CANCEL
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={editPostTitle}
                    onChange={(e) => setEditPostTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={editPostCategory}
                    onChange={(e) => setEditPostCategory(e.target.value)}
                    style={{ background: '#000b3d' }}
                  >
                    <option value="NEWS">NEWS</option>
                    <option value="NPFL">NPFL</option>
                    <option value="SUPER EAGLES">SUPER EAGLES</option>
                    <option value="EUROPE">EUROPE</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Cover Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="https://..."
                    value={editPostImage}
                    onChange={(e) => setEditPostImage(e.target.value)}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Summary / Teaser</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editPostSummary}
                    onChange={(e) => setEditPostSummary(e.target.value)}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Article Body</label>
                  <textarea
                    rows={5}
                    className="form-control"
                    value={editPostContent}
                    onChange={(e) => setEditPostContent(e.target.value)}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <button type="submit" disabled={savingEdit} className="btn-gold" style={{ width: '100%' }}>
                    <Save size={16} />
                    <span>{savingEdit ? 'Saving Changes...' : 'SAVE CHANGES'}</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ── POSTS LIST ── */
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <h4 style={{ color: '#FFF', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#d6bc66" />
                ALL PUBLISHED POSTS ({allPosts.length})
              </h4>

              {allPosts.length === 0 ? (
                <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>
                  No posts yet. Publish articles from the POST / EDIT NEWS tab.
                </div>
              ) : (
                <div style={{ maxHeight: '520px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {allPosts.map((post) => (
                    <div
                      key={post._id}
                      style={{
                        background: 'rgba(0, 11, 61, 0.7)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      {/* Thumbnail */}
                      {(post.image || post.coverImage) ? (
                        <img
                          src={getImageUrl(post.image || post.coverImage)}
                          alt={post.title}
                          style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(214,188,102,0.3)', flexShrink: 0 }}
                        />
                      ) : (
                        <div style={{ width: '56px', height: '42px', background: 'rgba(214,188,102,0.1)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <FileText size={18} color="#d6bc66" />
                        </div>
                      )}

                      {/* Post info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '800', color: '#FFF', fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {post.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: '800', background: 'rgba(214,188,102,0.18)', color: '#d6bc66', padding: '2px 7px', borderRadius: '4px' }}>
                            {post.category}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button
                          onClick={() => handleStartEditPost(post)}
                          title="Edit post"
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            background: 'rgba(214,188,102,0.15)',
                            border: '1px solid rgba(214,188,102,0.4)',
                            color: '#d6bc66',
                            fontWeight: '800',
                            fontSize: '0.78rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <Edit2 size={13} />
                          EDIT
                        </button>
                        <button
                          onClick={() => handleDeletePostFromManage(post._id, post.title)}
                          title="Delete post"
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            background: 'rgba(239,68,68,0.12)',
                            border: '1px solid rgba(239,68,68,0.35)',
                            color: '#EF4444',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.78rem',
                            fontWeight: '800'
                          }}
                        >
                          <Trash2 size={13} />
                          DELETE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPortal