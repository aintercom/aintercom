# AINTERCOM OS 🎙️

**La plateforme opérationnelle pour les productions événementielles | Version 1.0**

![AINTERCOM OS](./assets/os-banner.md)

## Vue d'ensemble

AINTERCOM OS est un système d'exploitation technique dédié à la gestion complète des productions événementielles (concerts en arena/stade). Une interface centralisée et intuitive regroupe tous les outils essentiels : gestion d'équipe, accréditations, rider technique, callsheet et flux de signature.

### 🎯 Objectifs clés

- **Dashboard unitaire** : Tous les modules accessibles depuis une interface principale
- **Synchronisation inter-modules** : Les données de Callsheet apparaissent automatiquement dans Show Control
- **Architecture modulaire** : Facile à étendre et à personnaliser
- **Préparation cloud** : Infrastructure prête pour Supabase (auth, sync temps réel)
- **Design technique** : Interface sombre, efficace, inspirée des OS d'exploitation

## 🏗️ Structure du projet

```
aintercom/
├── dashboard.html              # Interface principale
├── index.html                  # Page d'accueil (ancienne)
├── css/
│   └── dashboard.css           # Design system complet
├── js/
│   ├── core.js                 # Gestion d'état (AIStore)
│   └── modules.js              # Logique UI et événements
├── modules/                    # Modules accessibles
│   ├── lexique.html            # Lexique technique
│   ├── accred/
│   ├── rider/
│   ├── benevolat/
│   └── sign.html
├── SUPABASE_SETUP.md           # Guide d'intégration Supabase
└── README.md                   # Ce fichier
```

## 🚀 Démarrage rapide

### Installation

1. **Cloner le projet**
```bash
git clone <repo>
cd aintercom
```

2. **Lancer un serveur local**
```bash
# Python 3
python -m http.server 8000

# ou Node.js avec http-server
npx http-server
```

3. **Accéder au dashboard**
```
http://localhost:8000/dashboard.html
```

### Premier usage

1. **Créer une callsheet** : Accédez à l'onglet "Callsheet" et créez votre événement
2. **Le nom apparaît en haut** : Regardez le header du Show Control se remplir
3. **Ajouter du personnel** : Utilisez l'onglet "Crew/Staff"
4. **Générer des accréditations** : Section "Accréditations"
5. **Rider technique** : Complétez les spécifications
6. **Sign Flow** : Créez des documents à faire signer

## 📦 Modules

### 🎬 Show Control
État central de la production. Affiche :
- Événement en cours (synchronisé avec Callsheet)
- Horaires et durée
- Métriques en direct (crew, accréditations, signatures)

### 👥 Crew/Staff
Gestion complète du personnel :
- Ajout/suppression de membres
- Rôles (Régie, Technique, Sécurité, Accueil, Autre)
- Emails et contacts

### 🎫 Accréditations
Génération de badges :
- Types : All Access, Crew, Technique, VIP, Presse
- Codes uniques générés automatiquement
- Statuts (actif, révoqué, etc.)

### 🎚️ Rider Technique
Spécifications techniques complètes :
- Audio, Lumière, Vidéo
- Format monospace pour précision
- Synchronisation en temps réel

### 📋 Callsheet
Directive de production :
- Nom d'événement (sync Show Control)
- Date et heure de call
- Notes et directives
- Format compact et lisible

### ✍️ Sign Flow
Documents à signer :
- Création de documents
- Suivi du statut (en attente/signé)
- Prêt pour intégration E-signature

### 📚 Lexique
Outil flottant d'aide rapide :
- Accessible via bouton icon 📖
- Definitions techniques
- Glossaire métier

## 🎨 Design System

### Palette de couleurs

```
--bg:              #0a0e14    (Noir fondation)
--surface:         #14191f    (Surface primaire)
--accent:          #00d4ff    (Cyan tech)
--success:         #00d97e    (Vert)
--warning:         #ffb300    (Amber)
--danger:          #ff3b3b    (Rouge)
--text-primary:    #e8f4ff    (Blanc froid)
--text-secondary:  #a0b5cc    (Gris)
```

### Typographies

