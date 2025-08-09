#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * Ensures all required environment variables are present before deployment
 */

const requiredEnvVars = {
  // Supabase Configuration
  'NEXT_PUBLIC_SUPABASE_URL': 'Supabase project URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Supabase anonymous key',
  'SUPABASE_SERVICE_ROLE_KEY': 'Supabase service role key (server-only)',
  
  // Stripe Configuration
  'STRIPE_SECRET_KEY': 'Stripe secret key',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': 'Stripe publishable key',
  'STRIPE_WEBHOOK_SECRET': 'Stripe webhook secret',
  
  // Application Configuration
  'NEXT_PUBLIC_APP_URL': 'Application base URL',
  'NODE_ENV': 'Node environment (development/production)',
};

const optionalEnvVars = {
  // Analytics
  'NEXT_PUBLIC_GA_ID': 'Google Analytics ID',
  'NEXT_PUBLIC_POSTHOG_KEY': 'PostHog project key',
  
  // Monitoring
  'SENTRY_DSN': 'Sentry Data Source Name',
  
  // Build Configuration
  'NEXT_TELEMETRY_DISABLED': 'Next.js telemetry setting',
};

function validateEnvironment() {
  console.log('🔍 Validating environment variables...\n');
  
  let hasErrors = false;
  const warnings = [];
  
  // Check required variables
  console.log('📋 Required Variables:');
  for (const [varName, description] of Object.entries(requiredEnvVars)) {
    const value = process.env[varName];
    
    if (!value || value.trim() === '') {
      console.log(`❌ ${varName}: MISSING - ${description}`);
      hasErrors = true;
    } else {
      // Validate format for specific variables
      if (varName.includes('URL') && !isValidUrl(value)) {
        console.log(`❌ ${varName}: INVALID URL FORMAT - ${value}`);
        hasErrors = true;
      } else if (varName.includes('STRIPE') && !isValidStripeKey(varName, value)) {
        console.log(`❌ ${varName}: INVALID STRIPE KEY FORMAT`);
        hasErrors = true;
      } else {
        console.log(`✅ ${varName}: OK`);
      }
    }
  }
  
  // Check optional variables
  console.log('\n📋 Optional Variables:');
  for (const [varName, description] of Object.entries(optionalEnvVars)) {
    const value = process.env[varName];
    
    if (!value || value.trim() === '') {
      console.log(`⚠️  ${varName}: Not set - ${description}`);
      warnings.push(varName);
    } else {
      console.log(`✅ ${varName}: OK`);
    }
  }
  
  // Environment-specific validations
  console.log('\n📋 Environment-specific Checks:');
  
  if (process.env.NODE_ENV === 'production') {
    // Production-specific validations
    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
      console.log('❌ STRIPE_SECRET_KEY: Should use live key in production');
      hasErrors = true;
    }
    
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_live_')) {
      console.log('❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Should use live key in production');
      hasErrors = true;
    }
    
    if (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.includes('localhost')) {
      console.log('❌ NEXT_PUBLIC_APP_URL: Should not use localhost in production');
      hasErrors = true;
    }
  }
  
  // Summary
  console.log('\n📊 Validation Summary:');
  console.log(`✅ Required variables: ${Object.keys(requiredEnvVars).length - (hasErrors ? 1 : 0)}/${Object.keys(requiredEnvVars).length}`);
  console.log(`⚠️  Optional variables missing: ${warnings.length}`);
  
  if (hasErrors) {
    console.log('\n❌ Environment validation failed!');
    console.log('Please fix the missing or invalid environment variables before deploying.');
    process.exit(1);
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Environment validation passed with warnings.');
    console.log('Consider setting the optional variables for full functionality.');
  } else {
    console.log('\n✅ Environment validation passed!');
  }
  
  console.log('All required environment variables are properly configured.\n');
}

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidStripeKey(varName, key) {
  if (varName === 'STRIPE_SECRET_KEY') {
    return key.startsWith('sk_test_') || key.startsWith('sk_live_');
  }
  if (varName === 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY') {
    return key.startsWith('pk_test_') || key.startsWith('pk_live_');
  }
  if (varName === 'STRIPE_WEBHOOK_SECRET') {
    return key.startsWith('whsec_');
  }
  return true;
}

// Run validation
validateEnvironment();