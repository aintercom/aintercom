# AINTERCOM OS — Developer Guide

## 🛠️ Guide de développement

### Prérequis

- VS Code (recommandé)
- Node.js 16+ (optionnel, pour serve/build)
- Navigateur moderne (Chrome/Firefox)
- Git (pour versionner)

### Structure du projet

```
aintercom/
├── dashboard.html              # Fichier principal
├── css/
│   └── dashboard.css           # Styles du dashboard
├── js/
│   ├── core.js                 # Gestion d'état (AIStore)
│   └── modules.js              # Logique UI (DashboardController)
├── modules/                    # Modules externes
│   ├── lexique.html            # Outil d'aide
│   ├── accred/                 # Module accréditations
│   ├── rider/                  # Module rider
│   ├── benevolat/              # Module bénévolat
│   └── sign.html               # Module signature
└── docs/
    ├── README.md               # Overview
    ├── QUICKSTART.md           # Démarrage rapide
    ├── ARCHITECTURE.md         # Architecture
    ├── CONNECTIONS.md          # Connexions inter-modules
    ├── SUPABASE_SETUP.md       # Guide Supabase
    ├── BRANDING.md             # Design system
    └── (ce fichier)
```

---

## 🚀 Démarrer le développement

### 1. Setup local

```bash
# Clone le repo
git clone <repo> aintercom
cd aintercom

# Lancer un serveur local
python -m http.server 8000

# Ou avec Node
npx http-server

# Accéder
http://localhost:8000/dashboard.html
```

### 2. Ouvrir DevTools

```bash
Chrome/Firefox → F12 ou Cmd+Option+I

# Onglets utiles:
- Console          → Voir logs, tester store
- Elements/Code    → DOM + CSS
- Storage          → localStorage
- Network          → Requests (préparation Supabase)
```

### 3. Tester le state management

```javascript
// Console
console.log(store.state)                    // Affiche l'état
store.setState({ eventName: 'Test' })       // Modifie l'état
store.addCrewMember({ name: 'Test' })       // Ajoute personnel
localStorage.getItem('aintercom_state')     // Voir ce qui est save
```

---

## 🧩 Ajouter un nouveau module

### Étape 1 : Créer la structure HTML

```html
<!-- À ajouter dans dashboard.html, dans .modules-container -->

<section id="mon-module" class="module-content">
    <div class="module-grid">
        <!-- Formulaire ou contenu -->
        <div class="mon-panel">
            <h3>🎯 Mon titre</h3>
            <form id="mon-form">
                <input type="text" id="mon-input">
                <button type="submit" class="btn-primary">
                    Action
                </button>
            </form>
        </div>
        
        <!-- Affichage des résultats -->
        <div class="mon-display">
            <h3>📊 Résultats</h3>
            <div id="mon-items"></div>
        </div>
    </div>
</section>
```

### Étape 2 : Ajouter le bouton nav

```html
<!-- À ajouter dans .sidebar-nav -->

<button class="nav-item" data-module="mon-module" data-icon="icon-name">
    <span class="nav-icon"><i class="fas fa-icon-name"></i></span>
    <span class="nav-label">Mon Module</span>
</button>
```

### Étape 3 : Ajouter les styles

```css
/* À ajouter dans css/dashboard.css */

.mon-panel,
.mon-display {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 24px;
    backdrop-filter: blur(10px);
}

.mon-panel h3,
.mon-display h3 {
    font-family: var(--f-display);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 1px;
    color: var(--accent);
    margin-bottom: 16px;
    text-transform: uppercase;
}
```

### Étape 4 : Ajouter la logique

