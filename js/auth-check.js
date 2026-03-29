/**
 * AINTERCOM — Session Security Check
 * Vérifie la session Supabase au chargement de chaque page
 * Redirige automatiquement vers index.html si pas connecté
 * À charger EN PREMIER dans tous les fichiers protégés
 */

(function() {
    // Configuration Supabase
    const SUPABASE_CONFIG = {
        url: 'https://wmbyccbyhtjzvsxxrsbe.supabase.co',
        key: 'sb_publishable_EpUIqIUw_xcbF_M74ht-dg_eUg66XrS'
    };

    // Vérifier immédiatement la session
    async function checkAuth() {
        // Importer Supabase si nécessaire
        if (typeof supabase === 'undefined') {
            console.warn('⚠️ Supabase SDK non chargée');
            return;
        }

        try {
            const supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
            const { data: { session } } = await supabaseClient.auth.getSession();

            // Pas de session = redirection vers index.html
            if (!session) {
                const redirectUrl = window.location.origin + (window.AINTERCOM_CONFIG?.basePath || '') + '/index.html';
                window.location.replace(redirectUrl);
            } else {
                // Session valide - faire connaitre l'utilisateur globalement
                window.CURRENT_USER = session.user;
            }
        } catch (error) {
            console.error('❌ Erreur vérification auth:', error.message);
        }
    }

    // Exécuter la vérification
    checkAuth();
})();
