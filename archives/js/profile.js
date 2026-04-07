/**
 * AINTERCOM — Profile Management
 * Gère la page de profil utilisateur avec Supabase
 */

class ProfileManager {
    constructor() {
        this.userId = null;
        this.userEmail = null;
        this.userProfile = null;
        this.isLoading = false;

        this.init();
    }

    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.loadProfile();
    }

    cacheElements() {
        // Forms
        this.profileForm = document.getElementById('profile-form');
        this.passwordForm = document.getElementById('password-form');

        // Profile inputs
        this.firstNameInput = document.getElementById('first-name');
        this.lastNameInput = document.getElementById('last-name');
        this.emailInput = document.getElementById('email');
        this.avatarUrlInput = document.getElementById('avatar-url');
        this.profileAvatar = document.getElementById('profile-avatar');
        this.avatarFileInput = document.getElementById('avatar-input');

        // Buttons
        this.saveProfileBtn = document.getElementById('save-profile-btn');
        this.changePasswordBtn = document.getElementById('change-password-btn');
        this.logoutBtn = document.getElementById('logout-btn');
        this.backBtn = document.getElementById('back-btn');
        this.uploadAvatarBtn = document.querySelector('.btn-upload');

        // Password inputs
        this.currentPasswordInput = document.getElementById('current-password');
        this.newPasswordInput = document.getElementById('new-password');
        this.confirmPasswordInput = document.getElementById('confirm-password');

        // Alerts container
        this.alertsContainer = document.getElementById('alerts');
    }

    attachEventListeners() {
        // Profile form
        this.profileForm.addEventListener('submit', (e) => this.handleProfileSubmit(e));

        // Password form
        this.passwordForm.addEventListener('submit', (e) => this.handlePasswordSubmit(e));

        // Buttons
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        this.backBtn.addEventListener('click', () => this.goBack());
        this.uploadAvatarBtn.addEventListener('click', () => this.avatarFileInput.click());
        this.avatarFileInput.addEventListener('change', (e) => this.handleAvatarUpload(e));

        // Auto-format avatar URL preview
        this.avatarUrlInput.addEventListener('change', (e) => {
            if (e.target.value) {
                this.profileAvatar.src = e.target.value;
            }
        });
    }

    /**
     * Charger le profil utilisateur
     */
    async loadProfile() {
        try {
            this.isLoading = true;

            // Récupérer l'utilisateur actuel
            const session = getSession();
            if (!session) {
                this.showAlert('Vous devez être connecté', 'error');
                setTimeout(() => {
                    window.location.href = window.AINTERCOM_CONFIG ? 
                        window.AINTERCOM_CONFIG.getFullPath('/login.html') :
                        '/login.html';
                }, 1500);
                return;
            }

            this.userId = session.id;
            this.userEmail = session.email;

            // Afficher l'email (non modifiable)
            this.emailInput.value = this.userEmail;

            // Charger le profil depuis Supabase
            if (supabaseClient) {
                const { data, error } = await supabaseClient
                    .from('profiles')
                    .select('*')
                    .eq('id', this.userId)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    // PGRST116 = no rows returned (c'est ok)
                    console.warn('⚠️ Erreur chargement profil:', error.message);
                }

                if (data) {
                    this.userProfile = data;
                    this.populateFormWithData(data);
                } else {
                    // Créer un profil par défaut
                    this.createDefaultProfile(session);
                }
            }

            this.isLoading = false;
        } catch (error) {
            console.error('❌ Erreur loadProfile:', error);
            this.showAlert('Erreur lors du chargement du profil', 'error');
            this.isLoading = false;
        }
    }

    /**
     * Remplir le formulaire avec les données chargées
     */
    populateFormWithData(data) {
        this.firstNameInput.value = data.first_name || '';
        this.lastNameInput.value = data.last_name || '';
        this.avatarUrlInput.value = data.avatar_url || '';

        // Afficher l'avatar
        if (data.avatar_url) {
            this.profileAvatar.src = data.avatar_url;
        } else if (data.first_name && data.last_name) {
            const name = `${data.first_name} ${data.last_name}`;
            this.profileAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d4af37&color=000`;
        }
    }

    /**
     * Créer un profil par défaut
     */
    async createDefaultProfile(session) {
        try {
            const fullName = session.name || session.email.split('@')[0];
            const [firstName, ...lastNameParts] = fullName.split(' ');
            const lastName = lastNameParts.join(' ') || '';

            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=d4af37&color=000`;

            if (supabaseClient) {
                const { data, error } = await supabaseClient
                    .from('profiles')
                    .insert([{
                        id: this.userId,
                        first_name: firstName,
                        last_name: lastName,
                        avatar_url: avatarUrl,
                        email: this.userEmail
                    }])
                    .select()
                    .single();

                if (error) {
                    console.warn('⚠️ Erreur création profil par défaut:', error.message);
                } else if (data) {
                    this.userProfile = data;
                    this.populateFormWithData(data);
                    console.log('✅ Profil par défaut créé:', data);
                }
            }
        } catch (error) {
            console.error('❌ Erreur createDefaultProfile:', error);
        }
    }

    /**
     * Gérer la soumission du formulaire de profil
     */
    async handleProfileSubmit(e) {
        e.preventDefault();

        if (!this.userId) {
            this.showAlert('Erreur: Utilisateur non identifié', 'error');
            return;
        }

        try {
            this.setButtonLoading(this.saveProfileBtn, true);

            const firstName = this.firstNameInput.value.trim();
            const lastName = this.lastNameInput.value.trim();
            const avatarUrl = this.avatarUrlInput.value.trim();

            if (!firstName) {
                this.showAlert('Le prénom est requis', 'error');
                this.setButtonLoading(this.saveProfileBtn, false);
                return;
            }

            // Mettre à jour le profil dans Supabase
            if (supabaseClient) {
                const { data, error } = await supabaseClient
                    .from('profiles')
                    .update({
                        first_name: firstName,
                        last_name: lastName,
                        avatar_url: avatarUrl || null,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', this.userId)
                    .select()
                    .single();

                if (error) {
                    throw error;
                }

                if (data) {
                    this.userProfile = data;
                    this.showAlert('✓ Profil mis à jour avec succès !', 'success');
                    console.log('✅ Profil mis à jour:', data);

                    // Mettre à jour AIStore
                    if (window.AIStore) {
                        window.AIStore.setState({
                            user_profile: data
                        });
                    }

                    // Mettre à jour localStorage
                    const session = getSession();
                    session.name = `${firstName} ${lastName}`.trim();
                    saveSession(session);
                }
            }

            this.setButtonLoading(this.saveProfileBtn, false);
        } catch (error) {
            console.error('❌ Erreur handleProfileSubmit:', error);
            this.showAlert(`Erreur: ${error.message}`, 'error');
            this.setButtonLoading(this.saveProfileBtn, false);
        }
    }

    /**
     * Gérer l'upload d'avatar
     */
    async handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Valider le fichier
            if (!file.type.startsWith('image/')) {
                this.showAlert('Veuillez sélectionner une image', 'error');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                this.showAlert('L\'image ne doit pas dépasser 5 MB', 'error');
                return;
            }

            if (supabaseClient) {
                // Créer un nom de fichier unique
                const timestamp = Date.now();
                const ext = file.name.split('.').pop();
                const fileName = `${this.userId}_${timestamp}.${ext}`;

                this.setButtonLoading(this.uploadAvatarBtn, true);

                // Uploader le fichier
                const { error: uploadError } = await supabaseClient.storage
                    .from('avatars')
                    .upload(`public/${fileName}`, file, { upsert: true });

                if (uploadError) {
                    throw uploadError;
                }

                // Obtenir l'URL publique
                const { data } = supabaseClient.storage
                    .from('avatars')
                    .getPublicUrl(`public/${fileName}`);

                if (data?.publicUrl) {
                    this.avatarUrlInput.value = data.publicUrl;
                    this.profileAvatar.src = data.publicUrl;
                    this.showAlert('✓ Photo uploadée avec succès !', 'success');
                }

                this.setButtonLoading(this.uploadAvatarBtn, false);
            }
        } catch (error) {
            console.error('❌ Erreur handleAvatarUpload:', error);
            this.showAlert(`Erreur upload: ${error.message}`, 'error');
            this.setButtonLoading(this.uploadAvatarBtn, false);
        }
    }

    /**
     * Gérer le changement de mot de passe
     */
    async handlePasswordSubmit(e) {
        e.preventDefault();

        const currentPassword = this.currentPasswordInput.value;
        const newPassword = this.newPasswordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showAlert('Tous les champs sont requis', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showAlert('Les nouveaux mots de passe ne correspondent pas', 'error');
            return;
        }

        if (newPassword.length < 8) {
            this.showAlert('Le mot de passe doit contenir au minimum 8 caractères', 'error');
            return;
        }

        // Vérifier que le nouveau mot de passe est différent
        if (currentPassword === newPassword) {
            this.showAlert('Le nouveau mot de passe doit être différent du mot de passe actuel', 'error');
            return;
        }

        try {
            this.setButtonLoading(this.changePasswordBtn, true);

            if (supabaseClient) {
                // D'abord, vérifier que le mot de passe actuel est correct
                // en tentant une reconnexion
                const { error: signInError } = await supabaseClient.auth.signInWithPassword({
                    email: this.userEmail,
                    password: currentPassword
                });

                if (signInError) {
                    this.showAlert('Mot de passe actuel incorrect', 'error');
                    this.setButtonLoading(this.changePasswordBtn, false);
                    return;
                }

                // Mettre à jour le mot de passe
                const { error: updateError } = await supabaseClient.auth.updateUser({
                    password: newPassword
                });

                if (updateError) {
                    throw updateError;
                }

                this.showAlert('✓ Mot de passe changé avec succès !', 'success');
                this.passwordForm.reset();
                console.log('✅ Mot de passe mis à jour');
            }

            this.setButtonLoading(this.changePasswordBtn, false);
        } catch (error) {
            console.error('❌ Erreur handlePasswordSubmit:', error);
            this.showAlert(`Erreur: ${error.message}`, 'error');
            this.setButtonLoading(this.changePasswordBtn, false);
        }
    }

    /**
     * Gérer la déconnexion
     */
    async handleLogout() {
        try {
            await signOut();
            this.showAlert('✓ Déconnecté avec succès', 'success');
            setTimeout(() => {
                window.location.href = window.AINTERCOM_CONFIG ? 
                    window.AINTERCOM_CONFIG.getFullPath('/login.html') :
                    '/login.html';
            }, 1000);
        } catch (error) {
            console.error('❌ Erreur déconnexion:', error);
            this.showAlert('Erreur lors de la déconnexion', 'error');
        }
    }

    /**
     * Retourner à la page précédente
     */
    goBack() {
        window.history.back();
    }

    /**
     * Définir l'état de chargement d'un bouton
     */
    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
            const spinner = document.createElement('span');
            spinner.className = 'spinner';
            button.prepend(spinner);
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            const spinner = button.querySelector('.spinner');
            if (spinner) spinner.remove();
        }
    }

    /**
     * Afficher une alerte
     */
    showAlert(message, type = 'info') {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;

        const icon = document.createElement('div');
        icon.className = 'alert-icon';
        
        let iconClass = 'fas fa-info-circle';
        if (type === 'success') iconClass = 'fas fa-check-circle';
        if (type === 'error') iconClass = 'fas fa-exclamation-circle';
        if (type === 'warning') iconClass = 'fas fa-warning';

        icon.innerHTML = `<i class="${iconClass}"></i>`;

        const text = document.createElement('div');
        text.textContent = message;

        alert.appendChild(icon);
        alert.appendChild(text);

        this.alertsContainer.appendChild(alert);

        // Auto-close après 5 secondes
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    }
}

// Initialiser au chargement du DOM
document.addEventListener('DOMContentLoaded', async () => {
    // Attendre l'initialisation de Supabase
    const isInitialized = await initSupabaseClient();
    await restoreSession();

    // Initialiser le ProfileManager
    const profileManager = new ProfileManager();
    window.profileManager = profileManager;

    console.log('✅ Profile manager initialized');
});
