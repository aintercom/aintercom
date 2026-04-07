# AINTERCOM OS — Architecture Détaillée

## 🏗️ Architecture syystémique

```
┌─────────────────────────────────────────────────────────────────┐
│                      LAYER PRESENTATION                          │
│                    (dashboard.html - UI)                         │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐
│ │ Sidebar Nav │ │ Content      │ │ Drawers      │ │ Modals     │
│ │ - Show Ctrl │ │ Panels       │ │ - Lexique    │ │ - Login    │
│ │ - Crew      │ │ - Forms      │ │ - Settings   │ │            │
│ │ - Accreds   │ │ - Lists      │ │              │ │            │
│ │ - Rider     │ │ - Displays   │ │              │ │            │
│ │ - Callsheet │ │              │ │              │ │            │
│ │ - Sign Flow │ │              │ │              │ │            │
│ └─────────────┘ └──────────────┘ └──────────────┘ └────────────┘
├─────────────────────────────────────────────────────────────────┤
│                     LAYER INTERACTION                            │
│              (modules.js - DashboardController)                  │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────────┐
│ │ Event Bindings                                               │
│ │ ├─ Navigation (module switching)                             │
│ │ ├─ Form Submission (crew, accreds, rider, etc.)            │
│ │ ├─ Item Management (add, remove, update)                    │
│ │ ├─ Drawer Toggles (lexique, settings)                       │
│ │ ├─ User Management (login, logout, display)                 │
│ │ └─ Settings Updates (theme, language, volume)               │
│ └──────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────┤
│                   LAYER STATE MANAGEMENT                        │
│                   (core.js - AIStore)                           │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────────┐
│ │ Centralized State                                            │
│ │ ├─ currentModule                                             │
│ │ ├─ user & isLoggedIn                                         │
│ │ ├─ Production Data (event, show times, artist)              │
│ │ ├─ Personnel (crewMembers[])                                │
│ │ ├─ Accreditations (accreditations[])                        │
│ │ ├─ Technical (riderSpecs)                                    │
│ │ ├─ Callsheet (event data)                                    │
│ │ └─ Documents (documents[])                                   │
│ └──────────────────────────────────────────────────────────────┘
│
│ ┌──────────────────────────────────────────────────────────────┐
│ │ Subscriber Pattern                                           │
│ │ ├─ setState() → notify() → all listeners                     │
│ │ ├─ addCrewMember() → notify()                                │
│ │ ├─ addAccreditation() → notify()                             │
│ │ └─ saveToStorage() (après chaque changement)                 │
│ └──────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────┤
│                      LAYER PERSISTENCE                          │
│                 (localStorage + future Supabase)                │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────────────────────────────────┐
│ │ localStorage │ │ Supabase (v1.1+)                         │
│ │ - aintercom_ │ │ ├─ Auth (email/password)                 │
│ │   state      │ │ ├─ events table                          │
│ │ - aintercom_ │ │ ├─ crew_members table                    │
│ │   welcomed   │ │ ├─ accreditations table                  │
│ │              │ │ ├─ rider_specs table                     │
│ │              │ │ ├─ callsheets table                      │
│ │              │ │ ├─ documents table                       │
│ │              │ │ └─ RealTime subscriptions                │
│ └──────────────┘ └──────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Flux de données

### 1. Flux création événement (Callsheet)

```
User Input (Callsheet Form)
    ↓
handleCallsheetSubmit()
    ↓
store.updateNested('callsheet', {...})
    ↓
store.setState({ eventName: ... })
    ↓
store.notify()
    ↓
DashboardController.updateEventDisplay()
    ↓
Update eventNameDisplay in header + Show Control
    ↓
saveToStorage()
```

### 2. Flux d'ajout de personnel (Crew)

```
User Input (Crew Form)
    ↓
handleCrewSubmit()
    ↓
store.addCrewMember({ name, email, role })
    ↓
store.state.crewMembers.push(newMember + id)
    ↓
store.notify()
    ↓
DashboardController.renderCrewMembers()
    ↓
Update crewItems list + crewCount metric
    ↓
saveToStorage()
```

### 3. Flux notification utilisateur

```
Any Action
    ↓
Notifier.success/error/info("message")
    ↓
Create notification DOM element
    ↓
Add to #notifications container
    ↓
Animation slideIn
    ↓
Timeout (3-4s)
    ↓
Animation slideOut → Remove
```

## 🔄 Synchronisation inter-modules

### Callsheet → Show Control

**Déclencheur** : Submit du formulaire callsheet

```javascript
// Dans modules.js - handleCallsheetSubmit
store.setState({ eventName: callsheet.event })

