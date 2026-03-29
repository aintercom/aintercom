# 🔐 AINTERCOM — Google Sign-In Setup Guide

## Aperçu

**AINTERCOM v2.0** intègre **Google Sign-In via Supabase OAuth**. Cette implémentation offre:

- ✅ Authentification sécurisée par Google
- ✅ Sessions persistantes (localStorage)
- ✅ Fallback demo mode (sans Supabase)
- ✅ Stockage d'utilisateur dans Supabase
- ✅ Gestion de session unifiée

---

## 1️⃣ Prérequis

### Créer un compte Supabase

1. Aller à https://supabase.com
2. Cliquer "Sign in" → "Sign up"
3. Créer un compte (Google, GitHub, Email)
4. Créer une nouveau **Project** (nom: `aintercom`)

### Google OAuth Configuration

1. Aller à https://console.cloud.google.com
2. Créer un **New Project** (nom: `aintercom-google`)
3. Aller à **Credentials** (menu gauche)
4. Cliquer **Create Credentials** → **OAuth 2.0 Client ID**
5. Chose **Web application**
6. Ajouter URL autorisées:
   ```
   http://localhost:3000
   http://localhost:8000
   https://your-domain.com (your production domain)
   https://[YOUR_PROJECT].supabase.co/auth/v1/callback
   ```
7. Copier **Client ID** et **Client Secret**

---

## 2️⃣ Configuration Supabase

### Configurer Google OAuth dans Supabase

1. Aller à Supabase Dashboard → Project → **Authentication**
2. Cliquer **Providers** (menu gauche)
3. Trouver **Google** → Cliquer
4. Toggle **Enable Google** ON
5. Coller:
   - **Client ID**: (depuis Google Console)
   - **Client Secret**: (depuis Google Console)
6. Cliquer **Save**

### Configurer URLs de redirection

1. Aller à **URL Configuration** dans Supabase Auth
2. Ajouter **Redirect URLs**:
   ```
   http://localhost:3000
   http://localhost:8000
   https://your-domain.com/dashboard.html
   https://your-domain.com/
   ```
3. Sauvegarder

### Database Setup

Supabase crée automatiquement la table `auth.users`. AINTERCOM crée une table `profiles`:

```sql
-- Supabase SQL Editor
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'operator',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

---

## 3️⃣ Configurer AINTERCOM

### Récupérer Clés d'API

1. Aller à Supabase Dashboard → **Settings** → **API**
2. Copier:
   - **Project URL** (ex: `https://[YOUR_PROJECT].supabase.co`)
   - **anon public key** (clé "publique")

### Ajouter Configuration à AINTERCOM

#### Option A: Variables d'environnement (recommandé)

Créer `.env` à la racine:

```env
VITE_SUPABASE_URL=https://[YOUR_PROJECT].supabase.co
VITE_SUPABASE_anon_KEY=your-anon-public-key
```

#### Option B: Configuration directe (développement)

Ouvrir `js/supabase-client.js` et modifier:

```javascript
const SUPABASE_CONFIG = {
  url: 'https://[YOUR_PROJECT].supabase.co',
  key: 'your-anon-public-key'
};
```

#### Option C: localStorage (pour test)

Ouvrir DevTools Console et exécuter:

```javascript
localStorage.setItem('supabase_url', 'https://[YOUR_PROJECT].supabase.co');
localStorage.setItem('supabase_key', 'your-anon-public-key');
```

### Charger SDK Supabase

login.html charge déjà Supabase via CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

---

## 4️⃣ Test Google Sign-In

### Mode Démo (sans Supabase)

1. Ouvrir `login.html`
2. Cliquer **Google** → Redirection à dashboard (demo mode)
3. Essayer aussi Email/Password:
   - Email: `demo@aintercom.com`
   - Password: `demo123`

**Note:** Mode démo fonctionne sans configuration Supabase.

### Mode Production (avec Supabase)

1. Configurer Supabase (sections 1-3)
2. Ouvrir `login.html`
3. Cliquer **Google** → Redirection Google OAuth → Dashboard
4. Session sauvegardée dans localStorage ET Supabase

### Vérifier Configuration dans Console

```javascript
// DevTools Console
console.log(localStorage.getItem('supabase_url'));
console.log(getSession()); // Voir session actuelle
```

---

## 5️⃣ Intégration Dashboard

### AIStore Session Management

`dashboard.html` utilise **AIStore** pour gérer sessions:

```javascript
// AIStore état actuel
AIStore.getState().user_session;

// Écouter changements de session
AIStore.subscribe((state) => {
  console.log('Authenticated:', state.authenticated);
  console.log('User:', state.user_session);
});
```

### Logique de Vérification

Dashboard vérifie automatiquement:
1. Session localStorage valide
2. Redirection vers login si session expirée
3. Restauration session Supabase si disponible

---

## 6️⃣ Déploiement GitHub Pages

### Configuration GitHub

1. Pousser code vers GitHub
2. Settings → **Pages**
3. Source: `main` branch
4. Custom domain (optionnel)

### Mise à Jour URLs

Ajouter URL production à:
1. Google Console → Authorized redirect URIs
2. Supabase → Auth → URL Configuration
3. `.env` ou `supabase-client.js`

---

## 7️⃣ Dépannage

### Erreur: "Supabase SDK non chargée"

```
⚠️ Mode DÉMO activé
```

**Solution:**
- Vérifier CDN Supabase disponible
- Utiliser mode demo pendant configuration

### Erreur: "Google Sign-In failed"

1. Vérifier Client ID/Secret corrects
2. Vérifier URLs redirect dans Google Console
3. Vérifier Supabase Google provider activé
4. Ouvrir Console (DevTools) voir erreur exact

### Session ne persiste pas

```javascript
// Debug console
getSession() // null = pas de session
getAllToLocalStorage() // voir ce qui est sauvegardé
```

**Solutions:**
- localStorage bloqué? Test: `localStorage.setItem('test', '1')`
- Session expirée? Vérifier timestamp (24h expiration)

### Déconnexion ne fonctionne pas

Vérifier bouton logout dans dashboard:

```html
<!-- dashboard.html footer -->
<button id="btn-logout" onclick="signOut(); window.location='login.html';">
  Déconnexion
</button>
```

---

## 📋 Checklist Configuration

- [ ] Compte Supabase créé
- [ ] Google OAuth Project créé
- [ ] Client ID & Secret copiés
- [ ] URLs redirect Google ajoutées
- [ ] Google Provider activé dans Supabase
- [ ] Project URL & anon key copiés
- [ ] Configuration AINTERCOM mise à jour
- [ ] Test démo mode ✓
- [ ] Test Google Sign-In ✓
- [ ] Session persiste après reload ✓
- [ ] Déconnexion fonctionne ✓
- [ ] Dashboard affiche email utilisateur ✓

---

## 🔗 Ressources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Google Auth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [AINTERCOM Repo](https://github.com/morganspirli/aintercom)

---

## Support

Pour questions/problèmes:
1. Vérifier console (DevTools F12)
2. Vérifier `SUPABASE_SETUP.md` pour infrastructure
3. Check `supabase-client.js` pour logique auth

**Version:** 2.0  
**Dernière mise à jour:** 2026-03-29  
**Status:** ✅ Production Ready
