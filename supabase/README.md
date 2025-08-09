# Supabase Database Setup

This directory contains the complete database schema and configuration for the Agents-11 Marketplace.

## Overview

The database schema includes:

- User profiles with enhanced metadata
- Libraries with tier-based access control
- Subscription management with Stripe integration
- Download tracking and analytics
- Rating and review system
- Row Level Security (RLS) for data protection

## Prerequisites

1. **Supabase Account**: Create a project at [supabase.com](https://supabase.com)
2. **Supabase CLI**: Install the Supabase CLI
   ```bash
   npm install -g supabase
   ```
3. **Environment Variables**: Set up your environment variables

## Setup Instructions

### 1. Initialize Supabase (if not already done)

```bash
# Login to Supabase
supabase login

# Initialize in your project (if not already done)
supabase init
```

### 2. Link to your Supabase project

```bash
# Link to your remote project
supabase link --project-ref YOUR_PROJECT_ID
```

### 3. Apply Database Migrations

Run the migrations in order to set up your database:

```bash
# Apply all migrations
supabase db push

# Or apply migrations individually
supabase migration up
```

### 4. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Price IDs for subscription tiers
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Generate TypeScript Types (Optional)

Generate up-to-date TypeScript types from your database:

```bash
# Generate types
supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase-generated.ts
```

## Database Schema

### Core Tables

1. **profiles** - Extended user profiles
   - Links to auth.users
   - Additional metadata (username, bio, website, etc.)
   - Auto-created on user registration

2. **libraries** - Agent libraries
   - Tier-based access control
   - Author relationships
   - Download counting and ratings
   - Publishing workflow

3. **subscriptions** - User subscriptions
   - Stripe integration
   - Tier-based access levels
   - Automatic expiration handling

4. **downloads** - Download tracking
   - User download history
   - Analytics data
   - Access control enforcement

5. **library_ratings** - User ratings and reviews
   - 1-5 star ratings
   - Optional text reviews
   - Automatic aggregate calculation

### Access Control Features

- **Row Level Security (RLS)** enabled on all tables
- **Tier-based access**: Basic, Pro, Enterprise
- **Function-based access control**: `user_can_access_library()`
- **Admin privileges**: Special access for admin users
- **View for simplified queries**: `user_library_access`

### Subscription Tiers

| Tier       | Price     | Features                                  |
| ---------- | --------- | ----------------------------------------- |
| Basic      | $9.95/mo  | Basic libraries, 10 downloads/month       |
| Pro        | $19.95/mo | Basic + Pro libraries, 50 downloads/month |
| Enterprise | $39.95/mo | All libraries, unlimited downloads        |

## Data Flow

1. **User Registration**
   - User signs up via Supabase Auth
   - Trigger creates profile automatically
   - User can update profile information

2. **Library Access**
   - User browses published libraries
   - Access determined by subscription tier
   - Downloads tracked for analytics

3. **Subscription Management**
   - Stripe handles payment processing
   - Webhook updates subscription status
   - Access automatically granted/revoked

## Security Features

### Row Level Security Policies

- Users can only see their own private data
- Published libraries are publicly viewable
- Downloads require active subscription
- Admins have override access

### Access Control Functions

```sql
-- Check if user can access a library
SELECT user_can_access_library(user_id, library_id);

-- Check if user is admin
SELECT is_admin();
```

## Development Workflow

### 1. Making Schema Changes

```bash
# Create a new migration
supabase migration new migration_name

# Edit the migration file in supabase/migrations/
# Apply the migration
supabase db push
```

### 2. Testing Migrations

```bash
# Reset database to clean state
supabase db reset

# Apply all migrations from scratch
supabase db push
```

### 3. Seeding Data

Create seed data for development:

```bash
# Add to supabase/seed.sql
# Run seeds
supabase db reset --with-seed
```

## Backup and Recovery

### Backup

```bash
# Backup your database
supabase db dump -f backup.sql
```

### Recovery

```bash
# Restore from backup
supabase db reset
psql -h YOUR_DB_HOST -U postgres -d postgres -f backup.sql
```

## Monitoring and Analytics

The schema includes several features for monitoring:

- Download tracking with IP and user agent
- Subscription status monitoring
- Library performance metrics
- User engagement analytics

## Common Operations

### Add New Admin User

Update the `is_admin()` function in migration `20240101000003_rls_policies.sql`:

```sql
create or replace function public.is_admin()
returns boolean
language sql
security definer
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
    and email in (
      'admin@agents11.com',
      'jamie@agents11.com',
      'new-admin@agents11.com'  -- Add new admin email here
    )
  );
$$;
```

### Update Subscription Pricing

Update the pricing in `/lib/validations/subscription.ts` and your Stripe dashboard.

## Troubleshooting

### Common Issues

1. **Migration Errors**
   - Check for syntax errors in SQL
   - Ensure proper order of operations
   - Verify foreign key relationships

2. **RLS Policy Issues**
   - Test policies with different user roles
   - Check auth.uid() returns expected values
   - Verify policy conditions

3. **Type Mismatches**
   - Regenerate TypeScript types after schema changes
   - Check enum values match between code and database

### Useful Queries

```sql
-- Check active subscriptions
SELECT u.email, s.tier, s.status, s.current_period_end
FROM subscriptions s
JOIN profiles u ON s.user_id = u.id
WHERE s.status = 'active';

-- Library download stats
SELECT l.name, l.download_count, l.rating, l.rating_count
FROM libraries l
WHERE l.published = true
ORDER BY l.download_count DESC;

-- User access summary
SELECT * FROM user_library_access
WHERE user_id = 'user-uuid-here'
LIMIT 10;
```

## Support

For issues with the database schema or Supabase setup:

1. Check the Supabase documentation
2. Review the migration files for schema details
3. Test queries in the Supabase SQL editor
4. Check logs in the Supabase dashboard
