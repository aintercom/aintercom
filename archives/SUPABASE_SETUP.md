# AINTERCOM OS — Guide d'intégration Supabase

## Vue d'ensemble

AINTERCOM OS est préparé pour une intégration complète avec **Supabase** comme backend. Cette documentation explique comment mettre en œuvre la synchronisation des données en temps réel.

## Architecture

```
┌─────────────────────────────────────┐
│     AINTERCOM OS (Frontend)         │
│   - Dashboard.html                  │
│   - Core.js (State Management)      │
│   - Modules.js (UI Logic)           │
└──────────────┬──────────────────────┘
               │
               ↓
        ┌──────────────┐
        │  Supabase    │
        │  ├─ Auth     │
        │  ├─ Database │
        │  └─ RealTime │
        └──────────────┘
```

## Configuration Supabase

### 1. Création du projet

```bash
# Installation Supabase CLI
npm install @supabase/cli -g

# Initialiser le projet
supabase init aintercom
```

### 2. Schéma de base de données

```sql
-- ============================================
-- USERS (Gestion des utilisateurs)
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- EVENTS (Événements/Productions)
-- ============================================
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    artist VARCHAR(255),
    event_date DATE,
    start_time TIME,
    duration INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_events_user_id ON events(user_id);

-- ============================================
-- CREW_MEMBERS (Personnel)
-- ============================================
CREATE TABLE crew_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_crew_event_id ON crew_members(event_id);

-- ============================================
-- ACCREDITATIONS (Accréditations)
-- ============================================
CREATE TABLE accreditations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    code VARCHAR(50) UNIQUE NOT NULL,
    badge_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_accred_event_id ON accreditations(event_id);

-- ============================================
-- RIDER_SPECS (Rider Technique)
-- ============================================
CREATE TABLE rider_specs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    audio_specs TEXT,
    light_specs TEXT,
    video_specs TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_rider_event_id ON rider_specs(event_id);

-- ============================================
-- CALLSHEETS
-- ============================================
CREATE TABLE callsheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    event_name VARCHAR(255),
    event_date DATE,
    call_time TIME,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_callsheet_event_id ON callsheets(event_id);

-- ============================================
-- DOCUMENTS (Sign Flow)
-- ============================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    signer_name VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    signed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_doc_event_id ON documents(event_id);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE accreditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rider_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE callsheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
CREATE POLICY "Users can read their own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can read their own events"
    ON events FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create events"
    ON events FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- (Répéter pour les autres tables)
```

### 3. Installation du client

```bash
npm install @supabase/supabase-js
```

### 4. Client Supabase (js/supabase.js)

```javascript
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'YOUR_SUPABASE_URL'
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

/**
 * SERVICE D'AUTHENTIFICATION
 */
export const authService = {
    async signup(email, password) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })
        return { data, error }
    },

    async login(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        return { data, error }
    },

    async logout() {
        return await supabase.auth.signOut()
    },

    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser()
        return user
    },

    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session)
        })
    }
}

/**
 * SERVICE D'ÉVÉNEMENTS
 */
export const eventsService = {
    async createEvent(userId, eventData) {
        const { data, error } = await supabase
            .from('events')
            .insert([{
                user_id: userId,
                name: eventData.name,
                artist: eventData.artist,
                event_date: eventData.date,
                start_time: eventData.startTime,
                duration: eventData.duration
            }])
            .select()
        return { data, error }
    },

    async getEvents(userId) {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('user_id', userId)
        return { data, error }
    },

    async updateEvent(eventId, updates) {
        const { data, error } = await supabase
            .from('events')
            .update(updates)
            .eq('id', eventId)
            .select()
        return { data, error }
    }
}

/**
 * SERVICE DE SYNCHRONISATION
 */
export const syncService = {
    async syncFromSupabase(userId, eventId) {
        try {
            // Récupérer toutes les données de l'événement
            const [events, crew, accreds, rider, callsheet, docs] = await Promise.all([
                supabase.from('events').select('*').eq('id', eventId),
                supabase.from('crew_members').select('*').eq('event_id', eventId),
                supabase.from('accreditations').select('*').eq('event_id', eventId),
                supabase.from('rider_specs').select('*').eq('event_id', eventId),
                supabase.from('callsheets').select('*').eq('event_id', eventId),
                supabase.from('documents').select('*').eq('event_id', eventId)
            ])

            return {
                event: events.data?.[0],
                crewMembers: crew.data || [],
                accreditations: accreds.data || [],
                riderSpecs: rider.data?.[0],
                callsheet: callsheet.data?.[0],
                documents: docs.data || []
            }
        } catch (error) {
            console.error('Erreur synchronisation:', error)
            throw error
        }
    },

    async syncToSupabase(data) {
        try {
            // Implémenter la logique de sync bidirectionnelle
            // Envoyer les modifications locales vers Supabase
        } catch (error) {
            console.error('Erreur sync vers Supabase:', error)
            throw error
        }
    }
}

/**
 * REAL-TIME SUBSCRIPTION
 */
export const realtimeService = {
    subscribeToEvents(eventId, callback) {
        return supabase
            .channel(`events:${eventId}`)
            .on('*', payload => callback(payload))
            .subscribe()
    },

    subscribeToCrewChanges(eventId, callback) {
        return supabase
            .channel(`crew:${eventId}`)
            .on('*', payload => callback(payload))
            .subscribe()
    }
}
```

## Prochaines étapes

1. **Créer le compte Supabase** : supabase.com
2. **Exécuter les migrations SQL** dans la console Supabase
3. **Obtenir les clés API** depuis la section "Settings"
4. **Créer js/supabase.js** avec le contenu ci-dessus
5. **Mettre à jour core.js** pour intégrer les appels Supabase
6. **Tester la synchronisation** avec les vrais utilisateurs

## Notes

- Les données locales restent disponibles via localStorage pour le mode hors-ligne
- La synchronisation est bidirectionnelle (local → cloud et cloud → local)
- Les événements RealTime de Supabase permettent les mises à jour en temps réel
- Row Level Security (RLS) garantit que les utilisateurs ne voient que leurs données
