# AINTERCOM OS — Quick Start Guide

## ⚡ Démarrage en 5 minutes

### Étape 1 : Accéder au dashboard

```bash
# Option 1: Python
cd /Users/morganspirli/Desktop/aintercom
python -m http.server 8000

# Option 2: Node.js
npx http-server

# Puis ouvrir
http://localhost:8000/dashboard.html
```

### Étape 2 : Créer votre premier événement

1. Cliquez sur **Callsheet** (📋) dans la sidebar
2. Remplissez le formulaire :
   - **Nom**: "Mon Super Concert"
   - **Date**: Demain
   - **Heure**: 20:00
   - **Notes**: Quelques notes optionnelles
3. Cliquez **"Créer callsheet"**
4. ✅ Regardez le nom s'afficher en haut du dashboard !

### Étape 3 : Ajouter du personnel

1. Cliquez sur **Crew/Staff** (👥)
2. Remplissez :
   - **Nom**: "Alice Martin"
   - **Email**: alice@example.com
   - **Rôle**: Régie
3. Cliquez **"Ajouter au crew"**
4. ✅ Regardez la métrique "Personnes présentes" s'incrémenter

### Étape 4 : Générer une accréditation

1. Cliquez sur **Accréditations** (🎫)
2. Remplissez :
   - **Nom**: "Alice Martin"
   - **Type**: All Access
   - **Date**: Aujourd'hui
3. Cliquez **"Générer badge"**
4. ✅ Un code unique est généré automatiquement

### Étape 5 : Consigner le rider technique

1. Cliquez sur **Rider Technique** (🎚️)
2. Remplissez LE MOINS un domaine :
   ```
   🎵 AUDIO:
   - 2x Microphones HF jeune/artiste
   - Retours IEM stéréo
   
   💡 LUMIÈRE:
   - Console DMX 512
   - LED RGB complet
   ```
3. Cliquez **"Sauvegarder rider"**
4. ✅ Les spécifications s'affichent côté

### Étape 6 : Créer un document à signer

1. Cliquez sur **Sign Flow** (✍️)
2. Remplissez :
   - **Titre**: "Contrat artiste"
   - **Contenu**: Le texte à faire signer
   - **Signataire**: "Alice Martin"
3. Cliquez **"Créer pour signature"**
4. ✅ Le document apparaît dans la liste

### Étape 7 : Consulter le Lexique

1. Cliquez sur le bouton 📖 en bas du sidebar
2. Explorez les termes techniques
3. Cliquez ✕ pour fermer

---

## 🎯 Cas d'usage courants

### Usecase 1 : Gérer une production de concert

```
1. Créer la Callsheet avec nom "Concert X" + date + musiciens
2. Ajouter tout le personnel (régie, technique, accueil)
3. Générer les accréditations pour chacun
4. Remplir le Rider Technique complet
5. Créer les documents à faire signer
6. Consulter le Show Control pour voir les métriques en direct
```

### Usecase 2 : Vérifier une production

```
1. Cliquez sur "Show Control"
2. Voyez immédiatement :
   - Événement en cours
   - Nombre de team
   - Nombre d'accréditations
   - Documents à signer
3. Accédez à Crew/Staff pour vérifier les présences
```

### Usecase 3 : Consulter les spécs avant un show

```
1. Cliquez sur "Rider Technique"
2. Consultez audio, lumière, vidéo
3. Partagez avec les équipes techniques
```

---

## 💾 Sauvegarde et données

### Données sauvegardées automatiquement

✅ Toutes les données sont sauvegardées dans **localStorage** du navigateur

```javascript
// Vérifier les données save
// Dans console Chrome DevTools
localStorage.getItem('aintercom_state')
// → Retourne un JSON massive avec TOUT
```

### Exporter les données (TODO v1.1)

```bash
# Clic droit → Télécharger données
# Génère un JSON téléchargeable
```

### Importer des données (TODO v1.1)

```bash
# Icône ⬆️ → Charger fichier JSON
# Restaure l'état complet
```

---

## 🔧 Personnalisation

### Changer la langue

1. Cliquez ⚙️ (Settings) en bas du sidebar
2. **Langue** → Français ou English
3. Les libellés se mettent à jour ✓

### Activer/désactiver le mode sombre

1. Cliquez ⚙️ (Settings)
2. Toggle **Mode sombre**
3. L'interface se réadapte

### Ajuster le volume des notifications

1. Cliquez ⚙️ (Settings)
2. **Volume notification** → Curseur
3. 0 = silencieux, 100 = max volume

---

## 🔐 Connexion utilisateur (Préparation)

**Version 1.0** : Les données sont locales

**Version 1.1** : Connexion Supabase

```javascript
1. Cliquez sur "Connexion" (🧑 en haut à droite)
2. Entrez email + mot de passe
3. Les données seront synchronisées dans le cloud
4. Accédez-les depuis N'IMPORTE quel appareil
```

---

## ⚠️ Limites actuelles (v1.0)

- ❌ Pas de synchronisation cloud (en cours)
- ❌ Une seule personne par navigateur
- ❌ Les données se perdent si cache vidé
- ❌ Pas d'authentification
- ❌ Pas de partage en temps réel

---

## ✅ Fonctionnalités prêtes

- ✅ Navigation fluide entre modules
- ✅ Création/suppression d'éléments
- ✅ Synchronisation inter-modules (Callsheet → Show Control)
- ✅ Métriques en temps réel
- ✅ Lexique consultatif
- ✅ Persistance locale
- ✅ Design technique professionnel
- ✅ Responsive (desktop/tablet/mobile)

---

## 🆘 Troubleshooting

### Q: Les données disparaissent au rechargement?

**A**: localStorage peut être vidé par navigateur → Exporter JSON

### Q: Callsheet n'apparaît pas dans Show Control?

**A**: Rechargez la page (F5) + vérifiez que Callsheet est créée

### Q: Comment réinitialiser?

**A**: DevTools → Storage → localStorage → Supprimer `aintercom_state`

### Q: Le Lexique ne s'affiche pas?

**A**: Vérifiez que `modules/lexique.html` existe

---

## 📞 Support

- **Issues** : GitHub Issues
- **Docs** : [README.md](./README.md) | [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Connexions** : [CONNECTIONS.md](./CONNECTIONS.md)
- **Supabase** : [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

---

**Bienvenue dans AINTERCOM OS!** 🎙️

Prochaine étape : Lancer sur production avec Supabase ⚡
