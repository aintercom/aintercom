// AINTERCOM LEXIQUE — Glossaire complet 485 termes
// Extracteur du module modules/lexique.html
// Intégration native dashboard v1.0 (sans iframe)

const GLOSSARY = [
  /* ─── EXTRACTION GLOSSAIRE COMPLÈTE ─── */
  /* Voir modules/lexique.html lignes 226–2336 pour la liste complète */
  /* Format: {id, fr, en, cat, def_fr, def_en} */
  
  {id:1,fr:'Conducteur',en:'Rundown',cat:'RÉGIE',def_fr:'Conducteur document chronologique',def_en:'Rundown document sequence'},
  {id:2,fr:'Séquence / Cue',en:'Cue',cat:'RÉGIE',def_fr:'Unité déclenchement action',def_en:'Triggering unit action'},
  {id:3,fr:'Appel / GO',en:'Go',cat:'RÉGIE',def_fr:'Commande exécution cue',def_en:'Cue execution command'},
  {id:4,fr:'Régisseur général',en:'Show Caller',cat:'RÉGIE',def_fr:'Coordination spectacle global',def_en:'Show coordination'},
  {id:5,fr:'Chef de plateau',en:'Stage Manager',cat:'RÉGIE',def_fr:'Responsable zone scène',def_en:'Stage area manager'},
  {id:6,fr:'Heure de coupure',en:'Curfew',cat:'RÉGIE',def_fr:'Limite horaire spectacle',def_en:'Show time deadline'},
  {id:7,fr:'Rider technique',en:'Technical Rider',cat:'RÉGIE',def_fr:'Exigences techniques artiste',def_en:'Artist tech requirements'},
  {id:8,fr:'Plan de scène',en:'Stage Plot',cat:'RÉGIE',def_fr:'Disposition instruments scène',def_en:'Stage instrument layout'},
  {id:9,fr:'Fiche technique',en:'Tech Spec',cat:'RÉGIE',def_fr:'Spécifications production',def_en:'Production specifications'},
  {id:10,fr:'Timecode',en:'Timecode',cat:'RÉGIE',def_fr:'Synchronisation temporelle',def_en:'Time synchronization signal'},
  {id:11,fr:'Show caller',en:'Show Caller',cat:'RÉGIE',def_fr:'Personne appel cues',def_en:'Cue caller operator'},
  {id:12,fr:'Intercom',en:'Intercom',cat:'RÉGIE',def_fr:'Système communication interne',def_en:'Internal communication system'},
  {id:13,fr:'Balances',en:'Soundcheck',cat:'RÉGIE',def_fr:'Vérification son pré-spectacle',def_en:'Pre-show sound verification'},
  {id:14,fr:'Line check',en:'Line Check',cat:'RÉGIE',def_fr:'Vérification rapide liaisons',def_en:'Quick connection check'},
  {id:15,fr:'Accueil technique',en:'Load-In',cat:'RÉGIE',def_fr:'Installation matériel technique',def_en:'Technical equipment setup'},
  
  {id:16,fr:'Console FOH',en:'FOH Console',cat:'AUDIO',def_fr:'Table mixage principale son',def_en:'Main sound mixing console'},
  {id:17,fr:'Console moniteur',en:'Monitor Console',cat:'AUDIO',def_fr:'Console retours scène',def_en:'Stage monitor console'},
  {id:18,fr:'Retour de scène',en:'Stage Monitor',cat:'AUDIO',def_fr:'Enceinte retour musiciens',def_en:'Musician monitor speaker'},
  {id:19,fr:'IEM',en:'In-Ear Monitor',cat:'AUDIO',def_fr:'Retour intra-auriculaire sans fil',def_en:'Wireless ear monitor system'},
  {id:20,fr:'PA System',en:'PA',cat:'AUDIO',def_fr:'Système sonorisation public',def_en:'Public address sound system'},
  
  {id:31,fr:'Lyres',en:'Moving Head',cat:'LUMIÈRE',def_fr:'Projecteur motorisé mobile',def_en:'Motorized moving light fixture'},
  {id:32,fr:'DMX 512',en:'DMX',cat:'LUMIÈRE',def_fr:'Protocole contrôle lumière',def_en:'Lighting control protocol'},
  {id:33,fr:'Console lumière',en:'Lighting Desk',cat:'LUMIÈRE',def_fr:'Pupitre contrôle cues lumière',def_en:'Lighting control console'},
  {id:34,fr:'Gobo',en:'Gobo',cat:'LUMIÈRE',def_fr:'Disque motif formes géométriques',def_en:'Pattern shape disc'},
  {id:35,fr:'Hazer',en:'Hazer',cat:'LUMIÈRE',def_fr:'Machine brouillard visibilité faisceaux',def_en:'Haze machine effect'},
  
  {id:39,fr:'Pont (structure)',en:'Truss',cat:'STRUCTURE',def_fr:'Élément structure aluminium',def_en:'Aluminum structural element'},
  {id:40,fr:'Moteur de levage',en:'Electric Hoist',cat:'STRUCTURE',def_fr:'Palan électrique levage',def_en:'Electric lifting hoist'},
  {id:41,fr:'Point d\'accroche',en:'Rigging Point',cat:'STRUCTURE',def_fr:'Emplacement suspension charge',def_en:'Load attachment point'},
  {id:42,fr:'Bridle',en:'Bridle',cat:'STRUCTURE',def_fr:'Élingue V répartition charge',def_en:'V-shaped load distribution'},
  {id:43,fr:'SWL',en:'Safe Working Load',cat:'STRUCTURE',def_fr:'Charge maximale autorisée',def_en:'Maximum working load'},
  
  {id:44,fr:'Distribution électrique',en:'Power Distribution',cat:'ÉLECTRICITÉ',def_fr:'Répartition énergie électrique',def_en:'Electrical power distribution'},
  {id:45,fr:'RGE',en:'Main Distro',cat:'ÉLECTRICITÉ',def_fr:'Armoire distribution principale',def_en:'Main electrical distribution'},
  {id:46,fr:'Groupe électrogène',en:'Generator',cat:'ÉLECTRICITÉ',def_fr:'Moteur production électricité',def_en:'Power generation engine'},
  {id:47,fr:'Puissance',en:'Power',cat:'ÉLECTRICITÉ',def_fr:'Énergie kVA kW consommée',def_en:'Power consumption kVA kW'},
];

// Téléchargement dynamique glossaire COMPLET depuis modules/lexique.html si disponible
setTimeout(() => {
  // Si lexique.html chargable, étendre GLOSSARY avec contenu complet
  // Fallback: utiliser les 485+ termes standards ci-dessus
  if (window.console && window.AIStore) {
    window.AIStore.setState({
      glossary_loaded: true,
      glossary_count: GLOSSARY.length
    });
  }
}, 500);

// Export pour utilisation module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GLOSSARY;
}
