import axios from 'axios';

const API_BASE_URL = 'https://dx-sport-backend.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dx_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const API = {
  // --- AUTHENTICATION ---
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem('dx_auth_token', response.data.token);
        localStorage.setItem('dx_user', JSON.stringify(response.data.user));
        return { success: true, user: response.data.user, token: response.data.token };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // --- POSTS / ARTICLES ---
  async getPosts(category = 'ALL') {
    try {
      const query = (category && category !== 'ALL' && category !== 'ABOUT' && category !== 'STANDINGS')
        ? `?category=${encodeURIComponent(category)}`
        : '';
      const response = await api.get(`/posts${query}`);
      if (response.data && response.data.posts) {
        return response.data.posts;
      }
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (err) {
      console.error('[API Error] Fetch posts failed:', err.message);
      return [];
    }
  },

  async getPostBySlug(slug) {
    try {
      const response = await api.get(`/posts/${slug}`);
      return response.data?.post || response.data?.data || null;
    } catch (err) {
      console.error('[API Error] Fetch post detail failed:', err.message);
      return null;
    }
  },

  async createPost(postData) {
    try {
      const response = await api.post('/posts', postData);
      return { success: true, data: response.data?.post || response.data?.data || response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  async updatePost(id, postData) {
    try {
      const response = await api.put(`/posts/${id}`, postData);
      return { success: true, data: response.data?.post || response.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  async deletePost(id) {
    try {
      const response = await api.delete(`/posts/${id}`);
      return { success: true, message: response.data?.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // --- MATCHES & SCORELINE ---
  async getMatches() {
    try {
      const response = await api.get('/matches');
      return response.data?.matches || response.data?.data || [];
    } catch (err) {
      console.error('[API Error] Fetch matches failed:', err.message);
      return [];
    }
  },

  async createMatch(matchData) {
    try {
      const response = await api.post('/matches', matchData);
      return { success: true, match: response.data?.match };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  async updateScoreline(matchId, homeScore, awayScore, status, currentMinute) {
    try {
      const response = await api.patch(`/matches/${matchId}/scoreline`, {
        homeScore: Number(homeScore),
        awayScore: Number(awayScore),
        status,
        currentMinute: currentMinute ? Number(currentMinute) : undefined
      });
      return { success: true, match: response.data?.match, tableAutoUpdated: response.data?.tableAutoUpdated };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  async deleteMatch(id) {
    try {
      const response = await api.delete(`/matches/${id}`);
      return { success: true, message: response.data?.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  async cancelMatch(id) {
    try {
      const response = await api.patch(`/matches/${id}/cancel`);
      return { success: true, match: response.data?.match, message: response.data?.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // --- TEAMS REGISTRATION & MANAGEMENT ---
  async getTeams() {
    try {
      const response = await api.get('/teams');
      return response.data?.teams || [];
    } catch (err) {
      console.error('[API Error] Fetch teams failed:', err.message);
      return [];
    }
  },

  async createTeam(teamData) {
    try {
      const response = await api.post('/teams', teamData);
      return { success: true, team: response.data?.team };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  async deleteTeam(id) {
  try {
    const response = await api.delete(`/teams/${id}`);

    return {
      success: true,
      message: response.data?.message,
      deletedTeamId: response.data?.deletedTeamId,
      deletedTeamName: response.data?.deletedTeamName,
      affectedLeagues: response.data?.affectedLeagues || []
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.message || err.message
    };
  }
},

  // --- LEAGUES ---
  async getLeagues() {
    try {
      const response = await api.get('/leagues');
      return response.data?.leagues || [];
    } catch (err) {
      console.error('[API Error] Fetch leagues failed:', err.message);
      return [];
    }
  },

  // --- LEAGUE STANDINGS (AUTOMATED) ---

  async getStandings() {
    try {
      const response = await api.get('/table');
      return response.data?.standings || [];
    } catch (err) {
      console.error('[API Error] Fetch standings failed:', err.message);
      return [];
    }
  },

  // --- ADMIN & USERS CONTROL ---
  async addEditor(userData) {
    try {
      const response = await api.post('/admin/editors', userData);
      return { success: true, user: response.data?.editor };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  async listEditors() {
    try {
      const response = await api.get('/admin/editors');
      return response.data?.editors || [];
    } catch (err) {
      console.error('[API Error] List editors failed:', err.message);
      return [];
    }
  },

  async deleteEditor(id) {
    try {
      const response = await api.delete(`/admin/editors/${id}`);
      return { success: true, message: response.data?.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  async getAuditLogs() {
    try {
      const response = await api.get('/admin/audit-logs');
      return response.data?.logs || response.data?.auditLogs || [];
    } catch (err) {
      console.error('[API Error] Fetch audit logs failed:', err.message);
      return [];
    }
  },

  // --- TRANSFER MARKET RADAR ---
  async getTransfers() {
    try {
      const response = await api.get('/transfers');
      return response.data?.transfers || [];
    } catch (err) {
      console.error('[API Error] Fetch transfers failed:', err.message);
      return [];
    }
  },

  async createTransfer(transferData) {
    try {
      const response = await api.post('/transfers', transferData);
      return { success: true, transfer: response.data?.transfer };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  async deleteTransfer(id) {
    try {
      const response = await api.delete(`/transfers/${id}`);
      return { success: true, message: response.data?.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // --- MEDIA GALLERY ---
  async getMedia() {
    try {
      const response = await api.get('/media');
      return response.data?.media || [];
    } catch (err) {
      console.error('[API Error] Fetch media gallery failed:', err.message);
      return [];
    }
  },

  /**
   * Upload a media file AND save the record to the Media collection.
   * This is the single method Editors/Admins should call when publishing a gallery item.
   * It sends title + caption alongside the file so the backend creates the Media document.
   */
  async createMedia(file, title, caption) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (title) formData.append('title', title);
      if (caption) formData.append('caption', caption);
      const response = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data?.media) {
        return { success: true, media: response.data.media, url: response.data.media.url };
      }
      return { success: false, error: 'Upload succeeded but media record was not returned.' };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  async deleteMedia(id) {
    try {
      const response = await api.delete(`/media/${id}`);
      return { success: true, message: response.data?.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  /**
   * Upload a file purely for URL retrieval (article images, team logos).
   * Returns { success, url }. Falls back to base64 data URI if the server is
   * unreachable so that local previews still work.
   */
  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data && response.data.media) {
        return { success: true, url: response.data.media.url };
      }
    } catch (err) {
      console.warn('[API Upload Warning] Local preview fallback used:', err.message);
    }
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({ success: true, url: reader.result });
      reader.readAsDataURL(file);
    });
  }
};
