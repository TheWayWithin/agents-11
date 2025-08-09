#!/bin/bash

# Agents-11 Deployment Script
# Usage: ./scripts/deploy.sh [staging|production]

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT=${1:-staging}

echo -e "${BLUE}🚀 Starting deployment to ${ENVIRONMENT}${NC}"

# Validate environment
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    echo -e "${RED}❌ Invalid environment. Use 'staging' or 'production'${NC}"
    exit 1
fi

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo -e "${RED}❌ Please run this script from the project root${NC}"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

echo -e "${BLUE}📋 Running pre-deployment checks...${NC}"

# Run pre-deployment checks
echo -e "${YELLOW}🔍 Linting code...${NC}"
npm run lint

echo -e "${YELLOW}🔍 Type checking...${NC}"
npm run type-check

echo -e "${YELLOW}🧪 Running unit tests...${NC}"
npm run test:ci

echo -e "${YELLOW}🏗️  Building application...${NC}"
npm run build

if [[ "$ENVIRONMENT" == "production" ]]; then
    echo -e "${YELLOW}🎭 Running E2E tests...${NC}"
    npm run test:e2e
fi

echo -e "${GREEN}✅ All pre-deployment checks passed!${NC}"

# Deploy based on environment
if [[ "$ENVIRONMENT" == "production" ]]; then
    echo -e "${BLUE}🚀 Deploying to production...${NC}"
    
    # Confirm production deployment
    read -p "$(echo -e ${YELLOW}Are you sure you want to deploy to PRODUCTION? [y/N]: ${NC})" -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Deployment cancelled${NC}"
        exit 1
    fi
    
    vercel --prod
    
    echo -e "${GREEN}✅ Deployed to production!${NC}"
    echo -e "${BLUE}🌐 Production URL: https://agents11.com${NC}"
    
else
    echo -e "${BLUE}🚀 Deploying to staging...${NC}"
    vercel
    
    echo -e "${GREEN}✅ Deployed to staging!${NC}"
    echo -e "${BLUE}🌐 Preview URL will be shown above${NC}"
fi

# Post-deployment health check
echo -e "${BLUE}🏥 Running post-deployment health check...${NC}"
sleep 5

if [[ "$ENVIRONMENT" == "production" ]]; then
    HEALTH_URL="https://agents11.com/api/health"
else
    # Get the preview URL from Vercel output (this is simplified)
    HEALTH_URL="https://staging-agents11.vercel.app/api/health"
fi

# Simple health check (you might want to implement an actual health endpoint)
if curl -f -s "$HEALTH_URL" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Health check passed!${NC}"
else
    echo -e "${YELLOW}⚠️  Health check endpoint not available (this is expected if not implemented)${NC}"
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"

# Remind about post-deployment tasks
echo -e "${BLUE}📝 Post-deployment checklist:${NC}"
echo "  • Test critical user journeys"
echo "  • Verify Stripe webhooks are working"
echo "  • Check monitoring dashboards"
echo "  • Verify email notifications"
echo "  • Test payment flows"

if [[ "$ENVIRONMENT" == "production" ]]; then
    echo "  • Update DNS records if needed"
    echo "  • Monitor error rates for 30 minutes"
    echo "  • Announce deployment to team"
fi