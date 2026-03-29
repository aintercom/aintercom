# AINTERCOM OS — Guide de connexion inter-modules

## 📡 Système de communication

AINTERCOM OS utilise un **pattern Observer** pour synchroniser les modules. Quand une donnée change dans un module, les autres modules se mettent à jour automatiquement.

```
Store (État central)
    ├─ notify() → tous les listeners
    └─ updateDisplay() dans DashboardController
        ├─ Show Control (metrics)
        ├─ Crew/Staff (personnel counts)
        ├─ Accréditations (counts)
        ├─ Rider (spécifications)
        ├─ Callsheet (events)
        └─ Sign Flow (documents)
```

## 🔗 Connexions principales

### 1️⃣ Callsheet → Show Control (PRIORITAIRE)

**Objectif** : Le nom d'événement saisi dans Callsheet apparaît en haut du Show Control

#### Implementation

```javascript
// Dans modules.js - handleCallsheetSubmit
handleCallsheetSubmit(e) {
    e.preventDefault()

    const callsheet = {
        event: this.callsheetEvent.value,    // ← Le nom
        date: this.callsheetDate.value,
        time: this.callsheetTime.value,
        notes: this.callsheetNotes.value
    }

    // Mise à jour du state
    store.updateNested('callsheet', callsheet)
    
    // 🔑 CLEF : Synchroniser le nom d'événement
    store.setState({ eventName: callsheet.event })
    
    this.renderCallsheet()
    this.updateEventDisplay()  // ← Redessine le header
    this.updateMetrics()
}
```

#### Déclenchement

```javascript
// Dans core.js - AIStore
setEvent(eventName) {
    this.setState({
        eventName,
        'callsheet.event': eventName
    })
}
```

#### Affichage

```javascript
// Dans le header (dashboard.html)
<div class="event-info">
    <span class="event-label">Événement:</span>
    <span id="event-name" class="event-name">—</span>  ← Mis à jour ici
</div>
```

**Flux complet** :
```
Callsheet Form Submit
    ↓ handleCallsheetSubmit()
    ↓ store.setState({ eventName: ... })
    ↓ store.notify()
    ↓ DashboardController.updateEventDisplay()
    ↓ #event-name.textContent = eventName
    ✓ Apparaît en haut du dashboard
```

---

### 2️⃣ Crew → Show Control (Metrics)

**Objectif** : Le nombre de personnel s'affiche en temps réel dans les métriques

#### Implementation

```javascript
// Dans modules.js
handleCrewSubmit(e) {
    e.preventDefault()
    
    const member = {
        name: this.crewName.value,
        email: this.crewEmail.value,
        role: this.crewRole.value
    }

    // addCrewMember() + notify()
    store.addCrewMember(member)
    
    // Les listeners reçoivent le changement
    this.renderCrewMembers()
    // ↓ Appelle automatiquement updateMetrics()
}
```

#### Dans core.js - AIStore

```javascript
addCrewMember(member) {
    const newMember = {
        id: Date.now().toString(),
        ...member,
        createdAt: new Date().toISOString()
    }
    
    this.state.crewMembers.push(newMember)
    
    // 🔑 CLEF : Notifier tous les listeners
    this.notify()
    
    return newMember
}
```

#### Mise à jour métrique

```javascript
// Dans modules.js - DashboardController
updateMetrics() {
    this.crewCountDisplay.textContent = store.state.crewMembers.length
    this.accredCountDisplay.textContent = store.state.accreditations.length
    this.signCountDisplay.textContent = store.state.documents
        .filter(d => d.status === 'pending').length
}
```

**Flux complet** :
```
Crew Form Submit
    ↓ addCrewMember()
    ↓ store.notify()
    ↓ updateMetrics()
    ↓ #crew-count.textContent = length
    ✓ Métrique Show Control mise à jour
```

---

### 3️⃣ Accréditations ↔ Show Control (Bidirectionnel)

**Objectif** : Synchronisation bidirectionnelle des accréditations

#### Flux A : Générer une accréditation

```javascript
// modules.js
handleAccredSubmit(e) {
    e.preventDefault()

    const accred = {
        name: this.accredName.value,
        type: this.accredType.value,
        date: this.accredDate.value,
        code: Utils.generateCode('ACC')  // Code unique
    }

    store.addAccreditation(accred)  // → notify()
    
    this.renderAccreditations()
    // → updateMetrics() (automatique via subscribe)
}
```

#### Flux B : Voir le statut dans Show Control

```javascript
// Dans updateMetrics()
this.accredCountDisplay.textContent = store.state.accreditations.length
// Affiche le nombre total d'accréditations
```

---

### 4️⃣ Rider Technique (État partagé)

**Objectif** : Les spécifications restent disponibles pour tous les modules

#### Implementation

```javascript
// modules.js
handleRiderSubmit(e) {
    e.preventDefault()

    // updateNested permet de modifier un sous-objet
    store.updateNested('riderSpecs', {
        audio: this.riderAudio.value,
        light: this.riderLight.value,
        video: this.riderVideo.value
    })

    this.renderRider()
    // Le state est persisté → accessible depuis n'importe où
}
```

#### Accès depuis d'autres modules

```javascript
// N'importe quel module peut accéder
const rider = store.state.riderSpecs
console.log(rider.audio)  // Affiche les spécifications
```

---

### 5️⃣ Sign Flow → Show Control (Documents)