```javascript
// À ajouter dans modules.js, dans DashboardController

setupDOMElements() {
    // ... existants ...
    this.monForm = document.getElementById('mon-form');
    this.monInput = document.getElementById('mon-input');
    this.monItems = document.getElementById('mon-items');
}

bindEvents() {
    // ... existants ...
    this.monForm.addEventListener('submit', (e) => this.handleMonSubmit(e));
}

handleMonSubmit(e) {
    e.preventDefault();

    const data = {
        name: this.monInput.value,
        timestamp: new Date().toISOString()
    };

    // Ajouter au state
    store.setState({ monData: data });
    
    this.renderMonData();
    this.monForm.reset();
    Notifier.success('Données ajoutées');
}

renderMonData() {
    const items = store.state.monData;
    
    if (!items) {
        this.monItems.innerHTML = '<p class="empty-state">Aucune donnée</p>';
        return;
    }

    this.monItems.innerHTML = `
        <div class="mon-item">
            <div class="item-name">${items.name}</div>
            <div class="item-meta">${items.timestamp}</div>
        </div>
    `;
}
```

### Étape 5 : Ajouter au state initial

```javascript
// Dans core.js, le constructeur AIStore

this.state = {
    // ... existants ...
    monData: null,
};
```

---

## 🔌 Créer une nouvelle connexion inter-modules

### Scénario : Sync "Mon Module" → Show Control

### 1. Émettre le changement

```javascript
// modules.js
handleMonSubmit(e) {
    // ...
    store.setState({ 
        monData: data,
        eventName: data.name  // ← Sync avec Show Control
    });
}
```

### 2. Ajouter le listener

```javascript
// modules.js - updateMetrics()
updateMetrics() {
    // ...
    // Si mon module affecte une métrique
    this.myModuleCounter.textContent = 
        store.state.monData ? 1 : 0;
}
```

### 3. Tester la connexion

```javascript
// Console
store.setState({ eventName: 'Mon event' })
// Vérifier que Show Control et autres modules se mettent à jour
```

---

## 🗄️ Étendre le state

### Ajouter une nouvelle donnée

```javascript
// core.js
this.state = {
    // ... existantes ...
    
    // Nouvelle donnée
    monNouvelElement: {
        id: '',
        name: '',
        status: 'active'
    }
};
```

### Ajouter une méthode

```javascript
// core.js - AIStore class

addMonElement(element) {
    const newElement = {
        id: Date.now().toString(),
        ...element,
        createdAt: new Date().toISOString()
    };
    
    // Initialiser si pas de liste
    if (!Array.isArray(this.state.mesElements)) {
        this.state.mesElements = [];
    }
    
    this.state.mesElements.push(newElement);
    this.notify();
    return newElement;
}

removeMonElement(id) {
    this.state.mesElements = 
        this.state.mesElements.filter(el => el.id !== id);
    this.notify();
}
```

---

## 🔄 Intégration Supabase

### Pré-requis

