#!/bin/bash

# Deployment Status Checker
# Monitors deployment health and key functionality

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ENVIRONMENT=${1:-production}
DOMAIN=${2:-"https://agents11.com"}

if [[ "$ENVIRONMENT" == "staging" ]]; then
    DOMAIN="https://staging-agents11.vercel.app"
fi

echo -e "${BLUE}🏥 Deployment Health Check for ${ENVIRONMENT}${NC}"
echo "Domain: $DOMAIN"
echo "=================================================================="

ERRORS=0

# Function to check HTTP status
check_endpoint() {
    local url="$1"
    local description="$2"
    local expected_status="${3:-200}"
    
    echo -e "${YELLOW}🔍 Checking $description...${NC}"
    
    local response
    local status_code
    
    response=$(curl -s -w "%{http_code}" "$url" -o /dev/null || echo "000")
    status_code=$response
    
    if [[ "$status_code" == "$expected_status" ]]; then
        echo -e "${GREEN}✅ $description (HTTP $status_code)${NC}"
    else
        echo -e "${RED}❌ $description (HTTP $status_code, expected $expected_status)${NC}"
        ((ERRORS++))
    fi
}

# Function to check response content
check_content() {
    local url="$1"
    local description="$2"
    local expected_content="$3"
    
    echo -e "${YELLOW}🔍 Checking $description content...${NC}"
    
    local response
    response=$(curl -s "$url" 2>/dev/null || echo "")
    
    if echo "$response" | grep -q "$expected_content"; then
        echo -e "${GREEN}✅ $description content correct${NC}"
    else
        echo -e "${RED}❌ $description content missing or incorrect${NC}"
        echo -e "${RED}Expected to find: $expected_content${NC}"
        ((ERRORS++))
    fi
}

# Function to check API endpoint
check_api() {
    local endpoint="$1"
    local description="$2"
    local method="${3:-GET}"
    
    echo -e "${YELLOW}🔍 Checking $description API...${NC}"
    
    local response
    response=$(curl -s -X "$method" -w "%{http_code}" "$DOMAIN$endpoint" -o /dev/null 2>/dev/null || echo "000")
    
    if [[ "$response" -ge 200 && "$response" -lt 400 ]]; then
        echo -e "${GREEN}✅ $description API (HTTP $response)${NC}"
    else
        echo -e "${RED}❌ $description API (HTTP $response)${NC}"
        ((ERRORS++))
    fi
}

echo -e "${BLUE}🌐 Basic Connectivity${NC}"
echo "----------------------------------------"

# Basic site availability
check_endpoint "$DOMAIN" "Homepage"
check_endpoint "$DOMAIN/pricing" "Pricing page"
check_endpoint "$DOMAIN/library" "Library page"

# Check for essential content
check_content "$DOMAIN" "Homepage title" "Agents-11"
check_content "$DOMAIN/pricing" "Pricing content" "Subscription Plans"

echo
echo -e "${BLUE}🔌 API Endpoints${NC}"
echo "----------------------------------------"

# API health checks
check_api "/api/libraries" "Libraries API"

# Stripe integration (should return 405 for GET on POST endpoint)
response=$(curl -s -w "%{http_code}" "$DOMAIN/api/stripe/checkout" -o /dev/null || echo "000")
if [[ "$response" == "405" ]]; then
    echo -e "${GREEN}✅ Stripe checkout API responding (Method Not Allowed expected for GET)${NC}"
else
    echo -e "${RED}❌ Stripe checkout API unexpected response (HTTP $response)${NC}"
    ((ERRORS++))
fi

echo
echo -e "${BLUE}🔒 Security Headers${NC}"
echo "----------------------------------------"

# Check security headers
check_security_header() {
    local header="$1"
    local description="$2"
    
    echo -e "${YELLOW}🔍 Checking $description header...${NC}"
    
    local response
    response=$(curl -s -I "$DOMAIN" | grep -i "$header:" || echo "")
    
    if [[ -n "$response" ]]; then
        echo -e "${GREEN}✅ $description header present${NC}"
    else
        echo -e "${RED}❌ $description header missing${NC}"
        ((ERRORS++))
    fi
}

