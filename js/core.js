/**
 * AINTERCOM OS — SYSTÈME CENTRAL DE GESTION D'ÉTAT
 * Gère toutes les données partagées et la communication entre modules
 */

class AIStore {
    constructor() {
        // État central
        this.state = {
            currentModule: 'show-control',
            user: null,
            isLoggedIn: false,

            // Show Control
            eventName: '',
            showStartTime: '',
            showDuration: '',
            showArtist: '',

            // Crew/Staff
            crewMembers: [],

            // Accréditations
            accreditations: [],

            // Rider Technique
            riderSpecs: {
                audio: '',
                light: '',
                video: ''
            },

            // Callsheet
            callsheet: {
                event: '',
                date: '',
                time: '',
                notes: ''
            },

            // Sign Flow
            documents: [],

            // Settings
            isDarkMode: true,
            language: 'fr',
            notifVolume: 70
        };

        // Listeners pour les changements d'état
        this.listeners = [];

        // Charger les données sauvegardées
        this.loadFromStorage();
    }

    /**
     * S'abonner aux changements d'état
     */
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    /**
     * Notifier tous les listeners
     */
    notify() {
        this.listeners.forEach(listener => listener(this.state));
        this.saveToStorage();
    }

    /**
     * Mettre à jour l'état
     */
    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.notify();
    }

    /**
     * Mettre à jour un sous-objet
     */
    updateNested(path, updates) {
        const keys = path.split('.');
        let obj = this.state;

        for (let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]];
        }

        obj[keys[keys.length - 1]] = {
            ...obj[keys[keys.length - 1]],
            ...updates
        };

        this.notify();
    }

    /**
     * Ajouter un membre du crew
     */
    addCrewMember(member) {
        const newMember = {
            id: Date.now().toString(),
            ...member,
            createdAt: new Date().toISOString()
        };
        this.state.crewMembers.push(newMember);
        this.notify();
        return newMember;
    }

    /**
     * Supprimer un membre du crew
     */
    removeCrewMember(id) {
        this.state.crewMembers = this.state.crewMembers.filter(m => m.id !== id);
        this.notify();
    }

    /**
     * Ajouter une accréditation
     */
    addAccreditation(accred) {
        const newAccred = {
            id: Date.now().toString(),
            ...accred,
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        this.state.accreditations.push(newAccred);
        this.notify();
        return newAccred;
    }

    /**
     * Supprimer une accréditation
     */
    removeAccreditation(id) {
        this.state.accreditations = this.state.accreditations.filter(a => a.id !== id);
        this.notify();
    }

    /**
     * Ajouter un document
     */
    addDocument(doc) {
        const newDoc = {
            id: Date.now().toString(),
            ...doc,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };
        this.state.documents.push(newDoc);
        this.notify();
        return newDoc;
    }

    /**
     * Mettre à jour le statut d'un document
     */
    updateDocumentStatus(id, status) {
        const doc = this.state.documents.find(d => d.id === id);
        if (doc) {
            doc.status = status;
            this.notify();
        }
    }

    /**
     * Supprimer un document
     */
    removeDocument(id) {
        this.state.documents = this.state.documents.filter(d => d.id !== id);
        this.notify();
    }

    /**
     * Définir l'événement (synchronise avec Show Control)
     */
    setEvent(eventName) {
        this.setState({
            eventName,
            'callsheet.event': eventName
        });
    }

    /**
     * Savegarder dans localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem('aintercom_state', JSON.stringify(this.state));
        } catch (e) {
            console.warn('Erreur sauvegarde localStorage:', e);
        }
    }

    /**
     * Charger depuis localStorage
     */
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('aintercom_state');
            if (saved) {
                this.state = { ...this.state, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('Erreur chargement localStorage:', e);
        }
    }

    /**
     * Simuler la connexion (en attente d'intégration Supabase)
     */
    login(email, password) {
        // TODO: Intégrer Supabase ici
        this.state.user = {
            email,
            id: 'user_' + Date.now(),
            name: email.split('@')[0]
        };
        this.state.isLoggedIn = true;
        this.notify();
        return this.state.user;
    }

    /**
     * Déconnexion
     */
    logout() {
        this.state.user = null;
        this.state.isLoggedIn = false;
        this.notify();
    }

    /**
     * Exporter les données (pour intégration Supabase)
     */
    exportForSync() {
        return {
            user: this.state.user,
            eventName: this.state.eventName,
            crewMembers: this.state.crewMembers,
            accreditations: this.state.accreditations,
            riderSpecs: this.state.riderSpecs,
            callsheet: this.state.callsheet,
            documents: this.state.documents
        };
    }

    /**
     * Importer les données (depuis Supabase)
     */
    importFromSync(data) {
        this.setState({
            eventName: data.eventName || this.state.eventName,
            crewMembers: data.crewMembers || this.state.crewMembers,
            accreditations: data.accreditations || this.state.accreditations,
            riderSpecs: data.riderSpecs || this.state.riderSpecs,
            callsheet: data.callsheet || this.state.callsheet,
            documents: data.documents || this.state.documents
        });
    }
}

// Instance globale du store
const store = new AIStore();

/**
 * NOTIFICATION SYSTEM
 */
class Notifier {
    static show(message, type = 'info', duration = 3000) {
        const container = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        container.appendChild(notification);

        if (duration > 0) {
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease-out forwards';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }

        return notification;
    }

    static success(message) {
        this.show(message, 'success', 3000);
    }

    static error(message) {
        this.show(message, 'error', 4000);
    }

    static info(message) {
        this.show(message, 'info', 3000);
    }
}

/**
 * UTILITÉS
 */
const Utils = {
    /**
     * Formater une date en français
     */
    formatDate(date) {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    /**
     * Formater l'heure
     */
    formatTime(time) {
        if (!time) return '—';
        const [hours, minutes] = time.split(':');
        return `${hours}h${minutes}`;
    },

    /**
     * Générer un code
     */
    generateCode(prefix = 'ACC') {
        return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
    },

    /**
     * Formater un numéro
     */
    formatNumber(num) {
        return new Intl.NumberFormat('fr-FR').format(num);
    }
};

// Ajouter l'animation slideOut aux styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('✓ AINTERCOM OS — Core System Loaded');
