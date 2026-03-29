#!/bin/bash
# 🎙️ AINTERCOM Quick Start Script
# Démarrage rapide de la plateforme en mode démo

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"
}

print_success() {
    echo -e "${GREEN}✅  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Main script
main() {
    print_header "🎙️ AINTERCOM OS v2.0 — Quick Start"
    
    echo ""
    echo "🎯 AINTERCOM Production Régie Platform"
    echo "📍 Emplacement: $PROJECT_DIR"
    echo ""
    
    # Check dependencies
    print_info "Vérification des dépendances..."
    
    if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
        print_warning "Python n'est pas installé (optionnel)"
    else
        print_success "Python trouvé"
    fi
    
    if ! command -v node &> /dev/null; then
        print_warning "Node.js n'est pas installé (optionnel pour npm)"
    else
        print_success "Node.js trouvé"
    fi
    
    # Check files
    print_info "Vérification des fichiers critiques..."
    
    FILES=(
        "index.html"
        "login.html"
        "dashboard.html"
        "js/supabase-client.js"
        "js/lexique-data.js"
        "js/core.js"
        "js/modules.js"
    )
    
    for file in "${FILES[@]}"; do
        if [ -f "$file" ]; then
            print_success "$file"
        else
            print_error "$file - MISSING!"
        fi
    done
    
    echo ""
    print_header "Choisir mode de démarrage"
    
    echo ""
    echo "1️⃣  Python HTTP Server (port 8000)"
    echo "2️⃣  Node.js live-server (auto-reload)"
    echo "3️⃣  Node.js http-server (port 8080)"
    echo "4️⃣  Afficher documentation"
    echo "0️⃣  Quitter"
    echo ""
    
    read -p "Sélectionner option (0-4): " choice
    
    case $choice in
        1)
            print_info "Démarrage Python HTTP Server..."
            print_success "Serveur lancé sur http://localhost:8000"
            echo ""
            echo "🔗 URLs disponibles:"
            echo "   • Landing:    http://localhost:8000/index.html"
            echo "   • Login:      http://localhost:8000/login.html"
            echo "   • Dashboard:  http://localhost:8000/dashboard.html"
            echo ""
            echo "Credentials démo:"
            echo "   • Email: demo@aintercom.com"
            echo "   • Password: demo123"
            echo ""
            echo "Appuyer Ctrl+C pour arrêter le serveur"
            echo ""
            python3 -m http.server 8000 --bind localhost 2>/dev/null || python -m http.server 8000 --bind localhost
            ;;
        2)
            if ! command -v live-server &> /dev/null; then
                print_error "live-server n'est pas installé"
                echo "Installation: npm install -g live-server"
                exit 1
            fi
            print_info "Démarrage live-server..."
            live-server --port=8000
            ;;
        3)
            if ! command -v http-server &> /dev/null; then
                print_error "http-server n'est pas installé"
                echo "Installation: npm install -g http-server"
                exit 1
            fi
            print_info "Démarrage http-server..."
            http-server -p 8080
            ;;
        4)
            echo ""
            print_header "Documentation Disponible"
            echo ""
            echo "📖 Documentation Files:"
            echo "   • README.md - Overview complet"
            echo "   • GOOGLE_SIGNIN_SETUP.md - Configuration OAuth"
            echo "   • INTEGRATION_TEST.md - Guide test"
            echo "   • GITHUB_DEPLOYMENT.md - Déploiement GitHub"
            echo "   • IMPLEMENTATION_SUMMARY.md - Résumé complet"
            echo ""
            echo "🔗 Quick Links:"
            echo "   • Supabase: https://app.supabase.com"
            echo "   • Google Console: https://console.cloud.google.com"
            echo "   • GitHub: https://github.com/morganspirli/aintercom"
            echo ""
            ;;
        0)
            print_success "Au revoir!"
            exit 0
            ;;
        *)
            print_error "Option invalide"
            exit 1
            ;;
    esac
}

# Run
main

