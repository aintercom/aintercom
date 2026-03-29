/**
 * AINTERCOM OS — LOGIQUE DES MODULES ET INTERACTION UI
 */

class DashboardController {
    constructor() {
        this.setupDOMElements();
        this.bindEvents();
        this.subscribeToStore();
        this.updateMetrics();

        console.log('✓ AINTERCOM Dashboard Controller initialized');
    }

    setupDOMElements() {
        // Navigation
        this.navItems = document.querySelectorAll('.nav-item');

        // Show Control
        this.currentEventInput = document.getElementById('current-event');
        this.showStartTime = document.getElementById('show-start-time');
        this.showDuration = document.getElementById('show-duration');
        this.showArtist = document.getElementById('show-artist');

        // Métrics
        this.crewCountDisplay = document.getElementById('crew-count');
        this.accredCountDisplay = document.getElementById('accred-count');
        this.signCountDisplay = document.getElementById('sign-count');

        // Crew/Staff
        this.crewForm = document.getElementById('crew-form');
        this.crewName = document.getElementById('crew-name');
        this.crewEmail = document.getElementById('crew-email');
        this.crewRole = document.getElementById('crew-role');
        this.crewItems = document.getElementById('crew-items');

        // Accréditations
        this.accredForm = document.getElementById('accred-form');
        this.accredName = document.getElementById('accred-name');
        this.accredType = document.getElementById('accred-type');
        this.accredDate = document.getElementById('accred-date');
        this.accredItems = document.getElementById('accred-items');

        // Rider Technique
        this.riderForm = document.getElementById('rider-form');
        this.riderAudio = document.getElementById('rider-audio');
        this.riderLight = document.getElementById('rider-light');
        this.riderVideo = document.getElementById('rider-video');
        this.riderContent = document.getElementById('rider-content');

        // Callsheet
        this.callsheetForm = document.getElementById('callsheet-form');
        this.callsheetEvent = document.getElementById('callsheet-event');
        this.callsheetDate = document.getElementById('callsheet-date');
        this.callsheetTime = document.getElementById('callsheet-time');
        this.callsheetNotes = document.getElementById('callsheet-notes');
        this.callsheetContent = document.getElementById('callsheet-content');

        // Sign Flow
        this.signForm = document.getElementById('sign-form');
        this.signTitle = document.getElementById('sign-title');
        this.signContent = document.getElementById('sign-content');
        this.signSigner = document.getElementById('sign-signer');
        this.signItems = document.getElementById('sign-items');

        // Drawers
        this.lexiqueDrawer = document.getElementById('lexique-drawer');
        this.settingsPanel = document.getElementById('settings-panel');
        this.loginModal = document.getElementById('login-modal');

        // Buttons
        this.lexiqueToggle = document.getElementById('lexique-toggle');
        this.settingsToggle = document.getElementById('settings-toggle');
        this.userBtn = document.getElementById('user-btn');
        this.userNameDisplay = document.getElementById('user-name');
        this.closeLexique = document.getElementById('close-lexique');
        this.closeSettings = document.getElementById('close-settings');

        // Settings
        this.themeToggle = document.getElementById('theme-toggle');
        this.notifVolume = document.getElementById('notif-volume');
        this.language = document.getElementById('language');
        this.logoutBtn = document.getElementById('logout-btn');

        // Event info
        this.eventNameDisplay = document.getElementById('event-name');
        this.moduleTitle = document.getElementById('module-title');

        // Login
        this.loginForm = document.getElementById('login-form');
        this.loginEmail = document.getElementById('login-email');
        this.loginPassword = document.getElementById('login-password');
    }

