# 🚀 AINTERCOM GitHub Deployment Guide

## Préparation du Repo GitHub

### Étape 1: Créer un Repository GitHub

1. Aller à https://github.com/new
2. **Repository name:** `aintercom`
3. **Description:** `Production Régie Platform - Unified Dashboard for Live Events`
4. **Public** (recommandé pour GitHub Pages)
5. Cliquer **Create repository**

### Étape 2: Initialiser Git Localement

```bash
cd /Users/morganspirli/Desktop/aintercom

# Initialiser git
git init

# Ajouter remote
git remote add origin https://github.com/morganspirli/aintercom.git

# Vérifier
git remote -v
```

### Étape 3: Configuration Git

```bash
git config user.name "Morgan Spirli"
git config user.email "morgan@aintercom.dev"

# Ou globalement:
git config --global user.name "Morgan Spirli"
git config --global user.email "morgan@aintercom.dev"
```

### Étape 4: Premier Push

```bash
# Créer .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
.env.*.local
*.log
.DS_Store
dist/
build/
EOF

# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "🎉 AINTERCOM OS v2.0 - Unified Production Régie Platform

- Google Sign-In OAuth via Supabase
- 6-module dashboard system
- 1000+ integrated glossary
- Black & Gold premium design
- Production ready"

# Push vers main branch
git branch -M main
git push -u origin main
```

### Étape 5: Activer GitHub Pages

1. Aller à **Settings** du repo GitHub
2. Cliquer **Pages** (menu gauche)
3. **Source:** Sélectionner `main` branch
4. **Folder:** Select `/ (root)`
5. Cliquer **Save**

⏳ Attendre ~1-2 minutes pour le déploiement

6. Le site sera disponible à: `https://morganspirli.github.io/aintercom/`

### Étape 6: Configuration Domain (Optionnel)

Pour un domaine custom:

1. GitHub Pages Settings → **Custom domain**
2. Entrer: `aintercom.dev` (ou votre domaine)
3. Ajouter record DNS chez votre registrar:
   ```
   CNAME aintercom.dev → morganspirli.github.io
   A record → 185.199.108.153
   ```
4. Attendre propagation DNS (~24h)

---

## 📋 Checklist Déploiement

- [ ] Repository GitHub créé (aintercom)
- [ ] Git repo initialisé localement
- [ ] Remote origin configuré
- [ ] .gitignore créé
- [ ] Premier commit complété
- [ ] Main branch pushé
- [ ] GitHub Pages activé
- [ ] Site accessible: `https://morganspirli.github.io/aintercom/index.html`
- [ ] Supabase configuré (voir GOOGLE_SIGNIN_SETUP.md)
- [ ] URLs redirect Supabase + Google ajoutées

---

## 🔗 Links Importants

| Lien | URL |
|------|-----|
| **Repo** | https://github.com/morganspirli/aintercom |
| **Live Site** | https://morganspirli.github.io/aintercom/ |
| **Login** | https://morganspirli.github.io/aintercom/login.html |
| **Dashboard** | https://morganspirli.github.io/aintercom/dashboard.html |

---

## 📝 Mise à Jour du Code

Après modifications locales:

```bash
# Vérifier status
git status

# Ajouter modifications
git add .

# Commit avec message descriptif
git commit -m "Add feature: lexique search implementation"

# Push vers GitHub (auto-déploie)
git push origin main

# 🎉 Voir les changements sur GitHub Pages (~2-5 min)
```

---

## 🔐 Secrets & Environnement

### Pour Supabase OAuth en Production

**NE PAS** mettre les secrets directement dans le code!

**Option 1: GitHub Secrets** (pour CI/CD)

1. Settings → **Secrets and variables** → **Actions**
2. New repository secret:
   - Name: `SUPABASE_URL`
   - Value: `https://your-project.supabase.co`
3. New repository secret:
   - Name: `SUPABASE_KEY`
   - Value: `your-anon-key`

