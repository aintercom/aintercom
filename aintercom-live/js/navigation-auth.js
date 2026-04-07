/**
 * AINTERCOM LIVE - Navigation et Authentification
 * Améliorations pour la navigation entre index et app + gestion de connexion
 */

// Configuration
const AUTH_CONFIG = {
    sessionKey: 'aintercom_session',
    projectKey: 'aintercom_current_project'
};

/**
 * Initialiser l'authentification et la navigation
 */
async function initNavigationAuth() {
    console.log('🔐 Initialisation navigation et authentification...');
    
    // Vérifier si nous sommes dans app.html ou index.html
    const isAppPage = window.location.pathname.includes('app.html');
    const isIndexPage = window.location.pathname.includes('index.html');
    
    // Initialiser l'authentification si le script auth-check.js est disponible
    if (typeof initAuth !== 'undefined') {
        const user = await initAuth();
        if (user) {
            updateUserDisplay(user);
        }
    } else {
        console.warn('⚠️ auth-check.js non chargé, utilisation du mode local');
        // Vérifier la session locale
        const session = localStorage.getItem(AUTH_CONFIG.sessionKey);
        if (session) {
            try {
                const user = JSON.parse(session);
                updateUserDisplay(user);
            } catch (e) {
                console.error('❌ Session locale invalide:', e);
            }
        }
    }
    
    // Configurer les boutons spécifiques à chaque page
    if (isAppPage) {
        setupAppNavigation();
    } else if (isIndexPage) {
        setupIndexNavigation();
    }
}

/**
 * Configurer la navigation pour app.html
 */
function setupAppNavigation() {
    console.log('🔄 Configuration navigation app.html');
    
    // Remplacer la fonction logout() par handleLogout()
    if (typeof handleLogout !== 'undefined') {
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) {
            userAvatar.setAttribute('onclick', 'handleLogout()');
            userAvatar.title = 'Se déconnecter';
        }
    }
    
    // Ajouter le bouton "Retour aux projets" s'il n'existe pas déjà
    const headerActions = document.querySelector('#hdr > div:last-child');
    if (headerActions && !document.querySelector('.btn-projects')) {
        const projectsBtn = document.createElement('button');
        projectsBtn.className = 'btn btn-ghost btn-sm btn-projects';
        projectsBtn.innerHTML = '<i class="fas fa-list"></i> Projets';
        projectsBtn.title = 'Retour aux projets';
        projectsBtn.onclick = goToIndex;
        
        // Insérer avant le bouton SOS
        const sosBtn = headerActions.querySelector('.btn-sos');
        if (sosBtn) {
            headerActions.insertBefore(projectsBtn, sosBtn);
        } else {
            headerActions.prepend(projectsBtn);
        }
        
        console.log('✅ Bouton "Projets" ajouté');
    }
}

/**
 * Configurer la navigation pour index.html
 */
function setupIndexNavigation() {
    console.log('🔄 Configuration navigation index.html');
    
    // Ajouter un bouton de déconnexion dans le header si auth-check.js est disponible
    if (typeof handleLogout !== 'undefined') {
        const header = document.querySelector('.header');
        if (header) {
            const statusBar = header.querySelector('.status-bar');
            if (statusBar && !document.getElementById('index-logout-btn')) {
                const logoutBtn = document.createElement('button');
                logoutBtn.id = 'index-logout-btn';
                logoutBtn.className = 'btn btn-ghost btn-sm';
                logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Déconnexion';
                logoutBtn.title = 'Se déconnecter';
                logoutBtn.onclick = handleLogout;
                
                statusBar.appendChild(logoutBtn);
                console.log('✅ Bouton déconnexion ajouté à index.html');
            }
        }
    }
}

/**
 * Mettre à jour l'affichage de l'utilisateur
 */