1. Créer compte Supabase
2. Créer projet + tables (voir [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
3. Obtenir clés API

### Installation

```bash
npm install @supabase/supabase-js
```

### Créer js/supabase.js

```javascript
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://your-project.supabase.co'
const SUPABASE_KEY = 'YOUR_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

/**
 * Authentification
 */
export async function loginUser(email, password) {
    const { data, error } = await supabase.auth
        .signInWithPassword({ email, password })
    
    if (error) throw error
    return data.user
}

/**
 * Récupérer l'événement
 */
export async function fetchEvent(eventId) {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single()
    
    if (error) throw error
    return data
}

/**
 * Créer un événement
 */
export async function createEvent(userId, eventData) {
    const { data, error } = await supabase
        .from('events')
        .insert([{
            user_id: userId,
            name: eventData.name,
            // ... autres champs
        }])
        .select()
        .single()
    
    if (error) throw error
    return data
}
```

### Intégrer dans core.js

```javascript
// core.js - AIStore

async syncToSupabase() {
    try {
        const dataToSync = this.exportForSync()
        
        // Uploader les données
        const { error } = await supabase
            .from('events')
            .upsert(dataToSync, { onConflict: 'id' })
        
        if (!error) {
            Notifier.success('Synced to cloud')
        }
    } catch (e) {
        Notifier.error('Sync error: ' + e.message)
    }
}

async syncFromSupabase(eventId) {
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single()
        
        if (!error) {
            this.importFromSync(data)
        }
    } catch (e) {
        Notifier.error('Fetch error: ' + e.message)
    }
}
```

---

## 🧪 Tester localement

### Tester le module

```javascript
// Console : Tester directement
app.handleMonSubmit({
    preventDefault: () => {}
})

// Vérifier l'état
console.log(store.state)

// Vérifier le rendu
console.log(document.getElementById('mon-items').innerHTML)
```

### Tester la persistance

```javascript
// 1. Ajouter une donnée
store.setState({ testData: 'valeur' })

// 2. Vérifier localStorage
localStorage.getItem('aintercom_state')

// 3. Recharger la page (F5)

// 4. Vérifier que ça charge
console.log(store.state.testData)  // Doit être 'valeur'
```

### Tester les connexions

```javascript
// 1. Modification dans Module A
store.setState({ eventName: 'Event Test' })

// 2. Vérifier que Module B se met à jour
console.log(document.getElementById('event-name').textContent)
// Doit être 'Event Test'
```

---

## 📝 Bonnes pratiques

### ✅ À FAIRE

- Utiliser `store.notify()` après chaque changement d'état
- Utiliser des IDs uniques (UUID ou Date.now())
- Persister avec `saveToStorage()`
- Feedback utilisateur avec `Notifier`
- Classes CSS cohérentes
- Responsive d'abord

### ❌ À ÉVITER

- Mutater le state directement sans notify()
- Ajouter du CSS inline
- Imbrication HTML > 3 niveaux pour listes
- Variables globales en dehors du store
- Logique métier dans les événements handlers

---

## 🐛 Debugging

### Console commands

```javascript
// Afficher l'état complet
store.state

// Afficher un module spécifiquement
store.state.crewMembers

// Ajouter un listener custom
store.subscribe((state) => {
    console.log('State changed:', state)
})

// Exporter les datos
JSON.stringify(store.state, null, 2)

// Tester une notification
Notifier.success('Test!')
```

### Fichier de test

```html
<!-- À la fin de dashboard.html avant </body> -->

<script>
if (window.location.search.includes('debug')) {
    console.log('🔧 AINTERCOM DEBUG MODE')
    console.log('Store:', store)
    console.log('App:', app)
    window.DEBUG = {
        addTestCrew: () => {
            store.addCrewMember({
                name: 'Debug User',
                email: 'debug@test.com',
                role: 'test'
            })
        },
        addTestEvent: () => {
            store.setState({
                eventName: 'Debug Event'
            })
        },
        clearAll: () => {
            localStorage.clear()
            location.reload()
        }
    }
}
</script>

<!-- Accès via ?debug=1 -->
```

---

## 🚢 Déployer

### Préparation (v1.1)

```bash
# 1. Build et minify (optionnel)
npm run build

# 2. Tester le build localement
serve dist/

# 3. Uploader sur hosting
# Netlify, Vercel, GitHub Pages, etc
```

### Checklist avant production

- ✓ Toutes les fonctionnalités testées
- ✓ localStorage persiste correctement
- ✓ Responsive sur mobile/tablet
- ✓ Pas de console errors
- ✓ Performance acceptable (Lighthouse > 80)
- ✓ Supabase prêt (optionnel v1.1)

---

## 📚 Ressources

- [MDN Web Docs](https://developer.mozilla.org)
- [JavaScript.info](https://javascript.info)
- [CSS-Tricks](https://css-tricks.com)
- [Font Awesome Icons](https://fontawesome.com/icons)
- [Supabase Docs](https://supabase.com/docs)

---

**Guide complet pour développement et extension | v1.0**

*Commencez par [QUICKSTART.md](./QUICKSTART.md) si vous êtes nouveau!*
