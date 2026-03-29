/**
 * AINTERCOM OS — Gateway de Sécurité
 * Redirige vers login.html si l'utilisateur n'est pas connecté
 * Protège les pages nécessitant une authentification
 */

/**
 * Vérifier si l'utilisateur est authentifié
 * Utilise la session locale ou Supabase
 */
function isAuthenticated() {
  // Vérifier la session locale
  const sessionStr = localStorage.getItem('aintercom_session');
  if (!sessionStr) return false;

  try {
    const session = JSON.parse(sessionStr);
    
    // Vérifier l'expiration (24h)
    if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('aintercom_session');
      return false;
    }
    
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Rediriger vers la page de connexion
 * @param {string} redirectTo - Page à laquelle retourner après connexion
 */
function redirectToLogin(redirectTo = null) {
  const currentPath = window.location.pathname;
  const loginUrl = '/login.html';
  
  // Si on est déjà sur la page de login, ne pas rediriger
  if (currentPath.includes('login.html')) {
    return;
  }
  
  // Construire l'URL de redirection avec le retour
  let redirectUrl = loginUrl;
  if (redirectTo && !redirectTo.includes('login.html')) {
    redirectUrl += `?redirect=${encodeURIComponent(redirectTo)}`;
  } else if (currentPath && currentPath !== '/') {
    redirectUrl += `?redirect=${encodeURIComponent(currentPath)}`;
  }
  
  console.log(`🔒 Redirection vers login: ${redirectUrl}`);
  window.location.href = redirectUrl;
}

/**
 * Protéger une page spécifique
 * @param {string[]} allowedPaths - Chemins autorisés sans authentification
 */
function protectPage(allowedPaths = ['/login.html', '/index.html', '/']) {
  const currentPath = window.location.pathname;
  
  // Vérifier si la page actuelle est autorisée sans authentification
  const isAllowed = allowedPaths.some(path => 
    currentPath === path || currentPath.includes(path)
  );
  
  if (isAllowed) {
    console.log(`✅ Page autorisée sans authentification: ${currentPath}`);
    return;
  }
  
  // Vérifier l'authentification
  if (!isAuthenticated()) {
    console.log(`🔒 Accès refusé à: ${currentPath}`);
    redirectToLogin(currentPath);
  } else {
    console.log(`✅ Accès autorisé à: ${currentPath}`);
  }
}

/**
 * Récupérer le paramètre de redirection depuis l'URL
 */
function getRedirectParam() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('redirect');
}

/**
 * Rediriger vers la page d'origine après connexion
 */
function redirectAfterLogin(defaultRedirect = '/dashboard.html') {
  const redirectTo = getRedirectParam() || defaultRedirect;
  
  // Vérifier que la redirection est valide (pas vers login)
  if (redirectTo && !redirectTo.includes('login.html')) {
    console.log(`↪️ Redirection après login vers: ${redirectTo}`);
    setTimeout(() => {
      window.location.href = redirectTo;
    }, 1500);
  } else {
    console.log(`↪️ Redirection par défaut vers: ${defaultRedirect}`);
    setTimeout(() => {
      window.location.href = defaultRedirect;
    }, 1500);
  }
}

/**
 * Initialiser la protection de page
 * @param {boolean} autoProtect - Activer la protection automatique
 */
function initGateway(autoProtect = true) {
  console.log('🔐 Gateway de sécurité initialisé');
  
  if (autoProtect) {
    protectPage();
  }
  
  // Exposer les fonctions globalement
  window.AintercomGateway = {
    isAuthenticated,
    protectPage,
    redirectToLogin,
    redirectAfterLogin,
    getRedirectParam
  };
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', () => {
  initGateway();
  
  // Pour la page login, vérifier si déjà connecté
  if (window.location.pathname.includes('login.html')) {
    const session = localStorage.getItem('aintercom_session');
    if (session) {
      console.log('✅ Déjà connecté, redirection...');
      redirectAfterLogin();
    }
  }
});

// Exporter pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isAuthenticated,
    protectPage,
    redirectToLogin,
    redirectAfterLogin,
    initGateway
  };
}