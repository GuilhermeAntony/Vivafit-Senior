const appJson = require('./app.json');

module.exports = () => {
  const expo = { ...(appJson.expo || {}) };

  // Ensure required plugins array exists and includes expo-web-browser
  expo.plugins = Array.isArray(expo.plugins) ? expo.plugins.slice() : [];
  if (!expo.plugins.includes('expo-web-browser')) {
    expo.plugins.push('expo-web-browser');
  }

  expo.extra = expo.extra || {};
  expo.extra.supabase = {
    url: process.env.SUPABASE_URL || (expo.extra.supabase && expo.extra.supabase.url) || 'https://your-supabase-url.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || (expo.extra.supabase && expo.extra.supabase.anonKey) || 'your-anon-key',
  };
  
  return { expo };
};
