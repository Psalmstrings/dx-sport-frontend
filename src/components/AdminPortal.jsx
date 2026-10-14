import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusCircle, RefreshCw, ShieldCheck, Upload, Image as ImageIcon, 
  CheckCircle, UserPlus, Users, Activity, Trash2, Shield, Calendar,
  AlertCircle, Edit2, FileText, X, Save, Trophy, Layers, Filter, Check,
  Globe, ToggleLeft, ToggleRight, Search
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
  const [activeTab, setActiveTab] = useState('POST'); // 'POST', 'MEDIA', 'MATCHES', 'FIXTURES', 'TEAMS', 'LEAGUES', 'USERS', 'LOGS', 'MANAGE_POSTS'
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

  // --- 2.5. LEAGUE & COMPETITION MANAGEMENT STATE ---
  const [registeredLeagues, setRegisteredLeagues] = useState([]);
  const [leagueSearch, setLeagueSearch] = useState('');
  const [leagueFilterType, setLeagueFilterType] = useState('ALL');
  const [compName, setCompName] = useState('');
  const [compShortName, setCompShortName] = useState('');
  const [compCode, setCompCode] = useState('');
  const [compType, setCompType] = useState('League');
  const [compCountry, setCompCountry] = useState('Nigeria');
  const [compDescription, setCompDescription] = useState('');
  const [compStandingsEnabled, setCompStandingsEnabled] = useState(false);
  const [compIsActive, setCompIsActive] = useState(true);
  const [compLogo, setCompLogo] = useState('');
  const [compLogoPreview, setCompLogoPreview] = useState('');
  const [uploadingCompLogo, setUploadingCompLogo] = useState(false);
  const compLogoInputRef = useRef(null);

  // Competition Edit State
  const [editingLeague, setEditingLeague] = useState(null);
  const [editCompName, setEditCompName] = useState('');
  const [editCompShortName, setEditCompShortName] = useState('');
  const [editCompCode, setEditCompCode] = useState('');
  const [editCompType, setEditCompType] = useState('League');
  const [editCompCountry, setEditCompCountry] = useState('');
  const [editCompDescription, setEditCompDescription] = useState('');
  const [editCompStandingsEnabled, setEditCompStandingsEnabled] = useState(false);
  const [editCompIsActive, setEditCompIsActive] = useState(true);
  const [editCompLogo, setEditCompLogo] = useState('');
  const [editCompLogoPreview, setEditCompLogoPreview] = useState('');
  const [uploadingEditCompLogo, setUploadingEditCompLogo] = useState(false);
  const editCompLogoInputRef = useRef(null);

  // --- 3. TEAM MANAGEMENT STATE ---
  const [registeredTeams, setRegisteredTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [teamShortName, setTeamShortName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [teamStadium, setTeamStadium] = useState('');
  const [teamCity, setTeamCity] = useState('');
  const [teamCountry, setTeamCountry] = useState('Nigeria');
  const [teamCompetitionIds, setTeamCompetitionIds] = useState([]);
  const [teamLogo, setTeamLogo] = useState('');
  const [teamLogoPreview, setTeamLogoPreview] = useState('');
  const [uploadingTeamLogo, setUploadingTeamLogo] = useState(false);
  const [teamSearch, setTeamSearch] = useState('');
  const [teamFilterComp, setTeamFilterComp] = useState('ALL');
  const teamLogoInputRef = useRef(null);

  // Team Edit State
  const [editingTeam, setEditingTeam] = useState(null);
  const [editTeamName, setEditTeamName] = useState('');
  const [editTeamShortName, setEditTeamShortName] = useState('');
  const [editTeamCode, setEditTeamCode] = useState('');
  const [editTeamStadium, setEditTeamStadium] = useState('');
  const [editTeamCity, setEditTeamCity] = useState('');
  const [editTeamCountry, setEditTeamCountry] = useState('');
  const [editTeamCompetitionIds, setEditTeamCompetitionIds] = useState([]);
  const [editTeamLogo, setEditTeamLogo] = useState('');
  const [editTeamLogoPreview, setEditTeamLogoPreview] = useState('');
  const [editTeamIsActive, setEditTeamIsActive] = useState(true);
  const [uploadingEditTeamLogo, setUploadingEditTeamLogo] = useState(false);
  const editTeamLogoInputRef = useRef(null);

  // --- 4. MATCH STATE ---
  const [matches, setMatches] = useState([]);
  const [activeLeagueId, setActiveLeagueId] = useState(''); // fallback
  const [scheduleCompetitionId, setScheduleCompetitionId] = useState(''); // Competition-first selection
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');
  const [matchDate, setMatchDate] = useState(new Date().toISOString().slice(0, 16));
  const [venue, setVenue] = useState('');
  const [fixtureFilterComp, setFixtureFilterComp] = useState('ALL');
  const [scoreFilterComp, setScoreFilterComp] = useState('ALL');

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

      setRegisteredLeagues(safeLeagues);
      setRegisteredTeams(safeTeams);
      setMatches(safeMatches);
      setGalleryList(safeMedia);
      setAllPosts(safePosts);

      // Prioritize NPFL as the authoritative default for domestic match scheduling workflow
      const npflLeague = safeLeagues.find((l) => l.code === 'NPFL' || l.shortName === 'NPFL' || (l.name && l.name.toLowerCase().includes('nigeria premier'))) || safeLeagues.find((league) => league.isActive) || safeLeagues[0];
      const defaultLeagueId = npflLeague?._id || '';
      setActiveLeagueId(defaultLeagueId);

      setScheduleCompetitionId((curr) => {
        if (curr && safeLeagues.some((l) => l._id === curr)) return curr;
        return defaultLeagueId;
      });

      setTeamCompetitionIds((curr) => {
        if (curr.length > 0 && curr.some((id) => safeLeagues.some((l) => l._id === id))) return curr;
        return defaultLeagueId ? [defaultLeagueId] : [];
      });

      // Filter teams for selected schedule competition
      const compForSchedule = scheduleCompetitionId || defaultLeagueId;
      const compTeams = safeTeams.filter((t) => {
        if (t.isActive === false) return false;
        const comps = Array.isArray(t.competitions) ? t.competitions : [];
        return comps.some((c) => {
          const cId = typeof c === 'object' ? c._id : c;
          return String(cId) === String(compForSchedule);
        });
      });

      if (compTeams.length > 0) {
        setHomeTeamId((current) =>
          compTeams.some((team) => team._id === current) ? current : compTeams[0]._id
        );
        setAwayTeamId((current) => {
          if (compTeams.some((team) => team._id === current) && current !== compTeams[0]._id) {
            return current;
          }
          return compTeams[1]?._id || compTeams[0]._id;
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

  // ==========================================
  // LEAGUE & COMPETITION MANAGEMENT HANDLERS
  // ==========================================

  // Upload Competition Logo
  const handleCompLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCompLogo(true);
    setMsg('');
    const localPreview = URL.createObjectURL(file);
    setCompLogoPreview(localPreview);

    try {
      const res = await API.uploadImage(file);
      if (res.success && res.url) {
        setCompLogo(res.url);
        setCompLogoPreview(res.url);
        setMsg('🏆 Competition logo uploaded successfully!');
      } else {
        setMsg(`❌ Competition Logo Upload Error: ${res.error || 'Upload failed.'}`);
      }
    } catch (error) {
      console.error('Competition logo upload failed:', error);
      setMsg(`❌ Competition Logo Upload Error: ${error?.message || 'Upload failed.'}`);
    } finally {
      setUploadingCompLogo(false);
    }
  };

  // Upload Logo for Editing Competition
  const handleEditCompLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingEditCompLogo(true);
    setMsg('');
    const localPreview = URL.createObjectURL(file);
    setEditCompLogoPreview(localPreview);

    try {
      const res = await API.uploadImage(file);
      if (res.success && res.url) {
        setEditCompLogo(res.url);
        setEditCompLogoPreview(res.url);
        setMsg('🏆 Competition logo updated!');
      } else {
        setMsg(`❌ Logo Upload Error: ${res.error || 'Upload failed.'}`);
      }
    } catch (error) {
      setMsg(`❌ Logo Upload Error: ${error?.message || 'Upload failed.'}`);
    } finally {
      setUploadingEditCompLogo(false);
    }
  };

  // Create New Competition
  const handleCreateLeague = async (e) => {
    e.preventDefault();
    if (!compName || !compShortName) {
      setMsg('Please fill in competition name and short name.');
      return;
    }
    setLoading(true);
    setMsg('');

    const res = await API.createLeague({
      name: compName,
      shortName: compShortName,
      code: compCode || compShortName.toUpperCase(),
      type: compType,
      country: compCountry,
      description: compDescription,
      logo: compLogo,
      standingsEnabled: compStandingsEnabled,
      isActive: compIsActive
    });

    setLoading(false);

    if (res.success) {
      setMsg(`🏆 Registered Competition "${compName}" successfully!`);
      setCompName('');
      setCompShortName('');
      setCompCode('');
      setCompType('League');
      setCompCountry('Nigeria');
      setCompDescription('');
      setCompStandingsEnabled(false);
      setCompIsActive(true);
      setCompLogo('');
      setCompLogoPreview('');
      loadPortalData();
      if (onRefreshData) onRefreshData();
    } else {
      setMsg(`❌ Error: ${res.error}`);
    }
  };

  // Toggle Competition Active / Inactive Status
  const handleToggleLeagueStatus = async (id, currentName) => {
    setLoading(true);
    setMsg('');
    const res = await API.toggleLeagueStatus(id);
    setLoading(false);

    if (res.success) {
      setMsg(`🏆 Status for "${currentName}" set to ${res.league?.isActive ? 'ACTIVE' : 'INACTIVE'}.`);
      loadPortalData();
      if (onRefreshData) onRefreshData();
    } else {
      setMsg(`❌ Error toggling status: ${res.error}`);
    }
  };

  // Start Editing Competition
  const handleStartEditLeague = (league) => {
    setEditingLeague(league);
    setEditCompName(league.name || '');
    setEditCompShortName(league.shortName || '');
    setEditCompCode(league.code || '');
    setEditCompType(league.type || 'League');
    setEditCompCountry(league.country || '');
    setEditCompDescription(league.description || '');
    setEditCompStandingsEnabled(Boolean(league.standingsEnabled));
    setEditCompIsActive(league.isActive !== false);
    setEditCompLogo(league.logo || '');
    setEditCompLogoPreview(league.logo || '');
    setMsg('');
  };

  // Cancel Editing Competition
  const handleCancelEditLeague = () => {
    setEditingLeague(null);
  };

  // Save Edited Competition
  const handleSaveEditLeague = async (e) => {
    e.preventDefault();
    if (!editingLeague) return;
    setLoading(true);
    setMsg('');

    const res = await API.updateLeague(editingLeague._id, {
      name: editCompName,
      shortName: editCompShortName,
      code: editCompCode || editCompShortName.toUpperCase(),
      type: editCompType,
      country: editCompCountry,
      description: editCompDescription,
      logo: editCompLogo,
      standingsEnabled: editCompStandingsEnabled,
      isActive: editCompIsActive
    });

    setLoading(false);

    if (res.success) {
      setMsg(`✅ Competition "${editCompName}" updated successfully!`);
      setEditingLeague(null);
      loadPortalData();
      if (onRefreshData) onRefreshData();
    } else {
      setMsg(`❌ Error: ${res.error}`);
    }
  };

  // ==========================================
  // TEAM MANAGEMENT & MEMBERSHIP HANDLERS
  // ==========================================

  // Upload Logo for Editing Team
  const handleEditTeamLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingEditTeamLogo(true);
    setMsg('');
    const localPreview = URL.createObjectURL(file);
    setEditTeamLogoPreview(localPreview);

    try {
      const res = await API.uploadImage(file);
      if (res.success && res.url) {
        setEditTeamLogo(res.url);
        setEditTeamLogoPreview(res.url);
        setMsg('🛡️ Team logo updated!');
      } else {
        setMsg(`❌ Team Logo Upload Error: ${res.error || 'Upload failed.'}`);
      }
    } catch (error) {
      setMsg(`❌ Team Logo Upload Error: ${error?.message || 'Upload failed.'}`);
    } finally {
      setUploadingEditTeamLogo(false);
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
      country: teamCountry || 'Nigeria',
      competitions: teamCompetitionIds,
      logo: teamLogo
    });
    setLoading(false);

    if (res.success) {
      setMsg(`⚽ Registered Team "${teamName}" with logo successfully!`);
      setTeamName('');
      setTeamShortName('');
      setTeamCode('');
      setTeamStadium('');
      setTeamCity('');
      setTeamCountry('Nigeria');
      setTeamLogo('');
      setTeamLogoPreview('');
      loadPortalData();
      if (onRefreshData) onRefreshData();
    } else {
      setMsg(`❌ Error: ${res.error}`);
    }
  };

  // Start Editing Team
  const handleStartEditTeam = (team) => {
    setEditingTeam(team);
    setEditTeamName(team.name || '');
    setEditTeamShortName(team.shortName || '');
    setEditTeamCode(team.code || '');
    setEditTeamStadium(team.stadium || '');
    setEditTeamCity(team.city || '');
    setEditTeamCountry(team.country || 'Nigeria');
    const existingCompIds = Array.isArray(team.competitions)
      ? team.competitions.map((c) => (typeof c === 'object' ? c._id : c))
      : [];
    setEditTeamCompetitionIds(existingCompIds);
    setEditTeamLogo(team.logo || '');
    setEditTeamLogoPreview(team.logo || '');
    setEditTeamIsActive(team.isActive !== false);
    setMsg('');
  };

  // Cancel Editing Team
  const handleCancelEditTeam = () => {
    setEditingTeam(null);
  };

  // Save Edited Team
  const handleSaveEditTeam = async (e) => {
    e.preventDefault();
    if (!editingTeam) return;
    setLoading(true);
    setMsg('');

    const res = await API.updateTeam(editingTeam._id, {
      name: editTeamName,
      shortName: editTeamShortName,
      code: editTeamCode,
      stadium: editTeamStadium,
      city: editTeamCity,
      country: editTeamCountry,
      competitions: editTeamCompetitionIds,
      logo: editTeamLogo,
      isActive: editTeamIsActive
    });

    setLoading(false);

    if (res.success) {
      setMsg(`✅ Team "${editTeamName}" updated successfully!`);
      setEditingTeam(null);
      loadPortalData();
      if (onRefreshData) onRefreshData();
    } else {
      setMsg(`❌ Error: ${res.error}`);
    }
  };

  // Assign Team to a Competition
  const handleAssignTeamCompetition = async (teamId, compId) => {
    setLoading(true);
    setMsg('');
    const res = await API.assignTeamCompetition(teamId, compId);
    setLoading(false);

    if (res.success) {
      setMsg('✅ Team assigned to competition.');
      loadPortalData();
      if (onRefreshData) onRefreshData();
    } else {
      setMsg(`❌ Error: ${res.error}`);
    }
  };

  // Remove Team from a Competition (Preserving Club)
  const handleRemoveTeamCompetition = async (teamId, compId, teamNameText, compNameText) => {
    if (!window.confirm(`Remove "${teamNameText}" from "${compNameText}"?\n\nThe club record and other competition memberships will remain safe.`)) return;

    setLoading(true);
    setMsg('');
    const res = await API.removeTeamCompetition(teamId, compId);
    setLoading(false);

    if (res.success) {
      setMsg(`✅ "${teamNameText}" removed from "${compNameText}".`);
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
        `Are you sure you want to permanently delete "${name}"?\n\n` +
        `This will permanently remove the club from all competitions and reset its standings.`
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

    setHomeTeamId('');
    setAwayTeamId('');
    setSelectedMatchId('');

    await loadPortalData();

    if (onRefreshData) {
      await onRefreshData();
    }

    setMsg(`✅ Team "${name}" deleted successfully.`);
  };

  // ==========================================
  // MATCH SCHEDULING (COMPETITION FIRST)
  // ==========================================

  // When competition changes in fixture scheduler
  const handleScheduleCompetitionChange = (selectedCompId) => {
    setScheduleCompetitionId(selectedCompId);
    const eligible = registeredTeams.filter((t) => {
      if (t.isActive === false) return false;
      const comps = Array.isArray(t.competitions) ? t.competitions : [];
      return comps.some((c) => {
        const cId = typeof c === 'object' ? c._id : c;
        return String(cId) === String(selectedCompId);
      });
    });

    if (eligible.length > 0) {
      setHomeTeamId(eligible[0]._id);
      setAwayTeamId(eligible[1]?._id || eligible[0]._id);
    } else {
      setHomeTeamId('');
      setAwayTeamId('');
    }
  };

  // Submit Create New Match / Feature (Competition First)
  const handleCreateMatch = async (e) => {
    e.preventDefault();
    if (!scheduleCompetitionId) {
      setMsg('❌ Please select a competition first.');
      return;
    }
    if (!homeTeamId || !awayTeamId) {
      setMsg('Please select both home and away teams.');
      return;
    }
    if (homeTeamId === awayTeamId) {
      setMsg('Home and Away teams must be different.');
      return;
    }

    setLoading(true);
    const res = await API.createMatch({
      league: scheduleCompetitionId,
      homeTeam: homeTeamId,
      awayTeam: awayTeamId,
      matchDate,
      venue
    });
    setLoading(false);

    if (res.success) {
      setMsg('🏟 Match Feature scheduled successfully!');
      await loadPortalData();
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
      await loadPortalData();
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
      await loadPortalData();
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
      await loadPortalData();
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
            onClick={() => setActiveTab('LEAGUES')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontWeight: '800',
              fontSize: '0.78rem',
              background: activeTab === 'LEAGUES' ? 'var(--gold-gray-yellow)' : '#000b3d',
              color: activeTab === 'LEAGUES' ? '#000b3d' : '#FFF',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Trophy size={13} />
            LEAGUES & COMPETITIONS ({registeredLeagues.length})
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

      {/* TAB: LEAGUES & COMPETITIONS MANAGEMENT */}
      {activeTab === 'LEAGUES' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1.5rem' }}>
          {/* Subform: Register New Competition */}
          <form onSubmit={handleCreateLeague} className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#d6bc66', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={18} /> REGISTER FOOTBALL COMPETITION
            </h4>

            <div className="form-group">
              <label className="form-label">Competition Name</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Nigeria National League, CAF Champions League"
                value={compName}
                onChange={(e) => setCompName(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Short Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. NNL, CAF CL, EPL"
                  value={compShortName}
                  onChange={(e) => setCompShortName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Code / ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. NNL"
                  value={compCode}
                  onChange={(e) => setCompCode(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Competition Type</label>
                <select
                  className="form-control"
                  value={compType}
                  onChange={(e) => setCompType(e.target.value)}
                >
                  <option value="League">League</option>
                  <option value="Cup">Cup</option>
                  <option value="International Competition">International Competition</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Country / Region</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Nigeria, Africa, England"
                  value={compCountry}
                  onChange={(e) => setCompCountry(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                rows={2}
                className="form-control"
                placeholder="Brief description of the league or tournament..."
                value={compDescription}
                onChange={(e) => setCompDescription(e.target.value)}
              />
            </div>

            {/* Competition Logo Upload */}
            <div className="form-group">
              <label className="form-label">Competition Logo</label>
              <input
                ref={compLogoInputRef}
                type="file"
                accept="image/*"
                onChange={handleCompLogoUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => compLogoInputRef.current?.click()}
                disabled={uploadingCompLogo}
                className="btn-dark"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
              >
                <Upload size={15} color="#d6bc66" />
                <span>{uploadingCompLogo ? 'Uploading Logo...' : 'UPLOAD COMPETITION LOGO'}</span>
              </button>
              {(compLogo || compLogoPreview) && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.25)', padding: '8px 10px', borderRadius: '8px' }}>
                  <img
                    src={compLogo || compLogoPreview}
                    alt="Comp Preview"
                    style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'contain' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#10B981' }}>✓ Logo attached</div>
                    {compShortName && <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>{compShortName}</div>}
                  </div>
                </div>
              )}
            </div>

            {/* Configuration Flags */}
            <div style={{ background: 'rgba(0, 11, 61, 0.5)', padding: '10px 14px', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={compStandingsEnabled}
                  onChange={(e) => setCompStandingsEnabled(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#d6bc66' }}
                />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#FFF' }}>Standings Table Enabled</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Only enable if this competition has a league table (e.g. NPFL). Off by default.</div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={compIsActive}
                  onChange={(e) => setCompIsActive(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#10B981' }}
                />
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#FFF' }}>Active Competition</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Active competitions can be selected for scheduling matches.</div>
                </div>
              </label>
            </div>

            <button type="submit" disabled={loading || uploadingCompLogo} className="btn-gold" style={{ width: '100%' }}>
              <PlusCircle size={16} />
              <span>REGISTER COMPETITION</span>
            </button>
          </form>

          {/* Directory: Registered Competitions */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
              <h4 style={{ color: '#FFF', fontWeight: '800', margin: 0 }}>
                REGISTERED COMPETITIONS ({registeredLeagues.length})
              </h4>
            </div>

            {/* Filters */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '8px', marginBottom: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search competitions..."
                  className="form-control"
                  style={{ paddingLeft: '32px', fontSize: '0.8rem' }}
                  value={leagueSearch}
                  onChange={(e) => setLeagueSearch(e.target.value)}
                />
                <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              <select
                className="form-control"
                style={{ fontSize: '0.8rem' }}
                value={leagueFilterType}
                onChange={(e) => setLeagueFilterType(e.target.value)}
              >
                <option value="ALL">All Types</option>
                <option value="League">Leagues</option>
                <option value="Cup">Cups</option>
                <option value="International Competition">International</option>
              </select>
            </div>

            {/* List */}
            <div style={{ maxHeight: '520px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {registeredLeagues
                .filter((l) => {
                  if (leagueFilterType !== 'ALL' && l.type !== leagueFilterType) return false;
                  if (leagueSearch) {
                    const q = leagueSearch.toLowerCase();
                    return (
                      l.name?.toLowerCase().includes(q) ||
                      l.shortName?.toLowerCase().includes(q) ||
                      l.code?.toLowerCase().includes(q)
                    );
                  }
                  return true;
                })
                .map((l) => (
                  <div
                    key={l._id}
                    style={{
                      background: 'rgba(0, 11, 61, 0.75)',
                      border: l.isActive !== false ? '1px solid rgba(214,188,102,0.25)' : '1px solid rgba(239,68,68,0.25)',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {l.logo ? (
                          <img
                            src={getImageUrl(l.logo)}
                            alt={l.name}
                            style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'contain' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'rgba(214,188,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trophy size={18} color="#d6bc66" />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: '800', color: '#FFF', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {l.name}
                            <span style={{ fontSize: '0.72rem', color: '#d6bc66', background: 'rgba(214,188,102,0.12)', padding: '2px 6px', borderRadius: '4px' }}>
                              {l.shortName || l.code}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                            {l.type || 'League'} • {l.country || 'Region TBD'}
                          </div>
                        </div>
                      </div>

                      {/* Badges & Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: l.standingsEnabled ? 'rgba(214,188,102,0.2)' : 'rgba(148,163,184,0.15)',
                          color: l.standingsEnabled ? '#d6bc66' : '#94A3B8'
                        }}>
                          {l.standingsEnabled ? 'Standings On' : 'Standings Off'}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleLeagueStatus(l._id, l.name)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            border: 'none',
                            cursor: 'pointer',
                            background: l.isActive !== false ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                            color: l.isActive !== false ? '#10B981' : '#EF4444'
                          }}
                        >
                          {l.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStartEditLeague(l)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: 'rgba(255,255,255,0.08)',
                            color: '#FFF',
                            fontSize: '0.72rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                      </div>
                    </div>

                    {/* Stats footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#CBD5E1', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
                      <span><strong>{l.teamsCount ?? 0}</strong> Clubs Registered</span>
                      <span><strong>{l.matchesCount ?? 0}</strong> Scheduled Matches</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT COMPETITION */}
      {editingLeague && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <form
            onSubmit={handleSaveEditLeague}
            className="glass-panel"
            style={{ width: '100%', maxWidth: '520px', padding: '1.5rem', borderRadius: '12px', background: '#000b3d' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ color: '#d6bc66', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit2 size={18} /> EDIT COMPETITION
              </h4>
              <button type="button" onClick={handleCancelEditLeague} style={{ color: '#94A3B8', padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Competition Name</label>
              <input
                type="text"
                required
                className="form-control"
                value={editCompName}
                onChange={(e) => setEditCompName(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Short Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={editCompShortName}
                  onChange={(e) => setEditCompShortName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={editCompCode}
                  onChange={(e) => setEditCompCode(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  className="form-control"
                  value={editCompType}
                  onChange={(e) => setCompType(e.target.value)}
                >
                  <option value="League">League</option>
                  <option value="Cup">Cup</option>
                  <option value="International Competition">International Competition</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control"
                  value={editCompCountry}
                  onChange={(e) => setEditCompCountry(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                rows={2}
                className="form-control"
                value={editCompDescription}
                onChange={(e) => setEditCompDescription(e.target.value)}
              />
            </div>

            {/* Logo upload in modal */}
            <div className="form-group">
              <label className="form-label">Update Logo</label>
              <input
                ref={editCompLogoInputRef}
                type="file"
                accept="image/*"
                onChange={handleEditCompLogoUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => editCompLogoInputRef.current?.click()}
                disabled={uploadingEditCompLogo}
                className="btn-dark"
                style={{ width: '100%', fontSize: '0.8rem' }}
              >
                <Upload size={14} color="#d6bc66" />
                <span>{uploadingEditCompLogo ? 'Uploading...' : 'CHANGE LOGO FILE'}</span>
              </button>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <input
                  type="checkbox"
                  checked={editCompStandingsEnabled}
                  onChange={(e) => setEditCompStandingsEnabled(e.target.checked)}
                />
                <span style={{ fontSize: '0.8rem', color: '#FFF' }}>Standings Table Enabled</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={editCompIsActive}
                  onChange={(e) => setEditCompIsActive(e.target.checked)}
                />
                <span style={{ fontSize: '0.8rem', color: '#FFF' }}>Competition Active</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" disabled={loading} className="btn-gold" style={{ flex: 1 }}>
                <Save size={16} /> Save Changes
              </button>
              <button type="button" onClick={handleCancelEditLeague} className="btn-dark" style={{ flex: 1 }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: CREATE FEATURE & MATCH SCORES (Competition First) */}
      {activeTab === 'MATCHES' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Subform A: Schedule New Match Feature */}
          <form onSubmit={handleCreateMatch} className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#d6bc66', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={18} /> CREATE MATCH FEATURE
            </h4>

            {/* STEP 1: COMPETITION SELECTION (COMPETITION FIRST) */}
            <div className="form-group">
              <label className="form-label" style={{ color: '#d6bc66', fontWeight: '900' }}>
                1. Select Football Competition
              </label>
              <select
                required
                className="form-control"
                style={{ borderColor: 'rgba(214, 188, 102, 0.6)', fontWeight: '800' }}
                value={scheduleCompetitionId}
                onChange={(e) => handleScheduleCompetitionChange(e.target.value)}
              >
                {registeredLeagues
                  .filter((l) => l.isActive !== false)
                  .map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.name} ({l.shortName || l.code}) • {l.type || 'League'}
                    </option>
                  ))}
              </select>
            </div>

            {/* Check eligible teams */}
            {(() => {
              const eligible = registeredTeams.filter((t) => {
                if (t.isActive === false) return false;
                const comps = Array.isArray(t.competitions) ? t.competitions : [];
                return comps.some((c) => {
                  const cId = typeof c === 'object' ? c._id : c;
                  return String(cId) === String(scheduleCompetitionId);
                });
              });

              if (eligible.length < 2) {
                return (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '0.8rem',
                    color: '#FCA5A5'
                  }}>
                    ⚠️ This competition has less than 2 registered teams ({eligible.length} found).
                    Please assign teams to this competition under the <strong>REGISTER TEAMS</strong> tab before scheduling matches.
                  </div>
                );
              }

              return null;
            })()}

            {/* STEP 2: HOME & AWAY TEAMS (FILTERED TO SELECTED COMPETITION) */}
            <div className="form-group">
              <label className="form-label">2. Home Team (From Selected Competition)</label>
              <select
                required
                className="form-control"
                value={homeTeamId}
                onChange={(e) => setHomeTeamId(e.target.value)}
              >
                {registeredTeams
                  .filter((t) => {
                    if (t.isActive === false) return false;
                    const comps = Array.isArray(t.competitions) ? t.competitions : [];
                    return comps.some((c) => {
                      const cId = typeof c === 'object' ? c._id : c;
                      return String(cId) === String(scheduleCompetitionId);
                    });
                  })
                  .map((t) => (
                    <option key={t._id} value={t._id}>{t.name} ({t.code})</option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">3. Away Team (From Selected Competition)</label>
              <select
                required
                className="form-control"
                value={awayTeamId}
                onChange={(e) => setAwayTeamId(e.target.value)}
              >
                {registeredTeams
                  .filter((t) => {
                    if (t.isActive === false) return false;
                    const comps = Array.isArray(t.competitions) ? t.competitions : [];
                    return comps.some((c) => {
                      const cId = typeof c === 'object' ? c._id : c;
                      return String(cId) === String(scheduleCompetitionId);
                    });
                  })
                  .map((t) => (
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

            <button
              type="submit"
              disabled={loading || registeredTeams.filter(t => t.competitions?.some(c => (c._id || c) === scheduleCompetitionId)).length < 2}
              className="btn-gold"
              style={{ width: '100%' }}
            >
              <PlusCircle size={16} />
              <span>CREATE MATCH FEATURE</span>
            </button>
          </form>

          {/* Subform B: Live Scoreline Update */}
          <form onSubmit={handleUpdateScore} className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#d6bc66', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={18} /> UPDATE LIVE SCORELINE
            </h4>

            {/* Filter by competition */}
            <div className="form-group">
              <label className="form-label">Filter Active Matches By Competition</label>
              <select
                className="form-control"
                value={scoreFilterComp}
                onChange={(e) => setScoreFilterComp(e.target.value)}
              >
                <option value="ALL">All Competitions ({matches.length})</option>
                {registeredLeagues.map((l) => (
                  <option key={l._id} value={l._id}>{l.name} ({l.shortName || l.code})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Active Match</label>
              <select
                className="form-control"
                value={selectedMatchId}
                onChange={(e) => {
                  setSelectedMatchId(e.target.value);
                  const m = matches.find((item) => item._id === e.target.value);
                  if (m) {
                    setHomeScore(m.homeScore || 0);
                    setAwayScore(m.awayScore || 0);
                    setMatchStatus(m.status || 'LIVE');
                    setCurrentMinute(m.currentMinute || m.minute || "75'");
                  }
                }}
              >
                {matches
                  .filter((m) => {
                    if (scoreFilterComp === 'ALL') return true;
                    const mCompId = typeof m.league === 'object' ? m.league?._id : m.league;
                    return String(mCompId) === String(scoreFilterComp);
                  })
                  .map((m) => {
                    const compTag = typeof m.league === 'object' ? (m.league?.shortName || m.league?.code || '') : '';
                    const homeLabel = typeof m.homeTeam === 'object' ? (m.homeTeam?.name || m.homeTeam?.code) : m.homeTeam;
                    const awayLabel = typeof m.awayTeam === 'object' ? (m.awayTeam?.name || m.awayTeam?.code) : m.awayTeam;
                    return (
                      <option key={m._id} value={m._id}>
                        {compTag ? `[${compTag}] ` : ''}{homeLabel} vs {awayLabel} ({m.status})
                      </option>
                    );
                  })}
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
                <option value="FINISHED">Completed / Full Time (FINISHED)</option>
                <option value="UPCOMING">UPCOMING / SCHEDULED</option>
                <option value="POSTPONED">POSTPONED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', marginTop: '1rem' }}>
              <RefreshCw size={16} />
              <span>UPDATE SCORELINE & RECALCULATE TABLE</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB: MANAGE FIXTURES (Admin & Editor) */}
      {activeTab === 'FIXTURES' && (
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
            <h4 style={{ color: '#d6bc66', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={18} /> ALL MATCH FIXTURES ({matches.length})
            </h4>

            {/* Competition Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '700' }}>Filter Competition:</span>
              <select
                className="form-control"
                style={{ fontSize: '0.78rem', width: 'auto', padding: '4px 10px' }}
                value={fixtureFilterComp}
                onChange={(e) => setFixtureFilterComp(e.target.value)}
              >
                <option value="ALL">All Competitions ({matches.length})</option>
                {registeredLeagues.map((l) => (
                  <option key={l._id} value={l._id}>{l.name} ({l.shortName || l.code})</option>
                ))}
              </select>
            </div>
          </div>

          {matches.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: '#94A3B8' }}>
              No fixtures scheduled yet. Use the CREATE FEATURE & SCORES tab to schedule matches.
            </div>
          ) : (
            <div style={{ maxHeight: '580px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {matches
                .filter((m) => {
                  if (fixtureFilterComp === 'ALL') return true;
                  const mCompId = typeof m.league === 'object' ? m.league?._id : m.league;
                  return String(mCompId) === String(fixtureFilterComp);
                })
                .map((m) => {
                  const homeName = typeof m.homeTeam === 'object'
                    ? (m.homeTeam?.shortName || m.homeTeam?.name)
                    : m.homeTeam || 'Home';
                  const awayName = typeof m.awayTeam === 'object'
                    ? (m.awayTeam?.shortName || m.awayTeam?.name)
                    : m.awayTeam || 'Away';
                  const matchLabel = `${homeName} vs ${awayName}`;

                  const compShort = typeof m.league === 'object'
                    ? (m.league?.shortName || m.league?.code || m.league?.name || '')
                    : '';

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
                      {/* Competition Badge */}
                      {compShort && (
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: '900',
                          color: '#d6bc66',
                          background: 'rgba(214, 188, 102, 0.15)',
                          border: '1px solid rgba(214, 188, 102, 0.35)',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          letterSpacing: '0.05em'
                        }}>
                          {compShort}
                        </span>
                      )}

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
                        <button
                          onClick={() => {
                            setSelectedMatchId(m._id);
                            setHomeScore(Number(m.homeScore) || 0);
                            setAwayScore(Number(m.awayScore) || 0);
                            setMatchStatus(m.status || 'LIVE');
                            setCurrentMinute(m.currentMinute || m.minute || "75'");
                            setActiveTab('MATCHES');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          title="Update score or status for this fixture"
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
                          <RefreshCw size={13} /> UPDATE SCORE
                        </button>
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

      {/* TAB 4: REGISTER TEAMS & COMPETITION MEMBERSHIPS */}
      {activeTab === 'TEAMS' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '1.5rem' }}>
          {/* Register Team Form */}
          <form onSubmit={handleCreateTeam} className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#d6bc66', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} /> REGISTER OFFICIAL CLUB
            </h4>

            {/* Team Name field with logo preview beside it */}
            <div className="form-group">
              <label className="form-label">Official Club Name</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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
                <label className="form-label">Team Code (3-4 Letters)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. ENY"
                  maxLength={4}
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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

              <div className="form-group">
                <label className="form-label">Country / Region</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Nigeria"
                  value={teamCountry}
                  onChange={(e) => setTeamCountry(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Home Stadium</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Enyimba International Stadium"
                value={teamStadium}
                onChange={(e) => setTeamStadium(e.target.value)}
              />
            </div>

            {/* Dedicated Team Logo Upload */}
            <div className="form-group">
              <label className="form-label">Team Logo</label>
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
                <span>{uploadingTeamLogo ? 'Uploading Logo...' : 'UPLOAD TEAM LOGO'}</span>
              </button>
            </div>

            {/* COMPETITION MEMBERSHIP CHECKLIST */}
            <div className="form-group">
              <label className="form-label" style={{ color: '#d6bc66', fontWeight: '800' }}>
                Competition Memberships (Select All That Apply)
              </label>
              <div style={{
                background: 'rgba(0, 11, 61, 0.6)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '160px',
                overflowY: 'auto'
              }}>
                {registeredLeagues.map((l) => {
                  const isChecked = teamCompetitionIds.includes(l._id);
                  return (
                    <label
                      key={l._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.8rem',
                        color: isChecked ? '#FFF' : '#CBD5E1',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTeamCompetitionIds([...teamCompetitionIds, l._id]);
                          } else {
                            setTeamCompetitionIds(teamCompetitionIds.filter((id) => id !== l._id));
                          }
                        }}
                        style={{ accentColor: '#d6bc66' }}
                      />
                      <span style={{ fontWeight: isChecked ? '800' : '500' }}>
                        {l.name} ({l.shortName || l.code})
                      </span>
                    </label>
                  );
                })}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>
                💡 A single club can participate in multiple competitions (e.g. NPFL + CAF).
              </div>
            </div>

            <button type="submit" disabled={loading || uploadingTeamLogo} className="btn-gold" style={{ width: '100%', marginTop: '0.5rem' }}>
              <PlusCircle size={16} />
              <span>REGISTER CLUB</span>
            </button>
          </form>

          {/* Registered Teams Table */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ color: '#FFF', fontWeight: '800', marginBottom: '1rem' }}>
              REGISTERED CLUBS IN DATABASE ({registeredTeams.length})
            </h4>

            {/* Filter controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '8px', marginBottom: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search clubs by name..."
                  className="form-control"
                  style={{ paddingLeft: '32px', fontSize: '0.8rem' }}
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                />
                <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>

              <select
                className="form-control"
                style={{ fontSize: '0.8rem' }}
                value={teamFilterComp}
                onChange={(e) => setTeamFilterComp(e.target.value)}
              >
                <option value="ALL">All Competitions</option>
                {registeredLeagues.map((l) => (
                  <option key={l._id} value={l._id}>{l.shortName || l.code || l.name}</option>
                ))}
              </select>
            </div>

            <div style={{ maxHeight: '520px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {registeredTeams
                .filter((t) => {
                  if (teamFilterComp !== 'ALL') {
                    const comps = Array.isArray(t.competitions) ? t.competitions : [];
                    const matchesComp = comps.some((c) => {
                      const cId = typeof c === 'object' ? c._id : c;
                      return String(cId) === String(teamFilterComp);
                    });
                    if (!matchesComp) return false;
                  }
                  if (teamSearch) {
                    const q = teamSearch.toLowerCase();
                    return (
                      t.name?.toLowerCase().includes(q) ||
                      t.shortName?.toLowerCase().includes(q) ||
                      t.code?.toLowerCase().includes(q)
                    );
                  }
                  return true;
                })
                .map((t) => {
                  const teamComps = Array.isArray(t.competitions) ? t.competitions : [];

                  return (
                    <div
                      key={t._id}
                      style={{
                        background: 'rgba(0, 11, 61, 0.75)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {t.logo ? (
                            <img
                              src={getImageUrl(t.logo)}
                              alt={t.name}
                              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : (
                            <Shield size={24} color="#d6bc66" />
                          )}
                          <div>
                            <div style={{ fontWeight: '800', color: '#FFF', fontSize: '0.95rem' }}>
                              {t.name} <span style={{ color: '#d6bc66' }}>({t.code})</span>
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#CBD5E1' }}>
                              {t.stadium || 'Stadium TBD'} • {t.city || 'City TBD'} ({t.country || 'Nigeria'})
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleStartEditTeam(t)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              background: 'rgba(255,255,255,0.08)',
                              color: '#FFF',
                              fontSize: '0.72rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Edit2 size={12} /> Edit
                          </button>

                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteTeam(t._id, t.name)}
                              style={{ color: '#EF4444', padding: '4px 6px', background: 'rgba(239,68,68,0.1)', borderRadius: '4px' }}
                              title="Delete Team"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Competition memberships pills */}
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700' }}>Competitions:</span>
                        {teamComps.length === 0 ? (
                          <span style={{ fontSize: '0.7rem', color: '#F59E0B' }}>No competition assigned</span>
                        ) : (
                          teamComps.map((c) => {
                            const cId = typeof c === 'object' ? c._id : c;
                            const compObj = registeredLeagues.find((l) => l._id === cId) || (typeof c === 'object' ? c : null);
                            const label = compObj?.shortName || compObj?.code || compObj?.name || 'Competition';

                            return (
                              <span
                                key={cId}
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: '800',
                                  background: 'rgba(214,188,102,0.15)',
                                  border: '1px solid rgba(214,188,102,0.3)',
                                  color: '#d6bc66',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                {label}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTeamCompetition(t._id, cId, t.name, label)}
                                  title={`Remove from ${label}`}
                                  style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 0, lineHeight: 1 }}
                                >
                                  ×
                                </button>
                              </span>
                            );
                          })
                        )}

                        {/* Quick assign button */}
                        <select
                          style={{
                            fontSize: '0.68rem',
                            background: 'rgba(5, 20, 84, 0.9)',
                            color: '#FFF',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '4px',
                            padding: '2px 4px',
                            marginLeft: 'auto'
                          }}
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAssignTeamCompetition(t._id, e.target.value);
                            }
                          }}
                        >
                          <option value="">+ Add to Competition</option>
                          {registeredLeagues
                            .filter((l) => !teamComps.some((c) => (typeof c === 'object' ? c._id : c) === l._id))
                            .map((l) => (
                              <option key={l._id} value={l._id}>{l.shortName || l.name}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT TEAM */}
      {editingTeam && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <form
            onSubmit={handleSaveEditTeam}
            className="glass-panel"
            style={{ width: '100%', maxWidth: '520px', padding: '1.5rem', borderRadius: '12px', background: '#000b3d' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ color: '#d6bc66', fontWeight: '900', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit2 size={18} /> EDIT CLUB DETAILS
              </h4>
              <button type="button" onClick={handleCancelEditTeam} style={{ color: '#94A3B8', padding: '4px' }}>
                <X size={18} />
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Club Name</label>
              <input
                type="text"
                required
                className="form-control"
                value={editTeamName}
                onChange={(e) => setEditTeamName(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Short Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={editTeamShortName}
                  onChange={(e) => setEditTeamShortName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={editTeamCode}
                  onChange={(e) => setEditTeamCode(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  value={editTeamCity}
                  onChange={(e) => setEditTeamCity(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control"
                  value={editTeamCountry}
                  onChange={(e) => setEditTeamCountry(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Home Stadium</label>
              <input
                type="text"
                className="form-control"
                value={editTeamStadium}
                onChange={(e) => setEditTeamStadium(e.target.value)}
              />
            </div>

            {/* Logo update in modal */}
            <div className="form-group">
              <label className="form-label">Update Club Logo</label>
              <input
                ref={editTeamLogoInputRef}
                type="file"
                accept="image/*"
                onChange={handleEditTeamLogoUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => editTeamLogoInputRef.current?.click()}
                disabled={uploadingEditTeamLogo}
                className="btn-dark"
                style={{ width: '100%', fontSize: '0.8rem' }}
              >
                <Upload size={14} color="#d6bc66" />
                <span>{uploadingEditTeamLogo ? 'Uploading...' : 'CHANGE LOGO FILE'}</span>
              </button>
            </div>

            {/* Competition memberships checkboxes in edit modal */}
            <div className="form-group">
              <label className="form-label">Competition Memberships</label>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '8px 12px',
                borderRadius: '8px',
                maxHeight: '120px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                {registeredLeagues.map((l) => {
                  const isChecked = editTeamCompetitionIds.includes(l._id);
                  return (
                    <label key={l._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#FFF' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditTeamCompetitionIds([...editTeamCompetitionIds, l._id]);
                          } else {
                            setEditTeamCompetitionIds(editTeamCompetitionIds.filter((id) => id !== l._id));
                          }
                        }}
                      />
                      <span>{l.name} ({l.shortName || l.code})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <button type="submit" disabled={loading} className="btn-gold" style={{ flex: 1 }}>
                <Save size={16} /> Save Changes
              </button>
              <button type="button" onClick={handleCancelEditTeam} className="btn-dark" style={{ flex: 1 }}>
                Cancel
              </button>
            </div>
          </form>
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