/**
 * AINTERCOM OS — Auth Logic (Simplifiée)
 * Gère l'authentification Supabase : signIn, signUp, signOut
 * Version moderne et simplifiée
 */

// Définir l'objet global immédiatement
window.AintercomAuth = {};

// Attendre que window.__ENV__ soit disponible
function waitForEnv() {
  return new Promise((resolve) => {
    if (window.__ENV__) {
      resolve(window.__ENV__);
    } else {
      const checkInterval = setInterval(() => {
        if (window.__ENV__) {
          clearInterval(checkInterval);
          resolve(window.__ENV__);
        }
      }, 50);
      
      // Timeout après 2 secondes
      setTimeout(() => {
        clearInterval(checkInterval);
        console.warn('⚠️ window.__ENV__ non trouvé après 2 secondes, utilisation des valeurs par défaut');
        resolve(null);
      }, 2000);
    }
  });
}

// Configuration Supabase - Utilise les variables d'environnement
let SUPABASE_CONFIG = null;

async function getSupabaseConfig() {
  if (!SUPABASE_CONFIG) {
    const env = await waitForEnv();
    SUPABASE_CONFIG = {
      url: env?.VITE_SUPABASE_URL || 'https://wmbyccbyhtjzvsxxrsbe.supabase.co',
      key: env?.VITE_SUPABASE_KEY || 'sb_publishable_EpUIqIUw_xcbF_M74ht-dg_eUg66XrS'
    };
  }
  return SUPABASE_CONFIG;
}

let supabase = null;

/**
 * Initialiser Supabase
 */
window.AintercomAuth.initSupabase = async function initSupabase() {
  try {
    if (typeof window.supabase === 'undefined') {
      console.warn('⚠️ Supabase SDK non chargée. Mode DÉMO activé.');
      return false;
    }
    
    if (!supabase) {
      supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
      console.log('✅ Supabase initialisé');
    }
    return true;
  } catch (error) {
    console.error('❌ Erreur initiation Supabase:', error);
    return false;
  }
}

/**
 * Connexion avec Google OAuth
 */
window.AintercomAuth.signInWithGoogle = async function signInWithGoogle() {
  try {
    if (!supabase) {
      await window.AintercomAuth.initSupabase();
    }

    const redirectUrl = 'https://live.aintercom.fr/interface.html';
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });

    if (error) throw error;
    
    console.log('✅ Connexion Google initiée');
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erreur Google Sign-In:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Connexion avec Email/Mot de passe
 */
window.AintercomAuth.signInWithEmail = async function signInWithEmail(email, password) {
  try {
    if (!supabase) {
      await window.AintercomAuth.initSupabase();
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    
    // Sauvegarder la session
    window.AintercomAuth.saveSession(data.user);
    console.log('✅ Connexion réussie:', email);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erreur Email Sign-In:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Inscription avec Email/Mot de passe
 */
window.AintercomAuth.signUpWithEmail = async function signUpWithEmail(email, password, fullName = null) {
  try {
    if (!supabase) {
      await window.AintercomAuth.initSupabase();
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: fullName || email.split('@')[0],
          created_at: new Date().toISOString()
        }
      }
    });

    if (error) throw error;
    
    console.log('✅ Inscription réussie:', email);
    return { 
      success: true, 
      data,
      message: 'Inscription réussie. Vérifiez votre email pour confirmer votre compte.'
    };
  } catch (error) {
    console.error('❌ Erreur Sign-Up:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Déconnexion
 */
window.AintercomAuth.signOut = async function signOut() {
  try {
    if (supabase) {
      await supabase.auth.signOut();
    }
    
    // Supprimer la session locale
    localStorage.removeItem('aintercom_session');
    
    // Mettre à jour l'état global si disponible
    if (window.AIStore) {
      window.AIStore.setState({
        user_session: null,
        authenticated: false,
        isLoggedIn: false
      });
    }
    
    console.log('👋 Déconnexion réussie');
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur déconnexion:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Sauvegarder la session utilisateur
 */
window.AintercomAuth.saveSession = function saveSession(user) {
  const session = {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.email.split('@')[0],
    provider: user.app_metadata?.provider || 'email',
    timestamp: Date.now()
  };
  
  localStorage.setItem('aintercom_session', JSON.stringify(session));
  
  // Mettre à jour l'état global
  if (window.AIStore) {
    window.AIStore.setState({
      user_session: session,
      authenticated: true,
      isLoggedIn: true,
      user: session
    });
  }
  
  console.log('💾 Session sauvegardée:', session.email);
}

/**
 * Récupérer la session actuelle
 */
window.AintercomAuth.getSession = function getSession() {
  const sessionStr = localStorage.getItem('aintercom_session');
  if (!sessionStr) return null;

  try {
    const session = JSON.parse(sessionStr);
    
    // Vérifier l'expiration (24h)
    if (Date.now() - session.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('aintercom_session');
      return null;
    }
    
    return session;
  } catch (e) {
    return null;
  }
}

/**
 * Vérifier si l'utilisateur est connecté
 */
window.AintercomAuth.isAuthenticated = function isAuthenticated() {
  return window.AintercomAuth.getSession() !== null;
}

/**
 * Rediriger vers la page de connexion si non authentifié
 */
window.AintercomAuth.requireAuth = function requireAuth(redirectTo = '/login.html') {
  if (!window.AintercomAuth.isAuthenticated()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

/**
 * Mode DÉMO pour développement
 */
window.AintercomAuth.demoSignIn = function demoSignIn(email = 'demo@aintercom.com', password = 'demo123') {
  const demoUser = {
    id: 'demo_' + Date.now(),
    email: email,
    name: email.split('@')[0],
    provider: 'demo'
  };
  
  window.AintercomAuth.saveSession(demoUser);
  return { success: true, data: { user: demoUser } };
}

/**
 * Initialiser l'authentification au chargement
 */
window.AintercomAuth.initAuth = async function initAuth() {
  await window.AintercomAuth.initSupabase();
  
  // Restaurer la session existante
  const session = window.AintercomAuth.getSession();
  if (session) {
    console.log('✅ Session restaurée:', session.email);
  }
  
  // Écouter les changements d'authentification
  if (supabase) {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Événement auth:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        window.AintercomAuth.saveSession(session.user);
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('aintercom_session');
        if (window.AIStore) {
          window.AIStore.setState({
            user_session: null,
            authenticated: false,
            isLoggedIn: false
          });
        }
      }
    });
  }
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', window.AintercomAuth.initAuth);

// Log de vérification
console.log('✅ AintercomAuth chargé', window.AintercomAuth);
