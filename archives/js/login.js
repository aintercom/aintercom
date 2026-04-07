/**
 * AINTERCOM —  Auth Page Logic
 * Gère la connexion, inscription et réinitialisation de mot de passe
 */

class AuthFormManager {
    constructor() {
        this.currentMode = 'login';
        this.cacheElements();
        this.attachEventListeners();
        this.init();
    }

    cacheElements() {
        // Tabs
        this.authTabs = document.querySelectorAll('.auth-tab');
        this.authForms = document.querySelectorAll('.auth-form');

        // Forms
        this.loginForm = document.getElementById('login-form');
        this.signupForm = document.getElementById('signup-form');
        this.resetForm = document.getElementById('reset-form');

        // Login inputs
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.rememberInput = document.getElementById('remember');

        // Signup inputs
        this.signupFullnameInput = document.getElementById('signup-fullname');
        this.signupEmailInput = document.getElementById('signup-email');
        this.signupPasswordInput = document.getElementById('signup-password');
        this.signupConfirmPasswordInput = document.getElementById('signup-confirm-password');

        // Reset inputs
        this.resetEmailInput = document.getElementById('reset-email');

        // Buttons
        this.btnGoogle = document.getElementById('btn-google');
        
        // Messages
        this.errorMessage = document.getElementById('error-message');
        this.successMessage = document.getElementById('success-message');
        this.googleHint = document.getElementById('google-hint');
    }

