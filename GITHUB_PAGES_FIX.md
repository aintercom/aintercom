# 🔧 Dépannage GitHub Pages — Routes 404 Résolues

## ✅ Solution Implémentée

### Problème
Erreur 404 lors de la redirection Supabase OAuth vers `dashboard.html` sur GitHub Pages.

**Cause:** Le chemin absolu `/dashboard.html` ne tenait pas compte du `basePath` (`/aintercom/`) sur GitHub Pages.

### Solution v2.0

#### 1️⃣ Configuration Auto-Détectée (`js/config.js`)
✅ Script lancé EN PREMIER dans tous les fichiers HTML
```javascript
window.AINTERCOM_CONFIG = {
  basePath: '/aintercom',  // Détecté automatiquement
  rootUrl: 'https://aintercom.github.io/aintercom',
  getFullUrl: (path) => { /* ... */ }
}
```

#### 2️⃣ Redirection OAuth Intelligente (`js/supabase-client.js`)
✅ Utilise `AINTERCOM_CONFIG` pour construire l'URL correcte
```javascript
// ✅ Avant: /dashboard.html (404!)
// ✅ Après: /aintercom/dashboard.html (✓ fonctionne!)
const dashboardUrl = window.AINTERCOM_CONFIG.getFullUrl('/dashboard.html');
```

#### 3️⃣ Fallback 404 Handler (`404.html`)
✅ GitHub Pages utilise ce fichier pour les routes inexistantes
- Détecte le basePath
- Redirige intelligemment
- Gère les cas personnalisés

#### 4️⃣ Ordre de Chargement (Critique!)
✅ Dans tous les HTML:
```html
<!-- DOIT être en premier! -->
<script src="js/config.js"></script>

<!-- Ensuite les autres scripts -->
<script src="js/core.js"></script>
<script src="js/modules.js"></script>
```

---

## 📋 Fichiers Modifiés

| Fichier | Changement |
|---------|-----------|
| `js/config.js` | 🆕 Nouveau - Détection auto basePath |
| `js/supabase-client.js` | ✏️ Utilise AINTERCOM_CONFIG |
| `login.html` | ✏️ Charge config.js EN PREMIER |
| `dashboard.html` | ✏️ Charge config.js EN PREMIER |
| `index.html` | ✏️ Charge config.js EN PREMIER |
| `404.html` | 🆕 Nouveau - Gestion erreurs GitHub Pages |

---

## 🔍 Vérification

### Checkpoints

1. **Config Chargée?**
   ```javascript
   // Console DevTools
   window.AINTERCOM_CONFIG
   // Doit afficher: { basePath: "/aintercom", rootUrl: "...", ... }
   ```

2. **Base Path Détecté?**
   ```javascript
   console.log(window.AINTERCOM_CONFIG.basePath)
   // Doit afficher: "/aintercom" (sur GitHub Pages)
   // Doit afficher: "" (sur domaine custom)
   ```

3. **URL Correcte?**
   ```javascript
   window.AINTERCOM_CONFIG.getFullUrl('/dashboard.html')
   // Doit afficher: "https://aintercom.github.io/aintercom/dashboard.html" ✓
   ```

---

## 🚀 Test en Production

### Avant Deploy
```bash
# Vérifier que config.js est accessible
curl https://aintercom.github.io/aintercom/js/config.js

# Vérifier que dashboard.html existe
curl https://aintercom.github.io/aintercom/dashboard.html

# Vérifier que 404.html existe
curl https://aintercom.github.io/404.html

# Vérifier que 404.html redirige (retour 404 devrait être capturé)
```

### Après Deploy
1. Aller sur https://aintercom.github.io/aintercom/login.html
2. Cliquer Google Sign-In
3. Autoriser permissions
4. URL ne devrait pas avoir d'erreur 404
5. Dashboard doit charger correctement

---

## 🎯 Cas de Redirection

### GitHub Pages (https://aintercom.github.io/aintercom/)

| URL Demandée | Résultat |
|--------------|----------|
| `/aintercom/` | Charge index.html ✓ |
| `/aintercom/login.html` | Charge login.html ✓ |
| `/aintercom/dashboard.html` | Charge dashboard.html ✓ |
| `/dashboard.html` (direct) | 404 → Redirige via 404.html ✓ |
| `/unknown.html` | 404 → Redirige via 404.html ✓ |

### Domaine Custom (https://aintercom.dev/)

| URL Demandée | Résultat |
|--------------|----------|
| `/` | Charge index.html ✓ |
| `/login.html` | Charge login.html ✓ |
| `/dashboard.html` | Charge dashboard.html ✓ |
| `/unknown.html` | 404 → Redirige vers / ✓ |

---

## 💡 Tips de Dépannage

### Si encore 404 sur dashboard.html

1. **Vérifier que le fichier existe**
   ```bash
   git ls-tree -r HEAD | grep dashboard.html
   # Doit afficher: dashboard.html
   ```

2. **Vérifier le cache GitHub Pages**
   ```bash
   # Attendre 2-5 min après git push
   # Ou forcer refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
   ```

3. **Vérifier console DevTools**
   ```
   F12 → Console → Voir les erreurs
   ```

4. **Vérifier config.js chargé**
   ```javascript
   // Console
   window.AINTERCOM_CONFIG
   // Si undefined = config.js pas chargé correctement
   ```

### Si redirectTo encore incorrect

1. **Vérifier que supabase-client.js utilise config.js**
   ```javascript
   // Console - après OAuth
   window.AINTERCOM_CONFIG.getFullUrl('/dashboard.html')
   ```

2. **Vérifier Supabase configuration**
   - Aller à: Supabase → Auth → URL Configuration
   - Ajouter: `https://aintercom.github.io/aintercom/`
   - Ajouter: `https://aintercom.github.io/aintercom/dashboard.html`

---

## 🎬 Configuration GitHub Pages

### Vérifier Settings
1. Settings → Pages
2. Build and deployment
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
3. Custom domain (si applicable)

### Fichiers MUST-HAVE
- ✅ `404.html` - Gestion erreurs
- ✅ `_config.yml` - Configuration Jekyll (optionnel)
- ✅ `.nojekyll` - Désactiver Jekyll (recommandé)

### Créer `.nojekyll`
```bash
# Pour désactiver Jekyll et servir les fichiers statiques directement
touch .nojekyll
git add .nojekyll
git commit -m "Disable Jekyll for GitHub Pages"
git push
```

---

## 📊 Avant/Après

### ❌ Avant (Problème)
```
User clique Google
  ↓
OAuth demande: redirectTo = https://aintercom.github.io/dashboard.html
  ↓
GitHub Pages cherche: /dashboard.html (au root!)
  ↓
❌ Erreur 404 - pas trouvé
```

### ✅ Après (Résolu)
```
User clique Google
  ↓
config.js détecte: basePath = "/aintercom"
  ↓
OAuth demande: redirectTo = https://aintercom.github.io/aintercom/dashboard.html
  ↓
GitHub Pages cherche: /aintercom/dashboard.html (✓ correct!)
  ↓
✅ Dashboard charge correctement
```

---

## 🔗 Ressources

- [GitHub Pages Docs](https://pages.github.com/)
- [GitHub Pages Troubleshooting](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-custom-domains)
- [Supabase OAuth](https://supabase.com/docs/guides/auth/social-login)

---

**Status:** ✅ Fixed in v2.0.1  
**Last Updated:** 2026-03-29  
**Test:** ✓ Ready to deploy
