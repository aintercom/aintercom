// AINTERCOM - Navigation simple et authentification
// Solution simple pour la navigation entre index et app

console.log('🚀 Navigation simple initialisée');

// Fonction pour aller à l'index (sélection de projets)
function goToIndex() {
    console.log('📋 Retour aux projets');
    window.location.href = 'index.html';
}

// Fonction pour gérer la déconnexion
function handleLogout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        // Supprimer la session
        localStorage.removeItem('aintercom_session');
        localStorage.removeItem('aintercom_current_project');
        console.log('👋 Déconnexion');
        window.location.href = 'index.html';
    }
}

// Fonction pour mettre à jour l'affichage de l'utilisateur
function updateUserDisplay() {
    const session = localStorage.getItem('aintercom_session');
    if (session) {
        try {
            const user = JSON.parse(session);
            const userName = user.name || user.email.split('@')[0];
            const userInitial = userName.charAt(0).toUpperCase();
            
            // Mettre à jour l'avatar
            const userAvatar = document.getElementById('user-avatar');
            if (userAvatar) {
                userAvatar.textContent = userInitial;
                userAvatar.title = `Connecté: ${userName}`;
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
                
                // Changer l'événement onclick
                userAvatar.setAttribute('onclick', 'handleLogout()');
                
                console.log(`👤 Utilisateur: ${userName}`);
            }
        } catch (e) {
            console.error('Erreur session:', e);
        }
    }
}

// Fonction pour ajouter le bouton "Projets" dans app.html
function addProjectsButton() {
    if (!window.location.pathname.includes('app.html')) return;
    
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

// Fonction pour ajouter le bouton de déconnexion dans index.html
function addLogoutButtonToIndex() {
    if (!window.location.pathname.includes('index.html')) return;
    
    const statusBar = document.querySelector('.status-bar');
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

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Initialisation navigation');
    
    // Mettre à jour l'affichage utilisateur
    updateUserDisplay();
    
    // Ajouter les boutons selon la page
    addProjectsButton();
    addLogoutButtonToIndex();
    
    // Exposer les fonctions globalement
    window.goToIndex = goToIndex;
    window.handleLogout = handleLogout;
    
    console.log('✅ Navigation simple prête');
});