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

    // Utiliser la config globale pour les redirects
    const dashboardUrl = window.AINTERCOM_CONFIG ? 
      window.AINTERCOM_CONFIG.getFullUrl('/dashboard.html') :
      window.location.origin + '/dashboard.html';

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: dashboardUrl
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
      authenticated: true,
      isLoggedIn: true,
      user: session
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
 * Mettre à jour le bouton utilisateur dans le header
 */
function updateUserButton() {
  const userBtn = document.getElementById('user-btn');
  const userName = document.getElementById('user-name');
  
  if (!userBtn || !userName) return;
  
  const session = getSession();
  
  if (session) {
    // Utilisateur connecté - afficher le nom et profil
    userName.textContent = session.name || session.email;
    userBtn.title = `Connecté en tant que ${session.email}`;
    userBtn.className = 'user-btn authenticated';
    
    // Ajouter événement de déconnexion
    userBtn.onclick = async (e) => {
      e.preventDefault();
      
      // Afficher menu contextuel de déconnexion
      const menu = showUserMenu(session);
      userBtn.appendChild(menu);
    };
    
    console.log('✅ Bouton utilisateur mis à jour:', session.name);
  } else {
    // Utilisateur non connecté
    userName.textContent = 'Connexion';
    userBtn.title = 'Accédez à votre tableau de bord';
    userBtn.className = 'user-btn authenticated-false';
    
    // Ajouter événement de redirection vers login
    userBtn.onclick = (e) => {
      e.preventDefault();
      window.location.href = window.AINTERCOM_CONFIG ? 
        window.AINTERCOM_CONFIG.getFullUrl('/login.html') :
        '/login.html';
    };
    
    console.log('👤 Bouton utilisateur: non connecté');
  }
}

/**
 * Afficher menu contextuel utilisateur
 */
function showUserMenu(session) {
  // Vérifier si menu existe déjà
  const existingMenu = document.getElementById('user-menu');
  if (existingMenu) existingMenu.remove();
  
  const menu = document.createElement('div');
  menu.id = 'user-menu';
  menu.className = 'user-menu';
  menu.innerHTML = `
    <div class="user-menu-header">
      <i class="fas fa-user-circle"></i>
      <div>
        <div class="user-menu-name">${session.name}</div>
        <div class="user-menu-email">${session.email}</div>
      </div>
    </div>
    <hr>
    <button class="user-menu-item logout-btn">
      <i class="fas fa-sign-out-alt"></i>
      Déconnexion
    </button>
  `;
  
  // Ajouter styles si nécessaire
  if (!document.getElementById('user-menu-styles')) {
    const styles = document.createElement('style');
    styles.id = 'user-menu-styles';
    styles.textContent = `
      .user-menu {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 8px;
        background: var(--surface, #1a1a1a);
        border: 2px solid var(--gold, #d4af37);
        border-radius: 6px;
        padding: 12px;
        min-width: 240px;
        box-shadow: 0 0 30px rgba(212, 175, 55, 0.2);
        z-index: 1000;
      }
      
      .user-menu-header {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 12px;
        color: var(--text, #f5f5f5);
      }
      
      .user-menu-header i {
        font-size: 32px;
        color: var(--gold, #d4af37);
      }
      
      .user-menu-name {
        font-weight: 500;
        font-size: 14px;
      }
      
      .user-menu-email {
        font-size: 12px;
        color: var(--text-secondary, #b0b0b0);
      }
      
      .user-menu hr {
        border: none;
        border-top: 1px solid var(--border, #2a2a2a);
        margin: 8px 0;
      }
      
      .user-menu-item {
        width: 100%;
        padding: 10px 12px;
        background: none;
        border: none;
        color: var(--text, #f5f5f5);
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        border-radius: 4px;
        transition: all 0.2s;
      }
      
      .user-menu-item:hover {
        background: rgba(212, 175, 55, 0.1);
        color: var(--gold, #d4af37);
      }
      
      .logout-btn i {
        color: var(--error, #ff3b3b);
      }
      
      .logout-btn:hover {
        background: rgba(255, 59, 59, 0.1);
        color: var(--error, #ff3b3b);
      }
    `;
    document.head.appendChild(styles);
  }
  
  // Ajouter événement déconnexion
  menu.querySelector('.logout-btn').onclick = async () => {
    await signOut();
    updateUserButton();
    window.location.href = window.AINTERCOM_CONFIG ? 
      window.AINTERCOM_CONFIG.getFullUrl('/login.html') :
      '/login.html';
  };
  
  // Fermer menu si clic ailleurs
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target.id !== 'user-btn') {
      menu.remove();
    }
  });
  
  return menu;
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
        authenticated: true,
        isLoggedIn: true,
        user: session
      });
    }
    console.log('✅ Session restaurée:', session.email);
    updateUserButton();
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
        updateUserButton();
        return getSession();
      }
    } catch (error) {
      console.warn('⚠️ Erreur restauration session Supabase:', error.message);
    }
  }
  
  updateUserButton();
  return null;
}

/**
 * Initialiser onAuthStateChange pour surveiller les changements Supabase
 */
function setupAuthStateListener() {
  if (!supabaseClient) {
    console.log('⚠️ Supabase non disponible, listener désactivé');
    return;
  }
  
  // S'abonner aux changements d'authentification
  supabaseClient.auth.onAuthStateChange(async (event, session) => {
    console.log('🔐 Event d\'authentification:', event, session?.user?.email);
    
    if (session?.user) {
      // Utilisateur connecté (événement: SIGNED_IN, TOKEN_REFRESHED)
      saveSession({
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.name || session.user.email.split('@')[0],
        provider: session.user.app_metadata?.provider || 'email'
      });
      updateUserButton();
    } else {
      // Utilisateur déconnecté (événement: SIGNED_OUT)
      localStorage.removeItem('aintercom_session');
      if (window.AIStore) {
        window.AIStore.setState({
          user_session: null,
          authenticated: false,
          isLoggedIn: false,
          user: null
        });
      }
      updateUserButton();
    }
  });
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', async () => {
  const isInitialized = await initSupabaseClient();
  await restoreSession();
  
  // Activer la surveillance de l'authentification si Supabase est actif
  if (isInitialized) {
    setupAuthStateListener();
  }
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
    restoreSession,
    updateUserButton,
    setupAuthStateListener,
    showUserMenu
  };
}
