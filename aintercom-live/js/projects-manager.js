/**
 * AINTERCOM LIVE - Gestionnaire de projets avec Supabase
 * Version améliorée avec synchronisation en temps réel
 */

class ProjectsManager {
    constructor() {
        this.supabase = null;
        this.currentUser = null;
        this.projects = [];
        this.editingProjectId = null;
        this.syncChannel = null;
        this.isOnline = navigator.onLine;
        
        // Configuration Supabase
        this.SUPABASE_URL = 'https://wmbyccbyhtjzvsxxrsbe.supabase.co';
        this.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtYnljY2J5aHRqenZzeHhyc2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3OTc0NDQsImV4cCI6MjA5MDM3MzQ0NH0.Pb3C36m05SygQcEhidH4fHXJHMvMw2XN7g5iCFkBGaM';
        
        this.init();
    }
    
    async init() {
        await this.initSupabase();
        this.setupEventListeners();
        this.checkNetworkStatus();
    }
    
    async initSupabase() {
        try {
            this.supabase = window.supabase.createClient(this.SUPABASE_URL, this.SUPABASE_KEY);
            console.log('✅ Supabase initialisé');
            return true;
        } catch (error) {
            console.error('❌ Erreur d\'initialisation Supabase:', error);
            return false;
        }
    }
    
    setupEventListeners() {
        // Écouter les changements de réseau
        window.addEventListener('online', () => this.handleNetworkChange(true));
        window.addEventListener('offline', () => this.handleNetworkChange(false));
        
        // Écouter les changements d'authentification
        if (this.supabase) {
            this.supabase.auth.onAuthStateChange((event, session) => {
                console.log('🔐 Événement auth:', event);
                if (event === 'SIGNED_IN') {
                    this.currentUser = session.user;
                    this.updateUserAvatar();
                    this.loadProjects();
                    this.startRealtimeSync();
                } else if (event === 'SIGNED_OUT') {
                    this.currentUser = null;
                    this.stopRealtimeSync();
                    window.location.href = 'login.html';
                }
            });
        }
    }
    
    checkNetworkStatus() {
        this.isOnline = navigator.onLine;
        this.updateSyncStatus();
    }
    
    handleNetworkChange(isOnline) {
        this.isOnline = isOnline;
        this.updateSyncStatus();
        
        if (isOnline) {
            console.log('🌐 Connexion rétablie, synchronisation...');
            this.syncProjects();
        } else {
            console.log('⚠️ Hors ligne, utilisation du cache local');
        }
    }
    
    updateSyncStatus() {
        const syncElement = document.getElementById('sync-status');
        if (!syncElement) return;
        
        syncElement.style.display = 'flex';
        
        if (this.isOnline) {
            syncElement.className = 'sync-status syncing';
            syncElement.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> <span>Sync...</span>';
            
            // Simuler la fin de la synchronisation après 2 secondes
            setTimeout(() => {
                syncElement.className = 'sync-status synced';
                syncElement.innerHTML = '<i class="fas fa-cloud"></i> <span>Sync</span>';
            }, 2000);
        } else {
            syncElement.className = 'sync-status error';
            syncElement.innerHTML = '<i class="fas fa-cloud-slash"></i> <span>Offline</span>';
        }
    }
    
    async loadProjects() {
        try {
            if (!this.supabase || !this.currentUser) {
                console.log('⚠️ Supabase non initialisé, utilisation du localStorage');
                this.loadFromLocalStorage();
                return;
            }
    
            // Afficher l'indicateur de chargement
            this.showLoading(true);
    
            // Essayer de charger depuis Supabase
            const { data, error } = await this.supabase
                .from('projects')
                .select('*')
                .eq('created_by', this.currentUser.id)
                .eq('is_active', true)
                .order('created_at', { ascending: false });
    
            if (error) {
                console.warn('❌ Erreur Supabase, fallback localStorage:', error);
                this.loadFromLocalStorage();
                return;
            }
    
            if (data && data.length > 0) {
                // Convertir les données Supabase au format local
                this.projects = data.map(project => ({
                    id: project.id,
                    name: project.name,
                    date: project.date,
                    time: project.time,
                    venue: project.venue,
                    type: project.type,
                    director: project.director,
                    notes: project.notes,
                    createdAt: project.created_at,
                    updatedAt: project.updated_at,
                    supabaseId: project.id,
                    isSynced: true
                }));
                
                // Synchroniser avec localStorage comme cache
                localStorage.setItem('aintercom-projects', JSON.stringify(this.projects));
                console.log(`✅ ${this.projects.length} projets chargés depuis Supabase`);
                
                // Afficher l'indicateur LIVE
                this.showLiveIndicator(true);
            } else {
                console.log('📭 Aucun projet dans Supabase, vérification localStorage');
                this.loadFromLocalStorage();
            }
        } catch (error) {
            console.error('❌ Erreur chargement projets:', error);
            this.loadFromLocalStorage();
        } finally {
            this.showLoading(false);
            this.renderProjects();
            this.updateStats();
        }
    }
    
