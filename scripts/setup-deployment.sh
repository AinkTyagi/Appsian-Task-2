#!/bin/bash

# Deployment Setup Script
# This script helps you configure your project for deployment

set -e

echo "🚀 Mini Project Manager - Deployment Setup"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    if ! command -v git &> /dev/null; then
        echo -e "${RED}❌ Git is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Git is installed${NC}"
    
    if ! command -v dotnet &> /dev/null; then
        echo -e "${RED}❌ .NET SDK is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ .NET SDK is installed${NC}"
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js is installed${NC}"
    echo ""
}

# Setup environment files
setup_env_files() {
    echo "🔧 Setting up environment files..."
    
    if [ ! -f "web/.env.production" ]; then
        cat > web/.env.production << 'EOF'
VITE_API_BASE_URL=https://your-api.onrender.com
EOF
        echo -e "${GREEN}✓ Created web/.env.production${NC}"
    fi
    
    if [ ! -f ".env.example" ]; then
        cat > .env.example << 'EOF'
# Backend Environment Variables
JWT__Key=your-secret-key-must-be-at-least-32-characters-long
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:5000

# Frontend Environment Variables
VITE_API_BASE_URL=https://your-api-url.onrender.com
EOF
        echo -e "${GREEN}✓ Created .env.example${NC}"
    fi
    echo ""
}

# Main execution
main() {
    check_prerequisites
    setup_env_files
    
    echo "✅ Deployment setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Read DEPLOYMENT.md for detailed instructions"
    echo "2. Push code to GitHub"
    echo "3. Deploy to Render and Vercel"
    echo "4. Configure GitHub secrets for CI/CD"
}

main