function updateUserDisplay(user) {
    if (!user) return;
    
    const userName = user.name || user.email.split('@')[0];
    const userInitial = userName.charAt(0).toUpperCase();
    
    // Mettre à jour l'avatar dans app.html
    const userAvatar = document.getElementById('user-avatar');
    if (userAvatar) {
        userAvatar.textContent = userInitial;
        userAvatar.title = `Connecté: ${userName}`;
        
        // Ajouter un style amélioré
        userAvatar.style.cssText = `
            width: 28px;
            height: 28px;
            border-radius: 7px;
            background: linear-gradient(135deg, #2563EB, #1D4ED8);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 800;
            color: #fff;
            cursor: pointer;
            flex-shrink: 0;
            transition: all 0.2s ease;
        `;
        
        userAvatar.addEventListener('mouseenter', () => {
            userAvatar.style.transform = 'scale(1.1)';
            userAvatar.style.boxShadow = '0 0 0 2px rgba(37, 99, 235, 0.3)';
        });
        
        userAvatar.addEventListener('mouseleave', () => {
            userAvatar.style.transform = 'scale(1)';
            userAvatar.style.boxShadow = 'none';
        });
    }
    
    // Mettre à jour l'affichage dans index.html si nécessaire
    const statusIndicator = document.querySelector('.status-indicator');
    if (statusIndicator) {
        const userInfo = document.createElement('span');
        userInfo.className = 'user-info';
        userInfo.textContent = ` • ${userName}`;
        userInfo.style.fontSize = '0.8rem';
        userInfo.style.color = 'var(--text-light)';
        
        // Ajouter après l'indicateur de statut
        statusIndicator.appendChild(userInfo);
    }
    
    console.log(`👤 Utilisateur affiché: ${userName}`);
}

/**
 * Naviguer vers la page index.html (sélection de projets)
 */
function goToIndex() {
    console.log('📋 Navigation vers index.html');
    
    // Sauvegarder l'état actuel si nécessaire
    const currentProject = localStorage.getItem(AUTH_CONFIG.projectKey);
    if (currentProject) {
        console.log('💾 Projet actuel sauvegardé:', JSON.parse(currentProject).name);
    }
    
    // Rediriger vers index.html
    window.location.href = 'index.html';
}

/**
 * Gérer la déconnexion (wrapper pour compatibilité)
 */
async function handleLogoutWrapper() {
    if (typeof handleLogout !== 'undefined') {
        await handleLogout();
    } else {
        // Fallback si auth-check.js n'est pas disponible
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            localStorage.removeItem(AUTH_CONFIG.sessionKey);
            localStorage.removeItem(AUTH_CONFIG.projectKey);
            console.log('👋 Déconnexion locale');
            window.location.href = 'index.html';
        }
    }
}

/**
 * Vérifier l'authentification et rediriger si nécessaire
 */
function checkAuthAndRedirect() {
    const session = localStorage.getItem(AUTH_CONFIG.sessionKey);
    const isLoginPage = window.location.pathname.includes('login.html');
    const isIndexPage = window.location.pathname.includes('index.html');
    
    // Si sur la page de login mais déjà connecté, rediriger vers index
    if (isLoginPage && session) {
        console.log('✅ Déjà connecté, redirection vers index.html');
        window.location.href = 'index.html';
        return;
    }
    
    // Si sur index.html ou app.html mais pas connecté, rediriger vers login
    if ((isIndexPage || window.location.pathname.includes('app.html')) && !session) {
        console.log('❌ Non connecté, redirection vers login.html');
        window.location.href = 'login.html';
        return;
    }
}

// Exposer les fonctions globales
window.goToIndex = goToIndex;
window.handleLogout = typeof handleLogout !== 'undefined' ? handleLogout : handleLogoutWrapper;
window.initNavigationAuth = initNavigationAuth;
window.checkAuthAndRedirect = checkAuthAndRedirect;

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification et rediriger si nécessaire
    setTimeout(checkAuthAndRedirect, 100);
    
    // Initialiser la navigation et l'authentification
    setTimeout(initNavigationAuth, 500);
    
    console.log('✅ Navigation et authentification initialisées');
});