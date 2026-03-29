#!/usr/bin/env python3
"""
AINTERCOM Lexique Extractor
Extrait tous les termes du fichier modules/lexique.html
et les convertit en JavaScript array pour js/lexique-data.js

Usage:
    python3 extract_glossary.py
    
Aide:
    - Lit modules/lexique.html
    - Parse structure HTML
    - Génère js/lexique-data.js avec 1000+ termes
    - Format: {id, fr, en, cat, def_fr, def_en}
"""

import re
import json
import os
from pathlib import Path

def extract_glossary_from_html(html_file):
    """
    Extrait le glossaire du fichier modules/lexique.html
    """
    print(f"📖 Lecture du fichier: {html_file}")
    
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"❌ Fichier non trouvé: {html_file}")
        return []
    
    glossary = []
    term_id = 1
    
    # Pattern pour chercher les termes dans le HTML
    # Format attendu:
    # <tr><td>FR</td><td>EN</td><td>Category</td><td>Def FR</td><td>Def EN</td></tr>
    # Ou dans un tableau <table>
    
    # Chercher les lignes de tableau
    pattern = r'<tr[^>]*>.*?<td[^>]*>([^<]+)</td>.*?<td[^>]*>([^<]+)</td>.*?<td[^>]*>([^<]+)</td>.*?<td[^>]*>([^<]*)</td>.*?<td[^>]*>([^<]*)</td>.*?</tr>'
    
    matches = re.finditer(pattern, content, re.DOTALL | re.IGNORECASE)
    
    for match in matches:
        try:
            fr = match.group(1).strip()
            en = match.group(2).strip()
            cat = match.group(3).strip()
            def_fr = match.group(4).strip()
            def_en = match.group(5).strip()
            
            if fr and en:  # Validation minimale
                term = {
                    'id': term_id,
                    'fr': fr,
                    'en': en,
                    'cat': cat,
                    'def_fr': def_fr,
                    'def_en': def_en
                }
                glossary.append(term)
                term_id += 1
        except Exception as e:
            print(f"⚠️  Erreur parsing terme: {e}")
    
    print(f"✅ {len(glossary)} termes extraits")
    return glossary


def extract_glossary_from_array(html_file):
    """
    Alternative: Extrait d'un array JavaScript déjà présent
    """
    print(f"📖 Lecture du fichier: {html_file}")
    
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"❌ Fichier non trouvé: {html_file}")
        return []
    
    glossary = []
    
    # Chercher const GLOSSARY = [ ... ]
    array_pattern = r'const\s+GLOSSARY\s*=\s*\[(.*?)\];'
    array_match = re.search(array_pattern, content, re.DOTALL)
    
    if not array_match:
        print("❌ Array GLOSSARY non trouvé")
        return []
    
    array_content = array_match.group(1)
    
    # Parser chaque objet {id, fr, en, cat, def_fr, def_en}
    # Utiliser approche simple: chercher tout les {objects}
    object_pattern = r'\{([^}]+)\}'
    
    for match in re.finditer(object_pattern, array_content):
        try:
            obj_str = match.group(1)
            
            # Extraire chaque propriété
            id_match = re.search(r'id\s*:\s*(\d+)', obj_str)
            fr_match = re.search(r"fr\s*:\s*['\"]([^'\"]*)['\"]", obj_str)
            en_match = re.search(r"en\s*:\s*['\"]([^'\"]*)['\"]", obj_str)
            cat_match = re.search(r"cat\s*:\s*['\"]([^'\"]*)['\"]", obj_str)
            def_fr_match = re.search(r"def_fr\s*:\s*['\"]([^'\"]*)['\"]", obj_str)
            def_en_match = re.search(r"def_en\s*:\s*['\"]([^'\"]*)['\"]", obj_str)
            
            # Construire le terme s'il a au moins fr et en
            if fr_match and en_match:
                term = {
                    'id': int(id_match.group(1)) if id_match else len(glossary) + 1,
                    'fr': fr_match.group(1),
                    'en': en_match.group(1),
                    'cat': cat_match.group(1) if cat_match else '',
                    'def_fr': def_fr_match.group(1) if def_fr_match else '',
                    'def_en': def_en_match.group(1) if def_en_match else ''
                }
                glossary.append(term)
        except Exception as e:
            print(f"⚠️  Erreur parsing objet: {e}")
    
    print(f"✅ {len(glossary)} termes extraits")
    return glossary


