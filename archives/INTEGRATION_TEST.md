# 🧪 AINTERCOM Google Sign-In Integration Test

## ✅ Status: Prêt à Tester

Tous les fichiers sont en place pour tester Google Sign-In:

```
✅ login.html          - Créé avec bouton Google + formulaire email
✅ supabase-client.js  - OAuth client + mode démo
✅ GOOGLE_SIGNIN_SETUP.md - Guide configuration complète
✅ GITHUB_DEPLOYMENT.md  - Guide déploiement
✅ README.md v2.0      - Documentation mise à jour
```

---

## 🚀 Démarrage Immédiat (Mode DÉMO)

### Test 1: Login avec Email Démo

```bash
# 1. Démarrer serveur local
cd /Users/morganspirli/Desktop/aintercom
python -m http.server 8000

# 2. Ouvrir navigateur
http://localhost:8000/login.html

# 3. Entrer credentials:
Email: demo@aintercom.com
Password: demo123

# 4. Cliquer "ENTRER EN RÉGIE"
# ✓ Redirection vers dashboard
```

**Résultat attendu:**
- Session créée dans localStorage
- Redirection automatique à dashboard.html
- Message success: "✓ Connexion réussie! Redirection..."

### Test 2: Google Sign-In (Démo Mode)

```
1. Cliquer bouton "Google" dans login.html
2. Message: "Redirection vers Google..."
3. Redirection auto vers dashboard (mode démo)
4. Console: "✅ Mode DÉMO - Connexion réussie"
```

**Pourquoi démo?** Supabase n'est pas encore configuré. Voir section ci-dessous pour activer mode production.

### Test 3: Session Persistence

```javascript
// Console DevTools (F12):
getSession()
// Retourne: { id, email, name, timestamp }

localStorage.getItem('aintercom_session')
// Retourne: JSON session data

// Recharger page (F5)
getSession()
// Session toujours présente ✓
```

### Test 4: Logout

```javascript
// Console:
signOut()
// ✓ Session supprimée
// localStorage.aintercom_session vide

// Retour à login.html
window.location = 'login.html'
```

---

## 🔵 Configuration Production: Supabase OAuth

### Étape 1: Créer Supabase Project (5 min)

1. https://supabase.com → Sign up
2. Create new Project
   - Name: `aintercom`
   - Region: Closest to you
3. Copier:
   - **Project URL** (ex: `https://xyzabc.supabase.co`)
   - **anon public key** (Settings → API)

### Étape 2: Configurer Google OAuth (10 min)

1. https://console.cloud.google.com → New Project
2. Credentials → Create OAuth 2.0 Client ID
   - Type: Web application
3. Add Authorized redirect URIs:
   ```
   http://localhost:8000
   https://xyzabc.supabase.co/auth/v1/callback
   https://morganspirli.github.io/aintercom/ (si déployé)
   ```
4. Copier **Client ID** et **Client Secret**

### Étape 3: Configurer Supabase Google Provider (5 min)

1. Supabase Dashboard → Authentication
2. Providers → Google
3. Enable: ON
4. Client ID: `[Google Client ID]`
5. Client Secret: `[Google Client Secret]`
6. Save

### Étape 4: Ajouter Clés à AINTERCOM (2 min)

**Option A: Fichier .env (recommandé)**

```bash
# Créer à la racine /aintercom/.env
VITE_SUPABASE_URL=https://xyzabc.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key
```

**Option B: Fichier config (développement)**

```bash
# Éditer js/supabase-client.js (lignes 9-12)
const SUPABASE_CONFIG = {
  url: 'https://xyzabc.supabase.co',
  key: 'your-anon-public-key'
};
```

**Option C: localStorage temporaire (test)**

```javascript
// Console DevTools:
localStorage.setItem('supabase_url', 'https://xyzabc.supabase.co');
localStorage.setItem('supabase_key', 'your-anon-public-key');
location.reload();
```

### Étape 5: Tester

Actualiser `login.html` et:

1. Vérifier hint affiche "✅ Google Sign-In activé"
2. Cliquer Google button
3. Redirection vers authentification Google
4. Accepter permissions
5. Auto-redirection dashboard
6. ✓ Session Supabase active

---

## 🧬 Architecture Authentification

```
┌─────────────────────────────────────┐
│      login.html                     │
│  [Google] | [Email/Password] Form   │
└────────────┬────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│   supabase-client.js                │
│  ─────────────────────────────────  │
│  signInWithGoogle()                 │
│  signInWithEmail(email, password)   │
│  saveSession(user)                  │
│  getSession()                       │
│  signOut()                          │
└────────────┬────────────────────────┘
             │
      ┌──────┴──────┐
      ↓             ↓
  [DÉMO]      [SUPABASE]
   Mode        Auth
  Local        OAuth
             Database
      └──────┬──────┘
             ↓
┌─────────────────────────────────────┐
│   localStorage                      │
│  aintercom_session (durée: 24h)     │
└─────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────┐
│   dashboard.html                    │
│  AIStore.setState({user_session})   │
└─────────────────────────────────────┘
```

