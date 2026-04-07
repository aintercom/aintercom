/**
 * AINTERCOM — Configuration de Chemin de Base
 * Détecte automatiquement le base path pour GitHub Pages ou domaine custom
 * À charger AVANT tous les autres scripts
 */

(function() {
    // Détecter le chemin de base
    function detectBasePath() {
        const pathname = window.location.pathname;
        const hostname = window.location.hostname;
        
        // GitHub Pages: https://aintercom.github.io/aintercom/...
        // Domaine live: https://live.aintercom.fr/
        if (hostname.includes('.github.io') || hostname.includes('live.aintercom.fr')) {
            // Pour le domaine live, pas de base path supplémentaire
            if (hostname.includes('live.aintercom.fr')) {
                return '';
            }
            // Extraire le repo name (ex: /aintercom/)
            const match = pathname.match(/\/([^/]+)\//) || pathname.match(/\/(aintercom)\//);
            if (match && match[1]) {
                return '/' + match[1];
            }
        }
        
        // Domaine custom ou localhost
        // Vérifier s'il y a un chemmin personnalisé
        const parts = pathname.split('/').filter(p => p);
        
        // Si on a un chemin type /app/something, c'est le basePath
        if (parts.length > 1 && parts[0] !== 'index.html' && parts[0] !== 'login.html' && parts[0] !== 'dashboard.html') {
            return '/' + parts[0];
        }
        
        // Pas de base path = racine
        return '';
    }
    
    // Stockage global
    window.AINTERCOM_CONFIG = {
        basePath: detectBasePath(),
        rootUrl: window.location.origin + detectBasePath(),
        isDev: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
        isGitHubPages: window.location.hostname.includes('.github.io'),
        
        // Resolved URLs pour les redirects
        getFullPath: function(path) {
            // Nettoyer le chemin
            let cleanPath = path;
            if (!cleanPath.startsWith('/')) {
                cleanPath = '/' + cleanPath;
            }
            
            // Éviter les doubles slashes
            if (this.basePath) {
                if (cleanPath.startsWith(this.basePath)) {
                    return cleanPath;
                }
                return this.basePath + cleanPath;
            }
            
            return cleanPath;
        },
        
        getFullUrl: function(path) {
            return window.location.origin + this.getFullPath(path);
        },
        
        // Logs de déco
        log: function() {
            console.log('%c🎙️ AINTERCOM Configuration', 'color: #d4af37; font-weight: bold; font-size: 14px;');
            console.log('Base Path:', this.basePath || '(root)');
            console.log('Root URL:', this.rootUrl);
            console.log('Mode:', this.isDev ? 'Development' : 'Production');
            console.log('Platform:', this.isGitHubPages ? 'GitHub Pages' : 'Custom Domain');
        }
    };
    
    // Auto-log on init
    window.AINTERCOM_CONFIG.log();
})();
