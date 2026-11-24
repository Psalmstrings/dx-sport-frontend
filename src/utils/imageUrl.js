const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BACKEND_BASE = RAW_API_URL.replace(/\/api(\/v\d+)?\/?$/, '');

export const getImageUrl = (url) => {
  if (!url) return 'https://dxsportz.com/og-default.png';
  if (typeof url !== 'string') return 'https://dxsportz.com/og-default.png';
  
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image')) {
    return url;
  }
  if (url.startsWith('/uploads') || url.startsWith('uploads/')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${BACKEND_BASE}${cleanPath}`;
  }
  return url;
};

export default getImageUrl;