    attachEventListeners() {
        // Tab switching
        this.authTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchMode(tab.dataset.mode);
            });
        });

        // Form submissions
        this.loginForm.addEventListener('submit', (e) => this.handleLoginSubmit(e));
        this.signupForm.addEventListener('submit', (e) => this.handleSignupSubmit(e));
        this.resetForm.addEventListener('submit', (e) => this.handleResetSubmit(e));

        // Google Sign-In
        this.btnGoogle.addEventListener('click', async (e) => {
            e.preventDefault();
            await this.handleGoogleSignIn();
        });

        // Enter key on inputs
        [this.emailInput, this.passwordInput].forEach(input => {
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.loginForm.dispatchEvent(new Event('submit'));
                });
            }
        });
    }

    init() {
        // Vérifier si déjà connecté
        const session = getSession();
        if (session) {
            window.location.href = window.AINTERCOM_CONFIG ? 
                window.AINTERCOM_CONFIG.getFullPath('/dashboard.html') :
                '/dashboard.html';
        }
    }

    /**
     * Changer de mode (login / signup / reset)
     */
    switchMode(mode) {
        this.currentMode = mode;

        // Update tabs
        this.authTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mode === mode);
        });

        // Update forms
        this.authForms.forEach(form => {
            form.classList.toggle('active', form.id === `${mode}-form`);
        });

        // Clear messages
        this.clearMessages();

        // Clear form inputs
        this.loginForm.reset();
        this.signupForm.reset();
        this.resetForm.reset();

        console.log('📋 Mode changé:', mode);
    }

    /**
     * Gérer la connexion
     */
    async handleLoginSubmit(e) {
        e.preventDefault();

        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;

        // Validation
        if (!email || !password) {
            this.showError('Email et mot de passe requis');
            return;
        }

        try {
            this.setButtonLoading(this.loginForm.querySelector('button[type="submit"]'), true);

            const result = await signInWithEmail(email, password);

            if (result.success) {
                this.showSuccess('✓ Connexion réussie ! Redirection en cours...');
                setTimeout(() => {
                    const dashboardUrl = window.AINTERCOM_CONFIG ? 
                        window.AINTERCOM_CONFIG.getFullPath('/dashboard.html') :
                        'dashboard.html';
                    window.location.href = dashboardUrl;
                }, 1000);
            } else {
                this.showError(result.error || 'Erreur lors de la connexion');
            }

            this.setButtonLoading(this.loginForm.querySelector('button[type="submit"]'), false);
        } catch (error) {
            console.error('❌ Erreur login:', error);
            this.showError('Erreur: ' + error.message);
            this.setButtonLoading(this.loginForm.querySelector('button[type="submit"]'), false);
        }
    }

    /**
     * Gérer l'inscription
     */
    async handleSignupSubmit(e) {
        e.preventDefault();

        const fullname = this.signupFullnameInput.value.trim();
        const email = this.signupEmailInput.value.trim();
        const password = this.signupPasswordInput.value;
        const confirmPassword = this.signupConfirmPasswordInput.value;

        // Validation
        if (!fullname || !email || !password || !confirmPassword) {
            this.showError('Tous les champs sont requis');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('Les mots de passe ne correspondent pas');
            return;
        }

        if (password.length < 8) {
            this.showError('Le mot de passe doit contenir au minimum 8 caractères');
            return;
        }

        try {
            this.setButtonLoading(this.signupForm.querySelector('button[type="submit"]'), true);

            const result = await signUpWithEmail(email, password, fullname);

            if (result.success) {
                this.showSuccess('✓ Inscription réussie ! ' + (result.message || 'Vérifiez votre email'));
                this.signupForm.reset();
                
                // Rediriger vers login après 2 secondes
                setTimeout(() => {
                    this.switchMode('login');
                }, 2000);
            } else {
                this.showError(result.error || 'Erreur lors de l\'inscription');
            }

            this.setButtonLoading(this.signupForm.querySelector('button[type="submit"]'), false);
        } catch (error) {
            console.error('❌ Erreur signup:', error);
            this.showError('Erreur: ' + error.message);
            this.setButtonLoading(this.signupForm.querySelector('button[type="submit"]'), false);
        }
    }

    /**
     * Gérer la réinitialisation de mot de passe
     */
    async handleResetSubmit(e) {
        e.preventDefault();

        const email = this.resetEmailInput.value.trim();

        // Validation
        if (!email) {
            this.showError('Email requis');
            return;
        }

        try {
            this.setButtonLoading(this.resetForm.querySelector('button[type="submit"]'), true);

            const result = await resetPassword(email);

            if (result.success) {
                this.showSuccess('✓ ' + (result.message || 'Email de réinitialisation envoyé'));
                this.resetForm.reset();
                
                // Rediriger après 2 secondes
                setTimeout(() => {
                    this.switchMode('login');
                }, 2000);
            } else {
                this.showError(result.error || 'Erreur lors de l\'envoi');
            }

            this.setButtonLoading(this.resetForm.querySelector('button[type="submit"]'), false);
        } catch (error) {
            console.error('❌ Erreur reset:', error);
            this.showError('Erreur: ' + error.message);
            this.setButtonLoading(this.resetForm.querySelector('button[type="submit"]'), false);
        }
    }

    /**
     * Gérer Google Sign-In
     */
    async handleGoogleSignIn() {
        try {
            this.btnGoogle.disabled = true;
            this.btnGoogle.classList.add('loading');
            this.googleHint.textContent = 'Redirection vers Google...';

            const result = await signInWithGoogle();

            if (result.success) {
                this.showSuccess('✓ Connexion Google réussie !');
                // Redirect géré par Supabase OAuth
            } else {
                this.showError('Erreur Google Sign-In: ' + (result.error || 'Erreur inconnue'));
                this.googleHint.textContent = 'Mode DÉMO (Supabase non configuré)';
            }
        } catch (error) {
            console.error('❌ Erreur Google SignIn:', error);
            this.showError('Erreur: ' + error.message);
        } finally {
            this.btnGoogle.disabled = false;
            this.btnGoogle.classList.remove('loading');
        }
    }

    /**
     * Afficher message d'erreur
     */
    showError(message) {
        this.clearMessages();
        this.errorMessage.textContent = '❌ ' + message;
        this.errorMessage.classList.add('active');
        this.errorMessage.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Afficher message de succès
     */
    showSuccess(message) {
        this.clearMessages();
        this.successMessage.textContent = message;
        this.successMessage.classList.add('active');
        this.successMessage.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Effacer les messages
     */
    clearMessages() {
        this.errorMessage.classList.remove('active');
        this.successMessage.classList.remove('active');
        this.errorMessage.textContent = '';
        this.successMessage.textContent = '';
    }

    /**
     * Contrôler l'état de chargement d'un bouton
     */
    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
            button.innerHTML = '<span class="spinner" style="display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(212, 175, 55, 0.3); border-top-color: #d4af37; border-radius: 50%; animation: spin 0.8s linear infinite;"></span> Chargement...';
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            // Restaurer le texte original
            const formId = button.closest('form').id;
            if (formId === 'login-form') {
                button.textContent = 'ENTRER EN RÉGIE';
            } else if (formId === 'signup-form') {
                button.textContent = 'S\'INSCRIRE';
            } else if (formId === 'reset-form') {
                button.textContent = 'ENVOYER LE LIEN';
            }
        }
    }
}

// Initialiser audit au chargement
document.addEventListener('DOMContentLoaded', async () => {
    // Initialiser Supabase
    await initSupabaseClient();
    
    // Vérifier la session
    await restoreSession();

    // Ajouter le style pour le spinner
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Initialiser le form manager
    const authManager = new AuthFormManager();
    window.authManager = authManager;

    console.log('✅ Auth form manager initialized');
});
