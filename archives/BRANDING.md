# AINTERCOM OS — Branding & Icônes

## 🎙️ Identité visuelle

### Logo & Mark

```
Emoji: 🎙️ (Microphone)
Couleur: #00d4ff (Cyan tech)
Typographie: Oswald Bold (titres)
Mood: Technique, efficace, sombre
```

### Nom

```
AINTERCOM OS
├─ AINTERCOM = Plateforme (Intercom pour audio)
└─ OS = Operating System (système d'exploitation)
```

---

## 🎨 Palette de couleurs

### Primaire (Cyan technique)

```css
--accent:           #00d4ff    /* Cyan lumineux */
--accent-dim:       #009bb3    /* Cyan sombre (hover) */
--accent-glow:      rgba(0, 212, 255, 0.15)    /* Glow effect */
--accent-subtle:    rgba(0, 212, 255, 0.05)    /* Background léger */
```

### Neutres (Dark mode)

```css
--bg:               #0a0e14    /* Noir fondation */
--bg-secondary:     #0f1419    /* Gris très foncé */
--surface:          #14191f    /* Surface primaire */
--surface-alt:      #1a202a    /* Surface alternative */
--panel:            #1f2633    /* Panels/Cards */
--border:           #2a3440    /* Border primaire */
--border-light:     #3a4450    /* Border hover *)
```

### Sémantique

```css
--success:          #00d97e    /* Vert (success) */
--warning:          #ffb300    /* Amber (warning) */
--danger:           #ff3b3b    /* Rouge (danger) */
--info:             #2d9cff    /* Bleu (info) *)
```

### Texte

```css
--text-primary:     #e8f4ff    /* Blanc froid */
--text-secondary:   #a0b5cc    /* Gris clair */
--text-tertiary:    #5a7490    /* Gris moyen *)
--text-disabled:    #3a4a60    /* Gris désactivé *)
```

---

## 🔤 Typographies

### Familles

```
--f-hero:           'Bebas Neue'        → Logo, grands titres
--f-display:        'Oswald'            → Titres h1-h3, badges
--f-body:           'Inter'             → Texte principal, inputs
--f-mono:           'Share Tech Mono'   → Codes, numéros tech
```

### Utilisations

| Contexte | Typo | Poids | Taille |
|----------|------|-------|--------|
| Logo | Bebas Neue | 700 | 18px |
| Titres module | Oswald | 700 | 16px |
| Subtitles | Share Tech Mono | 400 | 11px |
| Body text | Inter | 400 | 14px |
| Form labels | Share Tech Mono | 400 | 12px |
| Mono/codes | Share Tech Mono | 400 | 12px |

---

## 🎯 Icônes Font Awesome

### Navigation (Sidebar)

```html
<!-- Show Control -->
<i class="fas fa-sliders-h"></i>  <!-- 🎚️ Contrôleur -->

<!-- Crew/Staff -->
<i class="fas fa-users"></i>       <!-- 👥 Groupe -->

<!-- Accréditations -->
<i class="fas fa-badge"></i>       <!-- 🎫 Badge -->

<!-- Rider Technique -->
<i class="fas fa-headphones"></i>  <!-- 🎧 Écouter -->

<!-- Callsheet -->
<i class="fas fa-clipboard-list"></i>  <!-- 📋 Presse-papier -->

<!-- Sign Flow -->
<i class="fas fa-pen-fancy"></i>   <!-- ✍️ Signature -->
```

### Buttons & Actions

```html
<!-- Outils flottants -->
<i class="fas fa-book"></i>           <!-- 📚 Lexique -->
<i class="fas fa-cog"></i>            <!-- ⚙️ Paramètres -->
<i class="fas fa-user-circle"></i>    <!-- 🧑 Connexion -->

<!-- Statuts -->
<span>✓ Signé</span>                  <!-- Check mark -->
<span>⏳ En attente</span>             <!-- Hourglass -->
<span>✕ Supprimer</span>              <!-- Croix -->
```

### Module-spécifiques

```html
<!-- Dans les contenus -->
<span>👤 Nom du member</span>         <!-- Personnel -->
<span>🎫 Accréditation</span>         <!-- Badge -->
<span>🎵 Audio</span>                 <!-- Son -->
<span>💡 Lumière</span>               <!-- Light -->
<span>📹 Vidéo</span>                 <!-- Caméra -->
<span>📝 Document</span>              <!-- Signature -->
```

### Importation

Font Awesome 6.4 CDN :
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

---

## 📐 Spacing & Layout

### Padding

```css
--px:               clamp(20px, 5vw, 64px)    /* Padding horizontal */

Petit écran:        20px
Taille moyenne:     ~40px
Grand écran:        64px
```

### Gaps

```css
Gap très petit:     4px    (buttons, tight)
Gap petit:          8px    (items)
Gap normal:         12px   (sections internes)
Gap grand:          16px   (header/footer)
Gap extra:          24px   (colonnes principales)
Gap maximum:        32px   (articles)
```

### Dimensions clés

```css
--sidebar-width:    280px
--header-height:    72px
--lexique-width:    400px
--settings-width:   350px
--max-width:        1600px
```

---

## 🎭 Composants & patterns

### Bouton primaire (CTA)