def generate_javascript_file(glossary, output_file):
    """
    Génère le fichier js/lexique-data.js
    """
    print(f"📝 Génération du fichier: {output_file}")
    
    # Header commentaires
    js_content = """/**
 * AINTERCOM Lexique Data
 * Complete glossary with 1000+ technical terms
 * Auto-generated from modules/lexique.html
 * 
 * Structure: {id, fr, en, cat, def_fr, def_en}
 * Categories: RÉGIE, AUDIO, LUMIÈRE, STRUCTURE, ÉLECTRICITÉ, etc.
 */

"""
    
    # Tableau JavaScript
    js_content += "const GLOSSARY = [\n"
    
    for i, term in enumerate(glossary):
        # Échapper les guillemets dans les définitions
        def_fr = term.get('def_fr', '').replace('"', '\\"').replace('\n', ' ')
        def_en = term.get('def_en', '').replace('"', '\\"').replace('\n', ' ')
        
        js_content += f"""  {{
    id: {term['id']},
    fr: "{term['fr']}",
    en: "{term['en']}",
    cat: "{term['cat']}",
    def_fr: "{def_fr}",
    def_en: "{def_en}"
  }}"""
        
        if i < len(glossary) - 1:
            js_content += ",\n"
        else:
            js_content += "\n"
    
    js_content += """];\n\n"""
    
    # Export pour Node.js et navigateur
    js_content += """// Export pour Node.js (optionnel)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GLOSSARY;
}

// Statistics
console.log(`✅ GLOSSARY loaded: ${GLOSSARY.length} terms`);
const categories = [...new Set(GLOSSARY.map(t => t.cat))];
console.log(`📂 Categories: ${categories.join(', ')}`);
"""
    
    # Écrire le fichier
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"✅ Fichier créé: {output_file}")
        return True
    except Exception as e:
        print(f"❌ Erreur écriture fichier: {e}")
        return False


def generate_statistics(glossary):
    """
    Affiche statistiques sur le glossaire
    """
    if not glossary:
        print("❌ Pas de termes extraits")
        return
    
    print("\n📊 STATISTIQUES")
    print("=" * 50)
    print(f"Total termes: {len(glossary)}")
    
    # Statistiques par catégorie
    categories = {}
    for term in glossary:
        cat = term.get('cat', 'UNKNOWN')
        categories[cat] = categories.get(cat, 0) + 1
    
    print(f"\nTermes par catégorie:")
    for cat in sorted(categories.keys()):
        count = categories[cat]
        print(f"  • {cat:20s} → {count:3d} termes")
    
    # Termes avec/sans définition
    with_def_fr = len([t for t in glossary if t.get('def_fr')])
    with_def_en = len([t for t in glossary if t.get('def_en')])
    
    print(f"\nCouverture définitions:")
    print(f"  • FR: {with_def_fr}/{len(glossary)} ({100*with_def_fr//len(glossary)}%)")
    print(f"  • EN: {with_def_en}/{len(glossary)} ({100*with_def_en//len(glossary)}%)")


def main():
    """
    Main script
    """
    print("🎙️  AINTERCOM Glossary Extractor")
    print("=" * 50)
    
    # Chemins
    project_dir = Path(__file__).parent
    lexique_html = project_dir / "modules" / "lexique.html"
    output_js = project_dir / "js" / "lexique-data.js"
    
    # Extraire le glossaire
    print("\n1️⃣ EXTRACTION")
    glossary = extract_glossary_from_array(str(lexique_html))
    
    if not glossary:
        print("⚠️  Tentative parse alternatif...")
        glossary = extract_glossary_from_html(str(lexique_html))
    
    if not glossary:
        print("❌ Aucun terme extrait!")
        return
    
    # Générer fichier JavaScript
    print("\n2️⃣ GÉNÉRATION")
    success = generate_javascript_file(glossary, str(output_js))
    
    if not success:
        return
    
    # Statistiques
    print("\n3️⃣ STATISTIQUES")
    generate_statistics(glossary)
    
    print("\n✅ COMPLET!")
    print(f"   Fichier généré: {output_js}")
    print(f"   Termes extraits: {len(glossary)}")
    print("\n💡 Utilisation:")
    print("   - Import dans dashboard.html")
    print("   - Utiliser avec les filters du Lexique")
    print("   - Ajouter au localStorage pour offline")


if __name__ == "__main__":
    main()
