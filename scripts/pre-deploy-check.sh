#!/bin/bash

# Pre-Deployment Verification Script
# Runs comprehensive checks before deployment

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ENVIRONMENT=${1:-staging}
ERRORS=0

echo -e "${BLUE}🔍 Pre-Deployment Verification for ${ENVIRONMENT}${NC}"
echo "=================================================================="

# Function to check status and increment error count
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        ((ERRORS++))
    fi
}

# Function to run command and check result
run_check() {
    local command="$1"
    local description="$2"
    local output
    
    echo -e "${YELLOW}🔍 $description...${NC}"
    
    if output=$(eval "$command" 2>&1); then
        echo -e "${GREEN}✅ $description${NC}"
    else
        echo -e "${RED}❌ $description${NC}"
        echo -e "${RED}Error: $output${NC}"
        ((ERRORS++))
    fi
}

echo -e "${BLUE}📋 Code Quality Checks${NC}"
echo "----------------------------------------"

# ESLint
run_check "npm run lint" "ESLint validation"

# TypeScript compilation
run_check "npm run type-check" "TypeScript compilation"

# Prettier formatting
run_check "npm run format:check" "Code formatting"

echo
echo -e "${BLUE}🧪 Testing Suite${NC}"
echo "----------------------------------------"

# Unit tests
run_check "npm run test:ci" "Unit tests"

# E2E tests (only for production)
if [[ "$ENVIRONMENT" == "production" ]]; then
    run_check "npm run test:e2e" "End-to-end tests"
fi

echo
echo -e "${BLUE}🏗️  Build Verification${NC}"
echo "----------------------------------------"

# Build test
run_check "npm run build" "Production build"

echo
echo -e "${BLUE}🔐 Security Checks${NC}"
echo "----------------------------------------"

# npm audit
echo -e "${YELLOW}🔍 Security vulnerabilities...${NC}"
if npm audit --audit-level moderate > /dev/null 2>&1; then
    echo -e "${GREEN}✅ No security vulnerabilities found${NC}"
else
    echo -e "${RED}❌ Security vulnerabilities detected${NC}"
    npm audit --audit-level moderate
    ((ERRORS++))
fi

# Check for sensitive data in repository
echo -e "${YELLOW}🔍 Sensitive data in repository...${NC}"
if git log --all --full-history -- "*.env*" | grep -q "commit"; then
    echo -e "${RED}❌ Environment files found in git history${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ No environment files in git history${NC}"
fi

# Check for API keys in code
if grep -r "sk_live\|pk_live\|whsec_" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . > /dev/null 2>&1; then
    echo -e "${RED}❌ Live API keys found in source code${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ No hardcoded API keys found${NC}"
fi

echo
echo -e "${BLUE}📦 Dependencies & Configuration${NC}"
echo "----------------------------------------"

# Check for required files
required_files=(
    "vercel.json"
    ".env.production.example"
    "next.config.mjs"
    "package.json"
    "tsconfig.json"
)

for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
        ((ERRORS++))
    fi
done

# Check Node.js version compatibility
echo -e "${YELLOW}🔍 Node.js version compatibility...${NC}"
node_version=$(node --version | cut -d'.' -f1 | sed 's/v//')
if [[ "$node_version" -ge 18 ]]; then
    echo -e "${GREEN}✅ Node.js version compatible (v$node_version)${NC}"
else
    echo -e "${RED}❌ Node.js version too old (v$node_version). Requires v18+${NC}"
    ((ERRORS++))
fi

echo
echo -e "${BLUE}🌐 Environment-Specific Checks${NC}"
echo "----------------------------------------"

if [[ "$ENVIRONMENT" == "production" ]]; then
    echo -e "${YELLOW}🔍 Production-specific validations...${NC}"
    
    # Check if main branch
    current_branch=$(git branch --show-current)
    if [[ "$current_branch" == "main" ]]; then
        echo -e "${GREEN}✅ On main branch${NC}"
    else
        echo -e "${RED}❌ Not on main branch (current: $current_branch)${NC}"
        ((ERRORS++))
    fi
    
    # Check for uncommitted changes
    if git diff-index --quiet HEAD --; then
        echo -e "${GREEN}✅ No uncommitted changes${NC}"
    else
        echo -e "${RED}❌ Uncommitted changes detected${NC}"
        ((ERRORS++))
    fi
    
    # Check if up to date with remote
    if git fetch origin && git diff HEAD origin/main --quiet; then
        echo -e "${GREEN}✅ Up to date with remote${NC}"
    else
        echo -e "${YELLOW}⚠️  Local changes not pushed to remote${NC}"
    fi
fi

echo
echo -e "${BLUE}📊 Bundle Analysis${NC}"
echo "----------------------------------------"

# Analyze bundle size (if built)
if [[ -d ".next" ]]; then
    echo -e "${YELLOW}🔍 Analyzing bundle size...${NC}"
    
    # Check for large bundles
    large_bundles=$(find .next/static/chunks -name "*.js" -size +500k 2>/dev/null || true)
    if [[ -n "$large_bundles" ]]; then
        echo -e "${YELLOW}⚠️  Large bundles detected:${NC}"
        echo "$large_bundles"
        echo "Consider code splitting or removing unused dependencies"
    else
        echo -e "${GREEN}✅ Bundle sizes look good${NC}"
    fi
fi

echo
echo "=================================================================="
echo -e "${BLUE}📋 VERIFICATION SUMMARY${NC}"
echo "=================================================================="

if [[ $ERRORS -eq 0 ]]; then
    echo -e "${GREEN}🎉 ALL CHECKS PASSED!${NC}"
    echo -e "${GREEN}✅ Ready for ${ENVIRONMENT} deployment${NC}"
    
    if [[ "$ENVIRONMENT" == "production" ]]; then
        echo
        echo -e "${BLUE}🚀 To deploy to production:${NC}"
        echo "./scripts/deploy.sh production"
    else
        echo
        echo -e "${BLUE}🚀 To deploy to staging:${NC}"
        echo "./scripts/deploy.sh staging"
    fi
    
    exit 0
else
    echo -e "${RED}❌ $ERRORS ISSUES FOUND${NC}"
    echo -e "${RED}Please fix the above issues before deploying${NC}"
    
    echo
    echo -e "${BLUE}🔧 Quick Fixes:${NC}"
    echo "• Run: npm run lint:fix"
    echo "• Run: npm run format"
    echo "• Commit any changes: git add . && git commit -m 'Fix deployment issues'"
    echo "• Resolve test failures"
    echo "• Address security vulnerabilities"
    
    exit 1
fi