check_security_header "X-Frame-Options" "X-Frame-Options"
check_security_header "X-Content-Type-Options" "X-Content-Type-Options"
check_security_header "Strict-Transport-Security" "HSTS"
check_security_header "Content-Security-Policy" "CSP"

echo
echo -e "${BLUE}🚀 Performance Checks${NC}"
echo "----------------------------------------"

# Page load time
echo -e "${YELLOW}🔍 Measuring page load time...${NC}"
load_time=$(curl -w "%{time_total}" -s -o /dev/null "$DOMAIN" || echo "999")
load_time_ms=$(echo "$load_time * 1000" | bc -l 2>/dev/null || echo "999")

if (( $(echo "$load_time < 3" | bc -l 2>/dev/null) )); then
    echo -e "${GREEN}✅ Page load time: ${load_time}s${NC}"
else
    echo -e "${YELLOW}⚠️  Page load time: ${load_time}s (> 3s)${NC}"
fi

# Check gzip compression
echo -e "${YELLOW}🔍 Checking gzip compression...${NC}"
if curl -s -H "Accept-Encoding: gzip" -I "$DOMAIN" | grep -q "Content-Encoding: gzip"; then
    echo -e "${GREEN}✅ Gzip compression enabled${NC}"
else
    echo -e "${YELLOW}⚠️  Gzip compression not detected${NC}"
fi

echo
echo -e "${BLUE}🔐 SSL/TLS Configuration${NC}"
echo "----------------------------------------"

# SSL certificate check
echo -e "${YELLOW}🔍 Checking SSL certificate...${NC}"
ssl_info=$(echo | openssl s_client -servername $(echo "$DOMAIN" | sed 's|https://||') -connect $(echo "$DOMAIN" | sed 's|https://||'):443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null || echo "")

if [[ -n "$ssl_info" ]]; then
    echo -e "${GREEN}✅ SSL certificate valid${NC}"
    echo "$ssl_info"
else
    echo -e "${RED}❌ SSL certificate issues${NC}"
    ((ERRORS++))
fi

echo
echo -e "${BLUE}📱 Mobile & Accessibility${NC}"
echo "----------------------------------------"

# Check viewport meta tag
check_content "$DOMAIN" "Responsive viewport" 'viewport'

# Check for basic accessibility
check_content "$DOMAIN" "Accessibility attributes" 'aria-'

echo
echo -e "${BLUE}🔗 External Dependencies${NC}"
echo "----------------------------------------"

# Check if external services are reachable
echo -e "${YELLOW}🔍 Checking Supabase connectivity...${NC}"
if curl -s --max-time 5 "https://supabase.com" > /dev/null; then
    echo -e "${GREEN}✅ Supabase reachable${NC}"
else
    echo -e "${RED}❌ Supabase unreachable${NC}"
    ((ERRORS++))
fi

echo -e "${YELLOW}🔍 Checking Stripe connectivity...${NC}"
if curl -s --max-time 5 "https://api.stripe.com" > /dev/null; then
    echo -e "${GREEN}✅ Stripe API reachable${NC}"
else
    echo -e "${RED}❌ Stripe API unreachable${NC}"
    ((ERRORS++))
fi

echo
echo "=================================================================="
echo -e "${BLUE}📋 HEALTH CHECK SUMMARY${NC}"
echo "=================================================================="

if [[ $ERRORS -eq 0 ]]; then
    echo -e "${GREEN}🎉 ALL HEALTH CHECKS PASSED!${NC}"
    echo -e "${GREEN}✅ Deployment is healthy and ready${NC}"
    
    echo
    echo -e "${BLUE}📊 Recommended Next Steps:${NC}"
    echo "• Monitor error rates for 30 minutes"
    echo "• Test critical user journeys manually"
    echo "• Verify payment processing"
    echo "• Check monitoring dashboards"
    echo "• Update team on deployment status"
    
    exit 0
else
    echo -e "${RED}❌ $ERRORS ISSUES FOUND${NC}"
    echo -e "${RED}Deployment may have issues that need attention${NC}"
    
    echo
    echo -e "${BLUE}🔧 Recommended Actions:${NC}"
    echo "• Review Vercel deployment logs"
    echo "• Check environment variable configuration"
    echo "• Verify DNS and SSL settings"
    echo "• Test API endpoints manually"
    echo "• Review monitoring alerts"
    
    exit 1
fi