- **Display** : Oswald (titres, modules)
- **Body** : Inter (texte, formulaires)
- **Mono** : Share Tech Mono (codes, données techniqeus)
- **Hero** : Bebas Neue (branding)

## 🔐 Gestion d'état

### AIStore (core.js)

Architecture centralisée de gestion d'état :

```javascript
const store = new AIStore()

// S'abonner aux changements
store.subscribe((state) => {
    console.log('État mis à jour:', state)
})

// Mettre à jour l'état
store.setState({ eventName: 'Concert 2026' })

// Ajouter un member
store.addCrewMember({ name: 'Alice', role: 'Régie' })
```

### Données persistantes

- **Sauvegarde locale** : localStorage
- **Clé** : `aintercom_state`
- **Restauration automatique** au chargement

## 🔌 Connexions inter-modules

### Callsheet → Show Control

```javascript
// Quand une callsheet est créée
handleCallsheetSubmit(e) {
    // ...
    store.setState({ eventName: callsheet.event })
    store.updateEventDisplay()  // Show Control se met à jour
}
```

### Metrics bidirectionnelles

Le Show Control affiche en temps réel :
- Nombre de membres du crew
- Nombre d'accréditations
- Documents en attente de signature

## 📱 Responsive

- **Desktop** : Sidebar fixe, grille 2 colonnes
- **Tablet** : Sidebar réduite, grille 1 colonne
- **Mobile** : Sidebar avec icônes, stack complètement vertical
- **Petit écran** : Sidebar ultra-compacte (60px)

## 🔑 Fonctionnalités principales

### ✅ Implémentées

- ✓ Interface dashboard multi-onglets
- ✓ Gestion complète du état (AIStore)
- ✓ Persistance locale (localStorage)
- ✓ Connexions inter-modules
- ✓ Design technique sombre
- ✓ Notifications toast
- ✓ Responsive design
- ✓ Lexique flottant
- ✓ Panel paramètres

### ⏳ À venir (Supabase)

- ▭ Authentification utilisateur
- ▭ Synchronisation Supabase
- ▭ Réplication des données en temps réel
- ▭ Export/Import données
- ▭ Multi-utilisateurs collaboratif
- ▭ Webhooks pour notifications externes
- ▭ Analytics et reporting

## 🛠️ Développement

### Ajouter un nouveau module

1. **Créer la section HTML** dans dashboard.html
```html
<section id="my-module" class="module-content">
    <!-- Contenu -->
</section>
```

2. **Ajouter le bouton nav**
```html
<button class="nav-item" data-module="my-module">
    <i class="fas fa-icon"></i>
    <span>Mon Module</span>
</button>
```

3. **Implémenter la logique** dans modules.js
```javascript
handleMyModuleSubmit(e) {
    // Logique
    store.setState({ /* updates */ })
}
```

### Ajouter une nouvelle connexion inter-modules

Utiliser le pattern observer :

```javascript
// Dans core.js
store.subscribe((state) => {
    if (state.eventName !== previousName) {
        // Réagir au changement
        notifyOtherModules(state.eventName)
    }
})
```

## 📊 Données supportées

```javascript
{
    // User & Auth
    user: { id, email, name },
    isLoggedIn: boolean,

    // Production
    eventName: string,
    showStartTime: string,
    showDuration: number,
    showArtist: string,

    // Personnel
    crewMembers: [
        { id, name, email, role, createdAt }
    ],

    // Accréditations
    accreditations: [
        { id, name, type, code, date, status, createdAt }
    ],

    // Technique
    riderSpecs: {
        audio: string,
        light: string,
        video: string
    },

    // Callsheet
    callsheet: {
        event: string,
        date: string,
        time: string,
        notes: string
    },

    // Documents
    documents: [
        { id, title, content, signer, status, createdAt }
    ]
}
```

## 🔗 Intégration Supabase

> **Voir [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) pour le guide complet**

Configuration minimale :

```javascript
// .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## 📞 Support & Licences

- **Type** : Production événementielle
- **Version** : 1.0
- **Dernière mise à jour** : 29 mars 2026
- **Status** : En développement (préparation Supabase)

---

**Créé avec 💙 pour les producteurs événementiels modernes**

*AINTERCOM OS — Plateforme opérationnelle nouvelle génération*
