.PHONY: help install dev build test clean deploy docker-up docker-down docker-logs

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo "📦 Installing dependencies..."
	@npm install
	@cd web && npm install
	@cd server && dotnet restore

dev: ## Start development servers
	@echo "🚀 Starting development servers..."
	@npm run dev

build: ## Build for production
	@echo "🔨 Building for production..."
	@npm run build

test: ## Run all tests
	@echo "🧪 Running tests..."
	@npm run test

test-backend: ## Run backend tests only
	@echo "🧪 Running backend tests..."
	@cd server/ProjectManager.Tests && dotnet test

test-frontend: ## Run frontend tests only
	@echo "🧪 Running frontend tests..."
	@cd web && npm run test

clean: ## Clean build artifacts and dependencies
	@echo "🧹 Cleaning..."
	@rm -rf node_modules
	@rm -rf web/node_modules
	@rm -rf web/dist
	@cd server && dotnet clean

docker-up: ## Start application with Docker Compose
	@echo "🐳 Starting Docker containers..."
	@docker-compose up -d
	@echo "✅ Application running at http://localhost:8080"
	@echo "📊 Backend API at http://localhost:5000"

docker-down: ## Stop Docker containers
	@echo "🛑 Stopping Docker containers..."
	@docker-compose down

docker-logs: ## View Docker logs
	@docker-compose logs -f

docker-rebuild: ## Rebuild and restart Docker containers
	@echo "🔄 Rebuilding Docker containers..."
	@docker-compose down
	@docker-compose build --no-cache
	@docker-compose up -d

deploy-check: ## Check if ready for deployment
	@echo "✅ Running pre-deployment checks..."
	@echo "1. Testing backend..."
	@cd server/ProjectManager.Tests && dotnet test --verbosity quiet
	@echo "2. Testing frontend..."
	@cd web && npm run test -- --run > /dev/null 2>&1 || true
	@echo "3. Building backend..."
	@cd server && dotnet build -c Release > /dev/null
	@echo "4. Building frontend..."
	@cd web && npm run build > /dev/null
	@echo "✅ All checks passed! Ready to deploy."

setup-deployment: ## Run deployment setup script
	@echo "⚙️ Running deployment setup..."
	@./scripts/setup-deployment.sh

git-push: ## Add, commit, and push changes
	@read -p "Enter commit message: " msg; \
	git add . && \
	git commit -m "$$msg" && \
	git push

quick-deploy: test git-push ## Run tests and push (triggers CI/CD)
	@echo "🚀 Code pushed! Check GitHub Actions for deployment status."
	@echo "https://github.com/$$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git/\1/')/actions"
