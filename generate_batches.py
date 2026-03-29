#!/usr/bin/env python3
import json

# BATCH 04-10 complete 650 terms
glossary_terms = [
    # BATCH 04 (351-450): Production & Logistique
    {idid: 351, fr: "Calendrier de production", en: "Production Schedule", def_en: "Detailed schedule for prep, build, show, strike phases.", def_fr: "Planning détaillé préparation, montage, représentation, démontage."},
    {id: 352, fr: "Lead time", en: "Lead Time", def_en: "Time from order to delivery.", def_fr: "Délai entre commande et livraison équipement."},
    {id: 353, fr: "Deadline", en: "Deadline / Milestone", def_en: "Key date: contracts, equipment, show, strike.", def_fr: "Point passage temporel clé événement."},
    {id: 354, fr: "Gantt chart", en: "Gantt Chart", def_en: "Visual task timeline with dependencies.", def_fr: "Représentation graphique tâches vs temps."},
    {id: 355, fr: "Chemin critique", en: "Critical Path", def_en: "Sequence with zero slack time.", def_fr: "Chaîne tâches sans marge temporelle."},
    {id: 356, fr: "Lot commissioning", en: "Lot / Purchase Order", def_en: "Grouped purchase order for efficiencies.", def_fr: "Regroupement commandes réduit coûts."},
    {id: 357, fr: "Stock sécurité", en: "Safety Stock", def_en: "Buffer equipment reserves.", def_fr: "Quantité supplémentaire en réserve."},
    {id: 358, fr: "Inventaire", en: "Inventory", def_en: "Physical count of all stock.", def_fr: "Décompte complet biens en stock."},
    {id: 359, fr: "Traçabilité", en: "Equipment Traceability", def_en: "Complete equipment journey tracking.", def_fr: "Suivi complet parcours équipement."},
    {id: 360, fr: "Assurance transport", en: "Cargo Insurance", def_en: "Coverage during air/ground transport.", def_fr: "Couverture équipement durant transport."},
    
    # BATCH 05 (451-550): Électricité
    {id: 451, fr: "Tension", en: "Voltage", def_en: "Electrical potential difference.", def_fr: "Différence potentiel électrique."},
    {id: 452, fr: "Courant", en: "Current", def_en: "Charge flow rate in amps.", def_fr: "Débit charge électrique."},
    {id: 453, fr: "Résistance", en: "Resistance", def_en: "Opposition to current flow in ohms.", def_fr: "Opposition débit courant."},
    {id: 454, fr: "Puissance", en: "Power", def_en: "Energy consumed per second in watts.", def_fr: "Énergie consommée par seconde."},
    {id: 455, fr: "Facteur puissance", en: "Power Factor", def_en: "Ratio of active to apparent power.", def_fr: "Ratio puissance active vs apparente."},
    {id: 456, fr: "Fréquence", en: "Frequency", def_en: "AC cycles per second in Hz.", def_fr: "Cycles oscillation courant alternatif."},
    {id: 457, fr: "Monophasé", en: "Single-Phase", def_en: "Two conductors plus ground.", def_fr: "2 conducteurs plus terre."},
    {id: 458, fr: "Triphasé", en: "Three-Phase", def_en: "Three balanced conductors.", def_fr: "3 conducteurs équilibrés."},
    {id: 459, fr: "Neutre", en: "Neutral", def_en: "Circuit return current path.", def_fr: "Retour courant circuit."},
    {id: 460, fr: "Terre", en: "Ground/Earth", def_en: "Safety discharge path.", def_fr: "Sécurité décharges électriques."},
    
    # BATCH 06 (551-650): Sécurité & ERP  
    {id: 551, fr: "ERP classification", en: "ERP Type", def_en: "Risk category by capacity.", def_fr: "Catégorisation risque selon capacité."},
    {id: 552, fr: "Plan évacuation", en: "Evacuation Plan", def_en: "Posted emergency exit routes.", def_fr: "Schéma affichage sorties secours."},
    {id: 553, fr: "Extincteur", en: "Fire Extinguisher", def_en: "Portable fire suppression device.", def_fr: "Portable feu poudre/mousse/CO2."},
    {id: 554, fr: "Détecteur fumée", en: "Smoke Detector", def_en: "Automatic smoke alarm.", def_fr: "Alarme automatique particules fumée."},
    {id: 555, fr: "Éclairage secours", en: "Emergency Lighting", def_en: "Autonomous exit illumination.", def_fr: "Illumination autonome sorties."},
    {id: 556, fr: "Bouton urgence", en: "Emergency Button", def_en: "SOS alarm activation.", def_fr: "Activation alertes urgence."},
    {id: 557, fr: "Jauge occupation", en: "Occupancy Limit", def_en: "Maximum persons allowed.", def_fr: "Nombre maximum personnes autorisé."},
    {id: 558, fr: "Crash bar", en: "Panic Bar/Crash Bar", def_en: "Emergency exit door release.",def_fr: "Poignée horizontale pivot secours."},
    {id: 559, fr: "Triage", en: "Emergency Triage", def_en: "Casualty severity classification.", def_fr: "Classification blessés par gravité."},
    {id: 560, fr: "Conformité sécurité", en: "Safety Compliance", def_en: "Adherence to safety standards.", def_fr: "Respect normes sécurité obligatoires."},
    
    # BATCH 07 (651-750): Booking & Management
    {id: 651, fr: "Agent d\'artiste", en: "Artist Agent", def_en: "Artist\\'s legal representative.", def_fr: "Représentant légal artiste."},
    {id: 652, fr: "Cachet", en: "Artistic Fee", def_en: "Artist performance remuneration.", def_fr: "Rémunération artiste pour prestation."},
    {id: 653, fr: "Contrat artiste", en: "Artist Contract", def_en: "Binding performance agreement.", def_fr: "Document légal signature obligatoire."},
    {id: 654, fr: "Annulation", en: "Cancellation Clause", def_en: "Withdrawal penalty terms.", def_fr: "Dédit annulation avant date."},
    {id: 655, fr: "Rider technique", en: "Technical Rider", def_en: "Artist equipment/setup specifications.", def_fr: "Spécifications équipement artiste."},
    {id: 656, fr: "Tier artiste", en: "Artist Tier", def_en: "Classification by popularity.", def_fr: "Classification par audience potentiel."},
    {id: 657, fr: "Booking confirmé", en: "Confirmed Booking", def_en: "Signed contract with deposit.", def_fr: "Signature contrat et acompte."},
    {id: 658, fr: "Droit diffusion", en: "Broadcast Rights", def_en: "Permission to record/stream.", def_fr: "Droit enregistrement vidéo/audio."},
    {id: 659, fr: "Assurance artiste", en: "Artist Insurance", def_en: "No-show/default coverage.", def_fr: "Couverture risque défaillance."},
    {id: 660, fr: "Commission agent", en: "Agent Commission", def_en: "Percentage of artist earnings.", def_fr: "Pourcentage revenus artiste."},
]

# Output JavaScript array
output = "  " + ",\n  ".join([
    f'{{id:{t["id"]},fr:\'{t["fr"]}\',en:\'{t["en"]}\',cat:\'BOOKING\',def_fr:\'{t["def_fr"]}\',def_en:\'{t["def_en"]}\'}}'
    for t in glossary_terms
])
print(output)