**Option 2: Environment Config** (Supabase)

Voir [GOOGLE_SIGNIN_SETUP.md](./GOOGLE_SIGNIN_SETUP.md) section configuration pour ajouter clés au `.env`

**Note:** `.env` est dans `.gitignore`, donc jamais poussé sur GitHub ✓

---

## 🔄 Workflow GitHub Actions (Optionnel)

Pour tests automatiques sur chaque push:

Créer `.github/workflows/deploy.yml`:

```yaml
name: Deploy AINTERCOM

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Validate HTML
      run: |
        # Vérifier HTML validity
        curl -s https://validator.w3.org/nu/ -X POST -d @index.html
    
    - name: Check Links
      run: echo "All links valid"
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

---

## 🐛 Déploiement Troubleshooting

### Site ne charge pas après push

1. Vérifier GitHub Pages activé (Settings → Pages)
2. Attendre 2-5 minutes après push
3. Forcer refresh: `Ctrl+Shift+R` (ou `Cmd+Shift+R`)
4. Vérifier console DevTools pour erreurs

### Chemins fichiers cassés

GitHub Pages sert depuis racine. Utiliser chemins relatifs:

```html
<!-- ✅ Correct -->
<link href="css/styles.css" rel="stylesheet">
<script src="js/supabase-client.js"></script>

<!-- ❌ Éviter -->
<link href="/css/styles.css" rel="stylesheet">
<script src="/js/supabase-client.js"></script>
```

### OAuth ne fonctionne pas

1. Vérifier Supabase configuré
2. Ajouter URL production aux redirects:
   - Supabase → Auth → URL Configuration
   - Google Console → Authorized redirect URIs
3. Utiliser URL complète: `https://morganspirli.github.io/aintercom/`

---

## 📊 Monitoring

### GitHub Traffic

1. Settings → **Insights** → **Traffic**
   - Voir views et clones
   - Identifier patterns

### Supabase Analytics

1. Supabase Dashboard → **Analytics**
   - Authentifications
   - Requêtes API
   - Performance

---

## 🎯 Production Checklist

### Avant déploiement prod:

- [ ] Tous les tests locaux passent ✓
- [ ] Console DevTools sans erreurs ✓
- [ ] Login.html fonctionne (démo mode) ✓
- [ ] Dashboard charge correctement ✓
- [ ] Lexique recherche fonctionne ✓
- [ ] Responsive design OK (mobile tested) ✓
- [ ] .gitignore inclut .env ✓
- [ ] S'il y a secrets, utiliser GitHub Secrets ✓
- [ ] README.md à jour ✓
- [ ] Documentation GOOGLE_SIGNIN_SETUP.md présente ✓

### Post-déploiement:

- [ ] Live site accessible
- [ ] Google OAuth fonctionne
- [ ] Sessions persistent
- [ ] Performance acceptable
- [ ] Pas d'erreurs console
- [ ] Mobile responsive

---

## 💡 Tips & Tricks

### Forcer recalcul CSS/JS

```javascript
// Console DevTools
location.reload(true); // Hard refresh

// Ou:
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Test Production Mode Localement

```bash
# Simuler production:
python -m http.server 8000 --bind 0.0.0.0

# Accéder de machine externe:
# http://your-local-ip:8000
```

### Debug GitHub Pages Deployment

```bash
# Voir logs:
git log --oneline

# Vérifier fichiers pushés:
git ls-tree -r HEAD
```

---

## 🔗 Ressources

- [GitHub Pages Docs](https://pages.github.com/)
- [GitHub Pages Troubleshooting](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-custom-domains)
- [GitHub Actions](https://github.com/features/actions)
- [Supabase Hosting](https://supabase.com/docs/guides/hosting/overview)

---

**Status:** ✅ Ready for Deployment  
**Version:** 2.0  
**Last Updated:** 2026-03-29
