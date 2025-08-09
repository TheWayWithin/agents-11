#!/bin/bash

# Production Setup Script for Agents-11
# This script helps set up production environment variables and configurations

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 Agents-11 Production Setup${NC}"
echo -e "${YELLOW}This script will help you configure production environment variables${NC}"
echo

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found. Please install it first:${NC}"
    echo "npm install -g vercel"
    exit 1
fi

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    echo -e "${RED}❌ Please run this script from the project root${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Setting up production environment variables...${NC}"

# Function to set environment variable
set_env_var() {
    local key=$1
    local description=$2
    local is_secret=${3:-false}
    
    echo -e "${YELLOW}Setting $key${NC}"
    echo "$description"
    
    if [[ "$is_secret" == "true" ]]; then
        read -s -p "Enter value (hidden): " value
        echo
    else
        read -p "Enter value: " value
    fi
    
    if [[ -n "$value" ]]; then
        vercel env add "$key" production <<< "$value"
        echo -e "${GREEN}✅ $key set successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Skipping $key (empty value)${NC}"
    fi
    echo
}

# Required environment variables
echo -e "${BLUE}🔐 Required Environment Variables${NC}"

set_env_var "NEXT_PUBLIC_SUPABASE_URL" "Your production Supabase project URL (https://your-project.supabase.co)"

set_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "Your production Supabase anonymous key" true

set_env_var "SUPABASE_SERVICE_ROLE_KEY" "Your production Supabase service role key (keep this secret!)" true

set_env_var "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" "Your Stripe live publishable key (pk_live_...)"

set_env_var "STRIPE_SECRET_KEY" "Your Stripe live secret key (sk_live_...)" true

set_env_var "STRIPE_WEBHOOK_SECRET" "Your production Stripe webhook secret (whsec_...)" true

set_env_var "NEXT_PUBLIC_APP_URL" "Your production app URL (https://agents11.com)"

set_env_var "NEXTAUTH_SECRET" "A secure random string (min 32 characters)" true

# Stripe Price IDs
echo -e "${BLUE}💳 Stripe Price IDs (from your Stripe Dashboard)${NC}"

set_env_var "STRIPE_STARTER_PRICE_ID" "Starter plan price ID (price_...)"

set_env_var "STRIPE_PROFESSIONAL_PRICE_ID" "Professional plan price ID (price_...)"

set_env_var "STRIPE_UNLIMITED_PRICE_ID" "Unlimited plan price ID (price_...)"

# Optional but recommended
echo -e "${BLUE}📊 Optional Monitoring & Analytics${NC}"

read -p "Do you want to set up Sentry for error tracking? [y/N]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    set_env_var "SENTRY_DSN" "Your Sentry DSN for server-side errors" true
    set_env_var "NEXT_PUBLIC_SENTRY_DSN" "Your Sentry DSN for client-side errors"
fi

read -p "Do you want to set up analytics (PostHog)? [y/N]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    set_env_var "NEXT_PUBLIC_POSTHOG_KEY" "Your PostHog project API key"
    set_env_var "NEXT_PUBLIC_POSTHOG_HOST" "PostHog host (default: https://app.posthog.com)"
fi

read -p "Do you want to set up email service (Resend)? [y/N]: " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    set_env_var "RESEND_API_KEY" "Your Resend API key for sending emails" true
fi

# Set production-specific variables
echo -e "${BLUE}🏭 Production Configuration${NC}"
vercel env add NODE_ENV production <<< "production"
vercel env add NEXT_PUBLIC_ENABLE_ANALYTICS production <<< "true"
vercel env add NEXT_PUBLIC_ENABLE_ERROR_REPORTING production <<< "true"
vercel env add NEXT_PUBLIC_MAINTENANCE_MODE production <<< "false"

echo -e "${GREEN}✅ Environment variables setup complete!${NC}"
echo
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Verify all environment variables in Vercel dashboard"
echo "2. Set up your custom domain in Vercel"
echo "3. Configure Stripe webhooks to point to your production domain"
echo "4. Update Supabase authentication settings for your domain"
echo "5. Test your deployment with: npm run deploy:production"
echo
echo -e "${YELLOW}⚠️  Important Reminders:${NC}"
echo "• Use LIVE mode Stripe keys for production"
echo "• Set up proper database backups in Supabase"
echo "• Configure monitoring alerts"
echo "• Review and test all payment flows"
echo "• Set up SSL certificates for custom domains"
echo
echo -e "${GREEN}🎉 Ready for production deployment!${NC}"