**Objectif** : Les documents pending s'affichent comme métrique

#### Implementation

```javascript
// modules.js
handleSignSubmit(e) {
    e.preventDefault()

    const doc = {
        title: this.signTitle.value,
        content: this.signContent.value,
        signer: this.signSigner.value
    }

    store.addDocument(doc)  // → notify()
    this.renderDocuments()
}
```

#### Métrique documents

```javascript
// updateMetrics()
this.signCountDisplay.textContent = store.state.documents
    .filter(d => d.status === 'pending').length
    // Affiche les documents EN ATTENTE seulement
```

---

## 🎪 Pattern Subscribe (Surveillance d'état)

### Inscription au store

```javascript
// Dans DashboardController.subscribeToStore()
store.subscribe((state) => {
    // Cette fonction s'appelle CHAQUE FOIS que l'état change
    this.updateDisplay()
    this.updateMetrics()
})
```

### Implémentation dans AIStore

```javascript
// core.js
class AIStore {
    constructor() {
        this.listeners = []
    }

    subscribe(callback) {
        this.listeners.push(callback)
        // Retourne un unsubscribe si nécessaire
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback)
        }
    }

    notify() {
        // Appelle TOUS les listeners
        this.listeners.forEach(listener => listener(this.state))
        // Puis sauvegarde
        this.saveToStorage()
    }
}
```

---

## 🔄 Persistence (localStorage)

### Sauvegarde automatique

```javascript
// Chaque notify() sauvegarde
notify() {
    this.listeners.forEach(listener => listener(this.state))
    this.saveToStorage()  // ← Automatique
}

saveToStorage() {
    localStorage.setItem('aintercom_state', JSON.stringify(this.state))
}
```

### Restauration au démarrage

```javascript
// core.js
loadFromStorage() {
    const saved = localStorage.getItem('aintercom_state')
    if (saved) {
        this.state = { ...this.state, ...JSON.parse(saved) }
    }
}

// Et dans le constructeur
constructor() {
    this.state = { /* initial state */ }
    this.loadFromStorage()  // Restaure immédiatement
}
```

---

## 📱 Exemple pas à pas

### Scénario complet

**Tom crée un événement "Concert 2026" dans Callsheet**

```
1. Tom accède à l'onglet Callsheet
            ↓
2. Tom remplit le formulaire
   - Événement: "Concert 2026"
   - Date: 2026-04-15
   - Heure: 20:00
            ↓
3. Tom clique "Créer callsheet"
            ↓
4. JavaScript: handleCallsheetSubmit(e)
            ↓
5. store.setState({ eventName: "Concert 2026" })
            ↓
6. store.notify()
            ↓
7. updateDisplay() s'appelle
   - Redessine Callsheet
   - Appelle updateEventDisplay()
            ↓
8. #event-name.textContent = "Concert 2026"
            ↓
9. localStorage.setItem('aintercom_state', {...})
            ↓
10. Tom voit au top du dashboard:
    "Événement: Concert 2026"
            ↓
11. Tom bascule sur "Show Control"
            ↓
12. Tom voit l'événement affiché automatiquement
```

---

## 🧬 Structure d'ajout de connexion

### Pour ajouter une nouvelle synchronisation

1. **Identifier la source et la cible**
   ```
   Source: Module X (ex: Rider) → Cible: Module Y (ex: Show Control)
   ```

2. **Identifier le déclencheur**
   ```javascript
   // Quand le formulaire X est soumis
   handleXSubmit() {
       // Mettre à jour le state pertinent
       store.setState({ key: value })
       // Au lieu de setState, utiliser updateNested si c'est un objet
       // store.updateNested('path.to.object', { ...updates })
   }
   ```

3. **Implémenter la réaction dans updateDisplay/updateMetrics**
   ```javascript
   updateDisplay() {
       // Y se met à jour automatiquement via la subscription
       this.renderY()
   }
   ```

4. **Tester le flux**
   ```
   Edit Source Form → Check localStorage → Reload → Verify data persists
   ```

---

## ⚡ Quick reference

### Ajouter une donnée partagée

```javascript
// 1. Déclarer dans le state initial (core.js)
this.state = {
    mySharedData: 'initial value'
}

// 2. Mettre à jour depuis un module
store.setState({ mySharedData: 'new value' })

// 3. Utiliser dans un autre module
const value = store.state.mySharedData
```

### Ajouter une liste partagée

```javascript
// 1. Déclarer
this.state = {
    myItems: []
}

// 2. Ajouter un item
store.state.myItems.push(newItem)
store.notify()  // Important : notifier manuellement

// 3. Supprimer
store.state.myItems = store.state.myItems.filter(i => i.id !== id)
store.notify()
```

### Ajouter une notification

```javascript
// N'importe où dans le code
Notifier.success('Succès!')
Notifier.error('Erreur!')
Notifier.info('Information')
```

---

## 🔮 Préparation Supabase

Les mêmes patterns s'appliqueront avec Supabase :

```javascript
// Au lieu de setState, utiliser une fonction async
async syncToSupabase() {
    const { error } = await supabase
        .from('events')
        .insert([{ ...store.state.event }])
    
    if (!error) {
        store.notify()  // Sync locale
    }
}
```

Les listeners continueront de fonctionner exactement de la même façon.

---

**Guide complet des connexions inter-modules | v1.0**