    loadFromLocalStorage() {
        const saved = localStorage.getItem('aintercom-projects');
        if (saved) {
            try {
                this.projects = JSON.parse(saved);
                console.log(`📁 ${this.projects.length} projets chargés depuis localStorage`);
                
                // Marquer les projets comme non synchronisés
                this.projects.forEach(project => {
                    project.isSynced = false;
                });
            } catch (e) {
                console.error('❌ Erreur de parsing localStorage:', e);
                this.projects = [];
            }
        } else {
            this.projects = [];
            console.log('📭 Aucun projet dans localStorage');
        }
        
        // Cacher l'indicateur LIVE en mode hors ligne
        this.showLiveIndicator(this.isOnline);
    }
    
    showLoading(show) {
        const grid = document.getElementById('projects-grid');
        if (!grid) return;
        
        if (show) {
            grid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:40px">
                    <div class="loading-spinner" style="width:24px;height:24px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin 1s linear infinite;margin:0 auto"></div>
                    <div style="margin-top:10px;font-size:12px;color:var(--tx2)">Chargement des projets...</div>
                </div>
            `;
        }
    }
    
    showLiveIndicator(show) {
        const indicator = document.getElementById('live-indicator');
        if (indicator) {
            indicator.style.display = show ? 'flex' : 'none';
        }
    }
    
    renderProjects() {
        const grid = document.getElementById('projects-grid');
        const emptyState = document.getElementById('empty-state');
        const projectCount = document.getElementById('project-count');
        
        if (!grid) return;
        
        // Garder la carte "Nouveau projet"
        const newCard = grid.querySelector('.project-card-new');
        grid.innerHTML = '';
        
        // Mettre à jour le compteur
        if (projectCount) {
            projectCount.textContent = `(${this.projects.length} projet${this.projects.length !== 1 ? 's' : ''})`;
        }
        
        if (this.projects.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            if (newCard) grid.appendChild(newCard);
            return;
        }
        
        if (emptyState) emptyState.style.display = 'none';
        
        this.projects.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            const typeLabels = {
                'concert': 'Concert',
                'conference': 'Conférence',
                'festival': 'Festival',
                'sport': 'Sport',
                'private': 'Privé',
                'other': 'Autre'
            };
            
            const typeLabel = typeLabels[project.type] || project.type;
            const dateStr = project.date ? new Date(project.date).toLocaleDateString('fr-FR') : '—';
            
            // Indicateur de synchronisation
            const syncIcon = project.isSynced ? 
                '<i class="fas fa-cloud" style="color:var(--success);font-size:9px;margin-left:4px" title="Synchronisé"></i>' :
                '<i class="fas fa-cloud-slash" style="color:var(--warning);font-size:9px;margin-left:4px" title="Non synchronisé"></i>';
            
            card.innerHTML = `
                <div class="project-card-top">
                    <div style="display:flex;align-items:center;gap:6px">
                        <span class="project-badge">${typeLabel.toUpperCase()}</span>
                        ${syncIcon}
                    </div>
                    <div class="project-card-actions">
                        <button class="project-icon-btn" onclick="projectsManager.editProject(${index})" title="Modifier">✎</button>
                        <button class="project-icon-btn del" onclick="projectsManager.confirmDeleteProject(${index})" title="Supprimer">✕</button>
                    </div>
                </div>
                <div class="project-name">${project.name}</div>
                <div class="project-venue">${project.venue || '—'} · ${dateStr}</div>
                <div class="project-meta">
                    <span>👤 ${project.director || '—'}</span>
                    <span>📅 ${project.date ? new Date(project.date).toLocaleDateString('fr-FR') : '—'}</span>
                </div>
            `;
            
            card.onclick = () => this.openProject(index);
            grid.appendChild(card);
        });
        
        if (newCard) grid.appendChild(newCard);
        
        // Afficher la section statistiques si des projets existent
        const statsSection = document.getElementById('stats-section');
        if (statsSection) {
            statsSection.style.display = this.projects.length > 0 ? 'block' : 'none';
        }
    }
    
    updateStats() {
        if (this.projects.length === 0) return;
        
        // Projets actifs
        const activeElement = document.getElementById('stat-active');
        if (activeElement) {
            activeElement.textContent = this.projects.length;
        }
        
        // Dernier projet
        const lastElement = document.getElementById('stat-last');
        if (lastElement && this.projects.length > 0) {
            const lastProject = this.projects[0];
            const date = lastProject.date ? new Date(lastProject.date).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'short' 
            }) : '—';
            lastElement.textContent = `${lastProject.name.substring(0, 12)}${lastProject.name.length > 12 ? '...' : ''} · ${date}`;
        }
        
        // Stockage
        const storageElement = document.getElementById('stat-storage');
        if (storageElement) {
            storageElement.textContent = this.isOnline ? 'Cloud' : 'Local';
            storageElement.style.color = this.isOnline ? 'var(--success)' : 'var(--warning)';
        }
    }
    
    async saveProject() {
        const name = document.getElementById('np-name').value.trim().toUpperCase();
        if (!name) {
            this.showToast('Veuillez saisir un nom pour le projet', 'warning');
            return;
        }
        
        const project = {
            id: this.editingProjectId !== null ? this.projects[this.editingProjectId].id : Date.now().toString(),
            name,
            date: document.getElementById('np-date').value,
            time: document.getElementById('np-time').value,
            venue: document.getElementById('np-venue').value.trim(),
            type: document.getElementById('np-type').value,
            director: document.getElementById('np-director').value.trim(),
            notes: document.getElementById('np-notes').value.trim(),
            createdAt: this.editingProjectId !== null ? this.projects[this.editingProjectId].createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isSynced: false
        };
        
        // Sauvegarder localement d'abord
        if (this.editingProjectId !== null) {
            this.projects[this.editingProjectId] = project;
        } else {
            this.projects.unshift(project); // Ajouter au début
        }
        
        // Sauvegarder dans localStorage
        localStorage.setItem('aintercom-projects', JSON.stringify(this.projects));
        
        // Fermer le modal
        this.closeModal('modal-new-project');
        
        // Afficher le projet
        this.renderProjects();
        this.updateStats();
        
        // Synchroniser avec Supabase si en ligne
        if (this.isOnline && this.supabase && this.currentUser) {
            await this.syncProjectToSupabase(project);
        }
        
        this.showToast(
            this.editingProjectId !== null ? 'Projet mis à jour' : 'Projet créé',
            'success'
        );
        
        this.editingProjectId = null;
    }
    
    async syncProjectToSupabase(project) {
        try {
            if (!this.supabase || !this.currentUser) return;
            
            const projectData = {
                name: project.name,
                date: project.date || null,
                time: project.time || null,
                venue: project.venue || null,
                type: project.type || 'other',
                director: project.director || null,
                notes: project.notes || null,
                created_by: this.currentUser.id,
                updated_at: new Date().toISOString(),
                is_active: true
            };
            
            let result;
            
            if (project.supabaseId) {
                // Mettre à jour un projet existant
                result = await this.supabase
                    .from('projects')
                    .update(projectData)
                    .eq('id', project.supabaseId);
            } else {
                // Créer un nouveau projet
                result = await this.supabase
                    .from('projects')
                    .insert([projectData])
                    .select();
                
                if (result.data && result.data[0]) {
                    // Mettre à jour l'ID local avec l'ID Supabase
                    project.supabaseId = result.data[0].id;
                    project.isSynced = true;
                    
                    // Mettre à jour localStorage
                    localStorage.setItem('aintercom-projects', JSON.stringify(this.projects));
                }
            }
            
            if (result.error) throw result.error;
            
            console.log('✅ Projet synchronisé avec Supabase');
            project.isSynced = true;
            
        } catch (error) {
            console.error('❌ Erreur synchronisation Supabase:', error);
            project.isSynced = false;
        }
    }
    
    async syncProjects() {
        if (!this.isOnline || !this.supabase || !this.currentUser) return;
        
        console.log('🔄 Synchronisation des projets...');
        
        // Synchroniser chaque projet non synchronisé
        for (const project of this.projects) {
            if (!project.isSynced) {
                await this.syncProjectToSupabase(project);
            }
        }
        
        // Recharger depuis Supabase pour avoir les données à jour
        await this.loadProjects();
    }
    
    startRealtimeSync() {
        if (!this.supabase || !this.currentUser || this.syncChannel) return;
        
        console.log('🔔 Démarrage synchronisation temps réel');
        
        this.syncChannel = this.supabase
            .channel('projects-changes')
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'projects',
                    filter: `created_by=eq.${this.currentUser.id}`
                }, 
                (payload) => {
                    console.log('🔄 Changement détecté dans Supabase:', payload);
                    this.loadProjects(); // Recharger les projets
                }
            )
            .subscribe();
    }
    
    stopRealtimeSync() {
        if (this.syncChannel) {
            this.supabase.removeChannel(this.syncChannel);
            this.syncChannel = null;
            console.log('🔕 Synchronisation temps réel arrêtée');
        }
    }
    
    openProject(index) {
        if (index >= 0 && index < this.projects.length) {
            const project = this.projects[index];
            // Sauvegarder le projet sélectionné
            localStorage.setItem('aintercom-current-project', JSON.stringify(project));
            
            // Ajouter un effet visuel
            this.showToast(`Ouverture de "${project.name}"`, 'info');
            
            // Rediriger vers app.html après un court délai
            setTimeout(() => {
                window.location.href = 'app.html';
            }, 500);
        }
    }
    
    editProject(index) {
        if (index >= 0 && index < this.projects.length) {
            this.editingProjectId = index;
            const project = this.projects[index];
            
            // Remplir