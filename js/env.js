/**
 * AINTERCOM OS — Environment Variables Loader
 * Charge les variables d'environnement pour le frontend
 * Les variables doivent être préfixées par VITE_ pour être accessibles
 */

(function() {
  // Configuration par défaut (pour développement)
  const defaultConfig = {
    VITE_SUPABASE_URL: 'https://wmbyccbyhtjzvsxxrsbe.supabase.co',
    VITE_SUPABASE_KEY: 'sb_publishable_EpUIqIUw_xcbF_M74ht-dg_eUg66XrS',
    VITE_GOOGLE_CLIENT_ID: '954468290161-630n35skt9g1eo01pprt37u7ucbep24s.apps.googleusercontent.com',
    VITE_ENV: 'development',
    VITE_APP_NAME: 'AINTERCOM OS',
    VITE_APP_VERSION: '2.0.0',
    VITE_DEBUG: 'false',
    VITE_OFFLINE_MODE: 'true'
  };

  // Fusionner avec les variables d'environnement disponibles
  window.__ENV__ = {
    ...defaultConfig,
    // Les variables d'environnement réelles seront injectées ici
    // lors du build ou via un serveur de développement
  };

  // Log de configuration (uniquement en mode debug)
  if (window.__ENV__.VITE_DEBUG === 'true') {
    console.log('%c🎙️ AINTERCOM Environment', 'color: #d4af37; font-weight: bold; font-size: 14px;');
    console.log('Supabase URL:', window.__ENV__.VITE_SUPABASE_URL ? '✓ Configuré' : '✗ Non configuré');
    console.log('Supabase Key:', window.__ENV__.VITE_SUPABASE_KEY ? '✓ Configuré' : '✗ Non configuré');
    console.log('Environment:', window.__ENV__.VITE_ENV);
    console.log('Debug Mode:', window.__ENV__.VITE_DEBUG);
  }

  // Fonction utilitaire pour accéder aux variables
  window.getEnv = function(key, defaultValue = '') {
    return window.__ENV__[key] || defaultValue;
  };

  // Exporter pour les modules
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.__ENV__;
  }
})();