// Le store notify() tous les listeners
// DashboardController reçoit le changement
updateEventDisplay() {
    this.eventNameDisplay.textContent = eventName
    this.currentEventInput.value = eventName
}
```

**Résultat** : Le header affiche instantanément le nouvel événement

### Crew Count → Metrics

**Déclencheur** : addCrewMember() ou removeCrewMember()

```javascript
store.subscribe((state) => {
    updateMetrics() {
        this.crewCountDisplay.textContent = state.crewMembers.length
    }
})
```

**Résultat** : La métrique du Show Control se met à jour en temps réel

## 🔑 Clés d'état principales

### Production (Show Control)

```javascript
{
    eventName: string,          // Sync depuis Callsheet
    showStartTime: string,      // HH:MM format
    showDuration: number,       // Minutes
    showArtist: string         // Nom artiste/production
}
```

### Ressources humaines (Crew)

```javascript
{
    crewMembers: [
        {
            id: string,                    // UUID-like
            name: string,
            email: string,
            role: 'régie' | 'technique' | etc,
            createdAt: ISO string
        }
    ]
}
```

### Accès (Accréditations)

```javascript
{
    accreditations: [
        {
            id: string,
            name: string,
            type: 'all-access' | 'crew' | 'vip' | etc,
            code: string,                  // Unique code
            date: ISO string,
            status: 'active' | 'revoked',
            createdAt: ISO string
        }
    ]
}
```

### Technique (Rider)

```javascript
{
    riderSpecs: {
        audio: string,                     // Multi-line
        light: string,                     // Multi-line
        video: string                      // Multi-line
    }
}
```

### Production (Callsheet)

```javascript
{
    callsheet: {
        event: string,
        date: ISO string,
        time: HH:MM string,
        notes: string
    }
}
```

### Documents (Sign Flow)

```javascript
{
    documents: [
        {
            id: string,
            title: string,
            content: string,
            signer: string,
            status: 'pending' | 'signed',
            createdAt: ISO string
        }
    ]
}
```

## 🎯 Patterns et conventions

### 1. Naming

- **Fichiers** : `lowercase-with-dashes.js`
- **CSS Classes** : `kebab-case` pour composants
- **JS Methods** : `camelCase`
- **Constantes** : `UPPER_CASE`
- **HTML IDs** : `kebab-case`

### 2. Événements DOM

```javascript
// Cohérent pour tous les inputs
input.addEventListener('change', () => {
    store.updateSomething(input.value)
    Notifier.info('Mise à jour')
})
```

### 3. Listes et rendu

```javascript
// Pattern unifié pour toutes les listes
renderItems() {
    const items = store.state.items
    
    if (items.length === 0) {
        this.container.innerHTML = '<p class="empty-state">Aucun élément</p>'
        return
    }
    
    this.container.innerHTML = items.map(item => `
        <div class="item">
            ${item.name}
            <button onclick="app.removeItem('${item.id}')">✕</button>
        </div>
    `).join('')
}
```

## 🔐 Sécurité future (Supabase)

### Row Level Security (RLS)

```sql
-- Utilisateurs ne voient que leurs données
CREATE POLICY "Users see own events"
    ON events FOR SELECT
    USING (auth.uid() = user_id);

-- Utilisateurs peuvent créer leurs propres événements
CREATE POLICY "Users create own events"
    ON events FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```

### Authentification

```javascript
// À implémenter dans core.js
async login(email, password) {
    const { user, error } = await supabase.auth.signInWithPassword({
        email, password
    })
    if (!error) {
        store.setState({ user, isLoggedIn: true })
    }
}
```

## 📈 Performance

### Optimisations actuelles

- **Lazy rendering** : Modules non affichés n'existent pas en DOM
- **Event delegation** : Les délégués gèrent les liste dynamiques
- **localStorage** : Cache les données (pas de refresh réseau)
- **Debouncing** : Via `change` event au lieu de `input`

### À ajouter (v1.1+)

- Virtual scrolling pour listes longues
- Pagination de la callsheet/rider
- Compression des données avant sync
- Service Worker pour mode offline

## 🧪 Testing

### Cas d'usage critiques à tester

```javascript
// 1. Création événement → Affichage Show Control
callsheetFormInput → Show Control header

// 2. Ajout personnel → Métrique mise à jour
addCrewMember() → crewCount increment

// 3. LocalStorage persist → Rechargement données
localStorage → setItem/getItem

// 4. Connexion modules → Sync bidirectionnelle
Callsheet.eventName → Show Control.eventName
```

## 🚀 Roadmap

### v1.0 (Current)
- ✅ Dashboard multi-modules
- ✅ Gestion d'état centralisée
- ✅ Persistance locale
- ✅ Design technique

### v1.1
- ▭ Intégration Supabase
- ▭ Authentification utilisateur
- ▭ Sync temps réel
- ▭ Export données

### v1.2
- ▭ Multi-utilisateurs collaboratif
- ▭ Analytics/Reporting
- ▭ Webhooks notifications
- ▭ Mobile app native

### v2.0
- ▭ API publique
- ▭ Plugins système
- ▭ IA assistant (résumés, recommandations)
- ▭ Intégration tiers (Spotify, YouTube, etc)

---

**Document architecture maintenu à jour avec le code**