```css
.btn-primary {
    background:     #00d4ff        /* Cyan accent */
    color:          #0a0e14        /* Text sombre */
    border:         1px solid #00d4ff
    padding:        10px 20px
    border-radius:  4px
    cursor:         pointer
    transition:     all 0.2s
}

.btn-primary:hover {
    background:     #009bb3        /* Dim cyan */
    box-shadow:     0 4px 12px rgba(0, 212, 255, 0.3)
}
```

### Card/Panel

```css
.panel {
    background:     #1f2633        /* Panel color */
    border:         1px solid #2a3440
    border-radius:  8px
    padding:        24px
    backdrop-filter: blur(10px)
}

.panel:hover {
    border-color:   #009bb3        /* Dim accent */
}
```

### Input

```css
input, textarea, select {
    background:     #14191f        /* Dark surface */
    border:         1px solid #2a3440
    color:          #e8f4ff        /* Light text */
    padding:        10px 12px
    border-radius:  4px
    font-family:    var(--f-body)
    transition:     border-color 0.2s
}

input:focus {
    outline:        none
    border-color:   #00d4ff        /* Cyan accent */
    box-shadow:     0 0 0 3px rgba(0, 212, 255, 0.05)
}
```

### Badge/Tag

```css
.badge {
    background:     rgba(0, 212, 255, 0.15)
    color:          #00d4ff
    border:         1px solid #009bb3
    padding:        4px 12px
    border-radius:  2px
    font-size:      12px
    font-family:    var(--f-mono)
}
```

### Notification

```css
.notification.success {
    border-left:    3px solid #00d97e
    color:          #00d97e
}

.notification.error {
    border-left:    3px solid #ff3b3b
    color:          #ff3b3b
}

.notification.info {
    border-left:    3px solid #00d4ff
    color:          #00d4ff
}
```

---

## 📏 Responsive Breakpoints

```css
Desktop:        > 1400px    /* 2 colonnes */
Tablet:         1024-1400px /* 1 colonne */
Mobile:         768-1024px  /* Sidebar icons only */
Compact:        480-768px   /* Stack vertical *)
Minimal:        < 480px     /* Sidebar ultra-compact *)
```

### Adaptations

```css
/* 1024px */
.sidebar { width: 240px; }
.main-content { margin-left: 240px; }
.nav-label { display: none; }

/* 768px */
.sidebar { width: 200px; }
.header-right .event-info { display: none; }
.module-grid { grid-template-columns: 1fr; }

/* 480px */
.sidebar { width: 60px; }
.sidebar-header { flex-direction: column; }
.status-display { grid-template-columns: 1fr; }
```

---

## 🎬 Animations

### Transitions

```css
Rapide:         0.15s
Normal:         0.2s
Lent:           0.3s
Très lent:      0.5s

Easing:         cubic-bezier(0.4, 0, 0.2, 1)
```

### Animations clés

```css
fadeIn         /* Modules switching */
slideIn        /* Notifications arrival *)
slideOut       /* Notifications leaving *)
```

## 📡 État visuel

### Modules actifs

```css
.nav-item.active {
    background:     rgba(0, 212, 255, 0.15)
    border-color:   #009bb3
    color:          #00d4ff
    box-shadow:     inset 0 0 10px rgba(0, 212, 255, 0.1)
}
```

### Hover

```css
.item:hover {
    border-color:   #009bb3
    background:     rgba(0, 212, 255, 0.05)

    /* Cascade effect */
    box-shadow:     0 2px 8px rgba(0, 0, 0, 0.3)
}
```

### Disabled/Readonly

```css
input:disabled,
input:readonly {
    color:          #00d4ff
    background:     rgba(0, 212, 255, 0.05)
    border-color:   #009bb3
    cursor:         not-allowed
}
```

---

## 🌙 Mode clair (Futur v1.2)

```css
/* Préparer le switch */
--bg:              #ffffff
--text-primary:    #0a0e14
--accent:          #0066cc
--border:          #e0e0e0
```

---

## ✨ Micro-interactions

### Feedback utilisateur

```javascript
// Success
Notifier.success('Élément ajouté')          → Vert + Icon

// Error
Notifier.error('Erreur de validation')      → Rouge + Icon

// Info
Notifier.info('Opération en cours')         → Bleu + Icon
```

### Hover states

```css
/* All interactive elements have smooth transitions */
Buttons          0.2s
Links            0.2s
Borders          0.2s
Colors           0.2s
```

---

## 🔒 Accessibilité

- ✓ Contraste > 4.5:1 (WCAG AA)
- ✓ Focus outlines visibles (#00d4ff)
- ✓ Texte descriptif sur icônes (title attributes)
- ✓ Semantic HTML (h1, h2, labels, etc.)
- ✓ Color not only meaning indicator

---

## 🎁 Variables CSS partagées

```html
<!-- In dashboard.html, utiliser les CSS variables partout -->

background: var(--bg);
color: var(--text-primary);
border-color: var(--border);
border: 1px solid var(--border);
background: var(--accent-glow);
font-family: var(--f-body);
```

---

## 📋 Checklist branding

- ✓ Logo 🎙️ utilisé
- ✓ Palette cyan tech (#00d4ff)
- ✓ Typographies cohérentes
- ✓ Dark mode exclusif (v1.0)
- ✓ Icons Font Awesome 6.4
- ✓ Spacing cohérent
- ✓ Animations fluides
- ✓ Accessibilité WCAG AA
- ✓ Responsive jusqu'à 320px
- ✓ Notifications toast

---

**Design system cohérent et modernité technique | v1.0**

*À adapter selon feedback utilisateurs en v1.1*