---

## 📊 Fichiers modifiés

### login.html
- ✅ Ajout CSS: `.btn-google`, `.oauth-section`, `.divider`
- ✅ Ajout HTML: Google button avec SVG logo
- ✅ Ajout JS: `signInWithGoogle()` handler
- ✅ Ajout imports: Supabase CDN + supabase-client.js

### Nouveaux fichiers créés

1. **js/supabase-client.js** (200+ lines)
   - OAuth client init
   - signInWithGoogle()
   - signInWithEmail()
   - Session management
   - Demo mode fallback

2. **GOOGLE_SIGNIN_SETUP.md** (170+ lines)
   - Configuration Supabase step-by-step
   - Google OAuth setup
   - Environment variables
   - Troubleshooting

3. **GITHUB_DEPLOYMENT.md** (150+ lines)
   - GitHub repo setup
   - GitHub Pages activation
   - CI/CD workflow
   - Deployment checklist

4. **README.md** (Complet)
   - Architecture v2.0
   - Quick start
   - Full documentation

---

## 🔍 Vérification Console

### Au chargement login.html

```
Console output:
🎙️ AINTERCOM LOGIN v2.0
Email démo: demo@aintercom.com | regie@test.com
Password: demo123
Google Sign-In: Utiliser supabase-client.js pour Supabase OAuth

✅ Status:
- Mode DÉMO (Supabase non configuré)
- ou
- ✅ Google Sign-In activé (si Supabase configuré)
```

### Au cliquer Google

```
✓ Mode DÉMO - Connexion Google réussie! Redirection...
ou
✓ Connexion Google réussie! Redirection...
```

### Au entrer Dashboard

```
Session restaurée: demo@aintercom.com
AIStore initialized
6 modules loaded
Lexique data loaded
```

---

## 🐛 Debug Mode

### Activer Logs Détaillés

```javascript
// Console DevTools:

// 1. Voir session complète
JSON.parse(localStorage.getItem('aintercom_session'))

// 2. Voir état AIStore
window.AIStore.getState()

// 3. Tester signIn manual
await signInWithEmail('demo@aintercom.com', 'demo123')

// 4. Vérifier Supabase client
window.supabaseClient
// undefined = pas chargé
// {instance} = chargé

// 5. Voir tous localStorage
Object.entries(localStorage).forEach(([k, v]) => console.log(k, ':', v))
```

---

## ✅ Test Checklist

### Mode DÉMO (Maintenant)

- [ ] login.html charge correctement
- [ ] Voir bouton Google
- [ ] Email/Password form fonctionne
- [ ] Credentials démo acceptés: demo@aintercom.com / demo123
- [ ] Session créée dans localStorage
- [ ] Auto-redirection vers dashboard
- [ ] Dashboard affiche user email
- [ ] Reload page → session persiste
- [ ] Logout bouton supprime session

### Mode Production (Après Supabase setup)

- [ ] Supabase project créé
- [ ] Google OAuth configuré
- [ ] Client ID/Secret ajoutés
- [ ] Clés Supabase aux variables env
- [ ] Google button affiche "✅ Google Sign-In activé"
- [ ] Clicker Google → Redirection Google
- [ ] Accepter permissions → Dashboard
- [ ] Session Supabase active (getSession())
- [ ] User profile dans Supabase database
- [ ] Logout → Session effacée

---

## 📋 Next Steps

### Immédiat
1. ✅ Tester mode DÉMO (5 min)
2. ✅ Vérifier console logs (2 min)
3. ⏳ Créer Supabase account (5 min)

### Aujourd'hui
4. ⏳ Configurer Google OAuth (15 min)
5. ⏳ Tester mode production (10 min)
6. ⏳ Déployer GitHub (5 min)

### Demain
7. ⏳ Monitor Supabase analytics
8. ⏳ Test production env
9. ⏳ Ajouter users réels

---

## 🔗 Links

- [Supabase Console](https://app.supabase.com)
- [Google Cloud Console](https://console.cloud.google.com)
- [AINTERCOM Local](http://localhost:8000)
- [GitHub Repo](https://github.com/morganspirli/aintercom)

---

**Status:** ✅ Ready for Testing  
**Test Time:** 5-10 min pour démo  
**Production Setup:** 15-20 min  
**Total:** ~30 min pour production complete
