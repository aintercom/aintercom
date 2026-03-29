/**
 * AINTERCOM OS — Supabase Authentication Client
 * Gère la connexion Google via Supabase Auth
 * 
 * Configuration requise:
 * 1. Créer compte Supabase (https://supabase.com)
 * 2. Ajouter CLIENT_ID Google OAuth dans env ou config
 * 3. Configurer URL de redirection: https://yourdomain.com/auth/callback
 */

// Configuration Supabase (remplacer par vos valeurs)
const SUPABASE_CONFIG = {
  url: 'https://wmbyccbyhtjzvsxxrsbe.supabase.co',
  key: 'sb_publishable_EpUIqIUw_xcbF_M74ht-dg_eUg66XrS'
};

// Ou utiliser des variables d'environnement si disponibles
if (window.__ENV__ && window.__ENV__.SUPABASE_URL) {
  SUPABASE_CONFIG.url = window.__ENV__.SUPABASE_URL;
  SUPABASE_CONFIG.key = window.__ENV__.SUPABASE_KEY;
}

// Initialiser Supabase client
let supabaseClient = null;

/**
 * Initialiser le client Supabase
 */
async function initSupabaseClient() {
  try {
    // Charge la SDK Supabase dynamiquement si nécessaire
    if (typeof supabase === 'undefined') {
      // SDK pas chargée - utiliser mode démo
      console.warn('⚠️ Supabase SDK non chargée. Mode DÉMO activé.');
      return false;
    }
    
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
    console.log('✅ Supabase client initialié');
    return true;
  } catch (error) {
    console.error('❌ Erreur initiation Supabase:', error.message);
    return false;
  }
}

/**
 * Google Sign-In via Supabase OAuth
 */
async function signInWithGoogle() {
  try {
    // Mode démo si Supabase non disponible
    if (!supabaseClient) {
      return signInDemo('google');
    }

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard.html`
      }
    });

    if (error) {
      throw error;
    }

    console.log('✅ Connexion Google initiée');
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erreur Google Sign-In:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Email/Password Sign-In (fallback)
 */
async function signInWithEmail(email, password) {
  try {
    if (!supabaseClient) {
      return signInDemo('email', email, password);
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    // Sauvegarder session
    saveSession(data.user);
    console.log('✅ Connexion Email réussie');
    return { success: true, data };
  } catch (error) {
    console.error('❌ Erreur Email Sign-In:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Mode DÉMO (sans Supabase)
 * Pour développement local et tests
 */
function signInDemo(provider, email = null, password = null) {
  // Demo credentials
  const DEMO_USERS = {
    'demo@aintercom.com': 'demo123',
    'regie@test.com': 'demo123'
  };

  if (provider === 'google') {
    // Simuler Google sign-in
    const demoUser = {
      id: 'google_' + Date.now(),
      email: 'producer@aintercom.demo',
      name: 'Production Manager',
      provider: 'google',
      avatar: 'https://ui-avatars.com/api/?name=Production+Manager&background=d4af37&color=000'
    };
    saveSession(demoUser);
    return { success: true, data: { user: demoUser } };
  }

  if (provider === 'email') {
    if (DEMO_USERS[email] && DEMO_USERS[email] === password) {
      const demoUser = {
        id: 'email_' + Date.now(),
        email,
        name: email.split('@')[0],
        provider: 'email'
      };
      saveSession(demoUser);
      return { success: true, data: { user: demoUser } };
    }
    return { success: false, error: 'Email ou mot de passe incorrect' };
  }
}

/**
 * Sauvegarder session utilisateur
 */
function saveSession(user) {
  const session = {
    id: user.id,
    email: user.email,
    name: user.name || user.email.split('@')[0],
    provider: user.provider || 'email',
    timestamp: Date.now()
  };
  
  localStorage.setItem('aintercom_session', JSON.stringify(session));
  
  // Mettre à jour AIStore si disponible
  if (window.AIStore) {
    window.AIStore.setState({
      user_session: session,
      authenticated: true
    });
  }
  
  console.log('💾 Session sauvegardée:', session.email);
}

/**
 * Récupérer session actuelle
 */
function getSession() {
  const sessionStr = localStorage.getItem('aintercom_session');
  if (!sessionStr) return null;

  try {
    const session = JSON.parse(sessionStr);
    
    // Vérifier si session expirée (24h)
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
 * Déconnexion
 */
async function signOut() {
  try {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    
    localStorage.removeItem('aintercom_session');
    
    if (window.AIStore) {
      window.AIStore.setState({
        user_session: null,
        authenticated: false
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
 * Vérifier et restaurer session existante
 */
async function restoreSession() {
  const session = getSession();
  
  if (session) {
    if (window.AIStore) {
      window.AIStore.setState({
        user_session: session,
        authenticated: true
      });
    }
    console.log('✅ Session restaurée:', session.email);
    return session;
  }
  
  // Tentative récupération depuis Supabase si disponible
  if (supabaseClient) {
    try {
      const { data: { session: sbSession } } = await supabaseClient.auth.getSession();
      
      if (sbSession?.user) {
        const user = sbSession.user;
        saveSession({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email.split('@')[0],
          provider: user.app_metadata?.provider || 'email'
        });
        return getSession();
      }
    } catch (error) {
      console.warn('⚠️ Erreur restauration session Supabase:', error.message);
    }
  }
  
  return null;
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', () => {
  initSupabaseClient();
  restoreSession();
});

// Exporter pour utilisation
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initSupabaseClient,
    signInWithGoogle,
    signInWithEmail,
    saveSession,
    getSession,
    signOut,
    restoreSession
  };
}
