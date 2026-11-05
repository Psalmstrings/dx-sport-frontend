import { API } from './api';

// Helper to generate a random client-side UUID
const generateId = (prefix = 'dx') => {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
};

class ClientAnalytics {
  constructor() {
    this.visitorId = this.getOrCreateVisitorId();
    this.sessionId = this.getOrCreateSessionId();
    this.lastTrackedPath = null;
    this.lastTrackedTime = 0;
  }

  getOrCreateVisitorId() {
    try {
      let vid = localStorage.getItem('dx_visitor_id');
      if (!vid) {
        vid = generateId('vis');
        localStorage.setItem('dx_visitor_id', vid);
      }
      return vid;
    } catch (e) {
      return generateId('vis');
    }
  }

  getOrCreateSessionId() {
    try {
      let sid = sessionStorage.getItem('dx_session_id');
      if (!sid) {
        sid = generateId('sess');
        sessionStorage.setItem('dx_session_id', sid);
      }
      return sid;
    } catch (e) {
      return generateId('sess');
    }
  }

  /**
   * Track a page view with path and optional title
   */
  track(path, title) {
    try {
      const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname : '/');
      const currentTitle = title || (typeof document !== 'undefined' ? document.title : '');
      const now = Date.now();

      // Debounce if same path within 3 seconds
      if (this.lastTrackedPath === currentPath && now - this.lastTrackedTime < 3000) {
        return;
      }

      this.lastTrackedPath = currentPath;
      this.lastTrackedTime = now;

      const referrer = typeof document !== 'undefined' ? document.referrer : '';

      API.trackVisit({
        visitorId: this.visitorId,
        sessionId: this.sessionId,
        path: currentPath,
        title: currentTitle,
        referrer
      }).catch(() => {
        // Silent catch: analytics errors should never break user browsing
      });
    } catch (err) {
      // Ignore
    }
  }
}

export const analytics = new ClientAnalytics();
export default analytics;
