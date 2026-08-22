const API_ORIGIN = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getImageUrl = (url) => {
  if (!url) return 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image')) {
    return url;
  }
  if (url.startsWith('/uploads') || url.startsWith('uploads/')) {
    return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  return url;
};

export default getImageUrl;
