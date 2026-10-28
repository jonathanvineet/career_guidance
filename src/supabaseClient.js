import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.REACT_APP_SUPABASE_URL ? process.env.REACT_APP_SUPABASE_URL.trim() : '';
const rawKey = process.env.REACT_APP_SUPABASE_ANON_KEY ? process.env.REACT_APP_SUPABASE_ANON_KEY.trim() : '';

// Supabase requires a valid HTTP or HTTPS URL (e.g., https://your-project.supabase.co)
const isValidHttpUrl = (str) => {
  if (!str) return false;
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

const isConfigured = isValidHttpUrl(rawUrl) && rawKey.length > 0;

if (!isConfigured) {
  console.warn(
    'Supabase Configuration Notice:\n' +
    'REACT_APP_SUPABASE_URL must be a valid HTTP/HTTPS URL (e.g. https://<project-ref>.supabase.co).\n' +
    'Falling back to a safe placeholder URL so the application UI remains fully functional.'
  );
}

export const supabase = createClient(
  isValidHttpUrl(rawUrl) ? rawUrl : 'https://placeholder.supabase.co',
  rawKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);

