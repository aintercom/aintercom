/**
 * AINTERCOM — Header Component Manager
 * Gère l'interaction du header sur toutes les pages
 */

class HeaderManager {
    constructor() {
        this.cacheElements();
        this.attachEventListeners();
        this.setupTheme();
        this.updateUserUI();
        this.setupAuthListener();
    }

    cacheElements() {
        this.userAuthenticatedDiv = document.getElementById('user-authenticated');
        this.userUnauthenticatedDiv = document.getElementById('user-unauthenticated');
        this.userProfileBtn = document.getElementById('user-profile-btn');
        this.userMenu = document.getElementById('user-menu');
        this.logoutBtnHeader = document.getElementById('logout-btn-header');
        this.userAvatarHeader = document.getElementById('user-avatar-header');
        this.userNameHeader = document.getElementById('user-name-header');
        this.menuToggle = document.getElementById('menu-toggle');
    }

    attachEventListeners() {
        // Toggle user menu
        if (this.userProfileBtn) {
            this.userProfileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserMenu();
            });
        }

        // Close menu on logout
        if (this.logoutBtnHeader) {
            this.logoutBtnHeader.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.userMenu && !this.userMenu.contains(e.target) && 
                this.userProfileBtn && !this.userProfileBtn.contains(e.target)) {
                this.userMenu.classList.remove('active');
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.userMenu.classList.remove('active');
            }
        });

        // Mobile menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => {
                // Pour l'instant, juste toggle la visibilité du menu utilisateur sur mobile
                if (this.userMenu) {
                    this.userMenu.classList.toggle('active');
                }
            });
        }
    }

    /**
     * Mettre à jour l'interface utilisateur selon l'état d'authentification
     */
    updateUserUI() {
        const session = getSession();

        if (session) {
            // Utilisateur connecté
            this.userAuthenticatedDiv.style.display = 'block';
            this.userUnauthenticatedDiv.style.display = 'none';

            // Afficher les infos utilisateur
            this.userNameHeader.textContent = session.name || session.email;
            
            // Avatar
            if (window.AIStore && window.AIStore.state.user_profile?.avatar_url) {
                this.userAvatarHeader.src = window.AIStore.state.user_profile.avatar_url;
            } else {
                const fullName = session.name || session.email.split('@')[0];
                this.userAvatarHeader.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=d4af37&color=000`;
            }

            console.log('✅ Header: Utilisateur connecté -', session.name);
        } else {
            // Utilisateur non connecté
            this.userAuthenticatedDiv.style.display = 'none';
            this.userUnauthenticatedDiv.style.display = 'block';

            console.log('👤 Header: Utilisateur non connecté');
        }
    }

    /**
     * Toggle le menu utilisateur
     */
    toggleUserMenu() {
        if (this.userMenu) {
            this.userMenu.classList.toggle('active');
        }
    }

    /**
     * Gérer la déconnexion
     */
    async handleLogout() {
        try {
            await signOut();
            this.updateUserUI();
            
            // Rediriger vers login après un court délai
            setTimeout(() => {
                window.location.href = window.AINTERCOM_CONFIG ? 
                    window.AINTERCOM_CONFIG.getFullPath('/login.html') :
                    '/login.html';
            }, 500);
        } catch (error) {
            console.error('❌ Erreur déconnexion header:', error);
        }
    }

    /**
     * Configurer le thème (CSS variables)
     */
    setupTheme() {
        // Les variables CSS sont déjà définies dans les fichiers CSS
        // Cette fonction peut être utilisée pour des ajustements dynamiques
        const isDarkMode = window.AIStore?.state?.isDarkMode ?? true;
        
        if (isDarkMode) {
            document.documentElement.style.setProperty('--bg', '#0a0a0a');
            document.documentElement.style.setProperty('--surface', '#1a1a1a');
        }
    }

    /**
     * S'abonner aux changements d'authentification via AIStore
     */
    setupAuthListener() {
        if (window.AIStore) {
            window.AIStore.subscribe((state) => {
                // Quand l'état d'authentification change, mettre à jour l'UI
                if (state.isLoggedIn !== this.isLoggedIn) {
                    this.isLoggedIn = state.isLoggedIn;
                    this.updateUserUI();
                }

                // Mettre à jour l'avatar si le profil change
                if (state.user_profile?.avatar_url) {
                    this.userAvatarHeader.src = state.user_profile.avatar_url;
                }
            });
        }
    }

    /**
     * Mettre à jour les liens actifs selon la page courante
     */
    updateActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (currentPath.includes(href) || 
                (href === '/interface.html' && currentPath === '/') ||
                (href === '/' && currentPath === '/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

/**
 * Initialiser le header quand le DOM est chargé
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Attendre l'initialisation de Supabase et de la session
    await initSupabaseClient();
    await restoreSession();

    // Initialiser le HeaderManager
    const headerManager = new HeaderManager();
    headerManager.updateActiveNavLink();
    window.headerManager = headerManager;

    console.log('✅ Header manager initialized');
});

/**
 * Event listener pour les changements de l'authentification Supabase
 * Meilleure alternative à AIStore.subscribe()
 */
if (typeof setupAuthStateListener === 'function') {
    setupAuthStateListener();
}