    bindEvents() {
        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => this.switchModule(e.currentTarget));
        });

        // Drawers
        this.lexiqueToggle.addEventListener('click', () => this.toggleDrawer('lexique'));
        this.settingsToggle.addEventListener('click', () => this.toggleDrawer('settings'));
        this.closeLexique.addEventListener('click', () => this.toggleDrawer('lexique'));
        this.closeSettings.addEventListener('click', () => this.toggleDrawer('settings'));

        // Formulaires
        this.crewForm.addEventListener('submit', (e) => this.handleCrewSubmit(e));
        this.accredForm.addEventListener('submit', (e) => this.handleAccredSubmit(e));
        this.riderForm.addEventListener('submit', (e) => this.handleRiderSubmit(e));
        this.callsheetForm.addEventListener('submit', (e) => this.handleCallsheetSubmit(e));
        this.signForm.addEventListener('submit', (e) => this.handleSignSubmit(e));
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));

        // Show Control inputs
        this.currentEventInput.addEventListener('change', () => this.saveShowControl());
        this.showStartTime.addEventListener('change', () => this.saveShowControl());
        this.showDuration.addEventListener('change', () => this.saveShowControl());
        this.showArtist.addEventListener('change', () => this.saveShowControl());

        // Settings
        this.userBtn.addEventListener('click', () => {
            if (store.state.isLoggedIn) {
                this.showUserMenu();
            } else {
                this.openLoginModal();
            }
        });
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        this.themeToggle.addEventListener('change', (e) => this.updateSettings());
        this.notifVolume.addEventListener('change', (e) => this.updateSettings());
        this.language.addEventListener('change', (e) => this.updateSettings());

        // Fermer les drawers au clic extérieur
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.lexique-drawer') && !e.target.closest('#lexique-toggle')) {
                this.lexiqueDrawer.classList.remove('active');
            }
            if (!e.target.closest('.settings-panel') && !e.target.closest('#settings-toggle')) {
                this.settingsPanel.classList.remove('active');
            }
        });
    }

    subscribeToStore() {
        store.subscribe((state) => {
            this.updateDisplay();
            this.updateMetrics();
        });
    }

    /**
     * NAVIGATION & MODULES
     */

    switchModule(navItem) {
        // Mise à jour UI
        this.navItems.forEach(item => item.classList.remove('active'));
        navItem.classList.add('active');

        const moduleId = navItem.dataset.module;
        this.showModule(moduleId);

        // Mise à jour state
        store.setState({ currentModule: moduleId });

        // Mettre à jour le titre
        const modules = {
            'show-control': 'Show Control',
            'crew': 'Crew/Staff',
            'accreditations': 'Accréditations',
            'rider': 'Rider Technique',
            'callsheet': 'Callsheet',
            'sign-flow': 'Sign Flow'
        };
        this.moduleTitle.textContent = modules[moduleId];
    }

    showModule(moduleId) {
        document.querySelectorAll('.module-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(moduleId)?.classList.add('active');
    }

    /**
     * SHOW CONTROL
     */

    saveShowControl() {
        store.setState({
            showStartTime: this.showStartTime.value,
            showDuration: this.showDuration.value,
            showArtist: this.showArtist.value
        });
    }

    /**
     * CREW/STAFF
     */

    handleCrewSubmit(e) {
        e.preventDefault();

        const member = {
            name: this.crewName.value,
            email: this.crewEmail.value,
            role: this.crewRole.value
        };

        const newMember = store.addCrewMember(member);
        this.renderCrewMembers();
        this.crewForm.reset();
        Notifier.success(`${member.name} ajouté au crew`);
    }

    renderCrewMembers() {
        const members = store.state.crewMembers;

        if (members.length === 0) {
            this.crewItems.innerHTML = '<p class="empty-state">Aucun personnel enregistré</p>';
            return;
        }

        this.crewItems.innerHTML = members.map(member => `
            <div class="crew-item">
                <div>
                    <div class="item-name">👤 ${member.name}</div>
                    <div class="item-meta">${member.role || 'N/A'} • ${member.email || 'N/A'}</div>
                </div>
                <div class="item-actions">
                    <button class="item-btn" onclick="app.removeCrewMember('${member.id}')">✕</button>
                </div>
            </div>
        `).join('');
    }

    removeCrewMember(id) {
        store.removeCrewMember(id);
        this.renderCrewMembers();
        Notifier.info('Membre supprimé');
    }

    /**
     * ACCRÉDITATIONS
     */

    handleAccredSubmit(e) {
        e.preventDefault();

        const accred = {
            name: this.accredName.value,
            type: this.accredType.value,
            date: this.accredDate.value,
            code: Utils.generateCode('ACC')
        };

        store.addAccreditation(accred);
        this.renderAccreditations();
        this.accredForm.reset();
        Notifier.success(`Accréditation générée pour ${accred.name}`);
    }

    renderAccreditations() {
        const accreds = store.state.accreditations;

        if (accreds.length === 0) {
            this.accredItems.innerHTML = '<p class="empty-state">Aucune accréditation générée</p>';
            return;
        }

        this.accredItems.innerHTML = accreds.map(accred => `
            <div class="accred-item">
                <div>
                    <div class="item-name">🎫 ${accred.name}</div>
                    <div class="item-meta">${accred.type.toUpperCase()} • Code: ${accred.code}</div>
                </div>
                <div class="item-actions">
                    <button class="item-btn" onclick="app.removeAccreditation('${accred.id}')">✕</button>
                </div>
            </div>
        `).join('');
    }

    removeAccreditation(id) {
        store.removeAccreditation(id);
        this.renderAccreditations();
        Notifier.info('Accréditation supprimée');
    }

    /**
     * RIDER TECHNIQUE
     */

    handleRiderSubmit(e) {
        e.preventDefault();

        store.updateNested('riderSpecs', {
            audio: this.riderAudio.value,
            light: this.riderLight.value,
            video: this.riderVideo.value
        });

        this.renderRider();
        Notifier.success('Rider technique sauvegardé');
    }

    renderRider() {
        const rider = store.state.riderSpecs;

        if (!rider.audio && !rider.light && !rider.video) {
            this.riderContent.innerHTML = '<p class="empty-state">Aucun rider technique défini</p>';
            return;
        }

        let html = '<div style="font-family: monospace; white-space: pre-wrap;">';

        if (rider.audio) {
            html += `🎵 AUDIO\n${rider.audio}\n\n`;
        }

        if (rider.light) {
            html += `💡 LUMIÈRE\n${rider.light}\n\n`;
        }

        if (rider.video) {
            html += `📹 VIDÉO\n${rider.video}`;
        }

        html += '</div>';
        this.riderContent.innerHTML = html;
    }

    /**
     * CALLSHEET
     */

    handleCallsheetSubmit(e) {
        e.preventDefault();

        const callsheet = {
            event: this.callsheetEvent.value,
            date: this.callsheetDate.value,
            time: this.callsheetTime.value,
            notes: this.callsheetNotes.value
        };

        store.updateNested('callsheet', callsheet);
        store.setState({ eventName: callsheet.event });
        this.renderCallsheet();
        this.updateEventDisplay();
        this.callsheetForm.reset();
        Notifier.success('Callsheet créée - Synchronisation Show Control');
    }

    renderCallsheet() {
        const cs = store.state.callsheet;

        if (!cs.event) {
            this.callsheetContent.innerHTML = '<p class="empty-state">Aucune callsheet active</p>';
            return;
        }

        this.callsheetContent.innerHTML = `
            <div class="callsheet-item">
                <div class="callsheet-label">Événement</div>
                <div class="callsheet-value">${cs.event}</div>
            </div>
            <div class="callsheet-item">
                <div class="callsheet-label">Date</div>
                <div class="callsheet-value">${Utils.formatDate(cs.date)}</div>
            </div>
            <div class="callsheet-item">
                <div class="callsheet-label">Horaire</div>
                <div class="callsheet-value">${Utils.formatTime(cs.time)}</div>
            </div>
            ${cs.notes ? `
                <div class="callsheet-item">
                    <div class="callsheet-label">Notes</div>
                    <pre style="background: var(--surface); padding: 8px; border-radius: 4px; font-size: 12px;">${cs.notes}</pre>
                </div>
            ` : ''}
        `;
    }

    /**
     * SIGN FLOW
     */

    handleSignSubmit(e) {
        e.preventDefault();

        const doc = {
            title: this.signTitle.value,
            content: this.signContent.value,
            signer: this.signSigner.value
        };

        store.addDocument(doc);
        this.renderDocuments();
        this.signForm.reset();
        Notifier.success(`Document créé pour signature par ${doc.signer}`);
    }

    renderDocuments() {
        const docs = store.state.documents;

        if (docs.length === 0) {
            this.signItems.innerHTML = '<p class="empty-state">Aucun document en attente</p>';
            return;
        }

        this.signItems.innerHTML = docs.map(doc => `
            <div class="sign-item">
                <div>
                    <div class="item-name">📝 ${doc.title}</div>
                    <div class="item-meta">À signer par: ${doc.signer}</div>
                    <div class="item-meta" style="margin-top: 4px;">
                        ${doc.status === 'pending' ? '⏳ En attente' : '✓ Signé'}
                    </div>
                </div>
                <div class="item-actions">
                    ${doc.status === 'pending' ? `
                        <button class="item-btn" onclick="app.signDocument('${doc.id}')">⚡ Signer</button>
                    ` : ''}
                    <button class="item-btn" onclick="app.removeDocument('${doc.id}')">✕</button>
                </div>
            </div>
        `).join('');
    }

    signDocument(id) {
        store.updateDocumentStatus(id, 'signed');
        this.renderDocuments();
        Notifier.success('Document signé');
    }

    removeDocument(id) {
        store.removeDocument(id);
        this.renderDocuments();
        Notifier.info('Document supprimé');
    }

    /**
     * DRAWERS & MODALS
     */

    toggleDrawer(drawerType) {
        if (drawerType === 'lexique') {
            this.lexiqueDrawer.classList.toggle('active');
            this.settingsPanel.classList.remove('active');
        } else if (drawerType === 'settings') {
            this.settingsPanel.classList.toggle('active');
            this.lexiqueDrawer.classList.remove('active');
        }
    }

    openLoginModal() {
        this.loginModal.classList.add('active');
    }

    closeLoginModal() {
        this.loginModal.classList.remove('active');
    }

    /**
     * USER & SETTINGS
     */

    handleLogin(e) {
        e.preventDefault();

        const email = this.loginEmail.value;
        const password = this.loginPassword.value;

        // TODO: Valider avec Supabase
        store.login(email, password);
        this.updateUserDisplay();
        this.closeLoginModal();
        Notifier.success(`Bienvenue ${email}!`);

        this.loginForm.reset();
    }

    handleLogout() {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
            store.logout();
            this.updateUserDisplay();
            this.toggleDrawer('settings');
            Notifier.info('Déconnexion réussie');
        }
    }

    updateUserDisplay() {
        if (store.state.isLoggedIn && store.state.user) {
            this.userNameDisplay.textContent = store.state.user.name || 'Utilisateur';
            this.userBtn.style.opacity = '1';
        } else {
            this.userNameDisplay.textContent = 'Connexion';
            this.userBtn.style.opacity = '0.7';
        }
    }

    updateSettings() {
        store.setState({
            isDarkMode: this.themeToggle.checked,
            notifVolume: this.notifVolume.value,
            language: this.language.value
        });
        Notifier.info('Paramètres mis à jour');
    }

    /**
     * AFFICHAGES
     */

    updateDisplay() {
        this.renderCrewMembers();
        this.renderAccreditations();
        this.renderRider();
        this.renderCallsheet();
        this.renderDocuments();
        this.updateEventDisplay();
    }

    updateEventDisplay() {
        const eventName = store.state.eventName || '—';
        this.eventNameDisplay.textContent = eventName;
        this.currentEventInput.value = eventName;

        // Mettre à jour aussi dans la callsheet
        if (store.state.callsheet.event) {
            this.callsheetEvent.value = store.state.callsheet.event;
        }
    }

    updateMetrics() {
        this.crewCountDisplay.textContent = store.state.crewMembers.length;
        this.accredCountDisplay.textContent = store.state.accreditations.length;
        this.signCountDisplay.textContent = store.state.documents.filter(d => d.status === 'pending').length;
    }

    /**
     * INITIALISATION
     */

    init() {
        this.updateDisplay();
        this.updateUserDisplay();

        // Charger les settings
        this.themeToggle.checked = store.state.isDarkMode;
        this.notifVolume.value = store.state.notifVolume;
        this.language.value = store.state.language;

        // Affiche un message de bienvenue
        if (!localStorage.getItem('aintercom_welcomed')) {
            Notifier.info('Bienvenue dans AINTERCOM OS');
            localStorage.setItem('aintercom_welcomed', 'true');
        }
    }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DashboardController();
    app.init();
    console.log('✓ AINTERCOM Dashboard UI initialized');
});
