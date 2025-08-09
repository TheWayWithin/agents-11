# Stripe Payment Integration Setup Guide

This guide will help you set up and test the Stripe payment integration for the Agents-11 Marketplace.

## Prerequisites

1. **Stripe Account**: Create a free Stripe account at [stripe.com](https://stripe.com)
2. **Stripe CLI**: Install the Stripe CLI for webhook testing
3. **Environment Variables**: Configure your `.env.local` file

## Step 1: Stripe Dashboard Configuration

### Create Products and Prices

1. Log into your Stripe Dashboard
2. Go to **Products** → **Add Product**
3. Create three recurring products:

#### Starter Plan

- **Name**: Starter
- **Price**: $9.95/month
- **Billing**: Recurring monthly
- **Copy the Price ID** (starts with `price_`) to `STRIPE_STARTER_PRICE_ID`

#### Professional Plan

- **Name**: Professional
- **Price**: $19.95/month
- **Billing**: Recurring monthly
- **Copy the Price ID** to `STRIPE_PROFESSIONAL_PRICE_ID`

#### Unlimited Plan

- **Name**: Unlimited
- **Price**: $39.95/month
- **Billing**: Recurring monthly
- **Copy the Price ID** to `STRIPE_UNLIMITED_PRICE_ID`

### Configure Billing Portal

1. Go to **Settings** → **Billing**
2. **Configure Customer Portal**:
   - Enable customer portal
   - Allow customers to update payment methods
   - Allow customers to cancel subscriptions
   - Set invoice PDF generation
   - Configure branding (optional)

### Get API Keys

1. Go to **Developers** → **API Keys**
2. Copy your **Publishable key** to `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copy your **Secret key** to `STRIPE_SECRET_KEY`

## Step 2: Environment Configuration

Create a `.env.local` file in your project root:

```bash
# Copy from .env.local.example and fill in your values

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...
STRIPE_UNLIMITED_PRICE_ID=price_...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 3: Webhook Configuration

### Option A: Local Development with Stripe CLI

1. **Install Stripe CLI**:

   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Or download from https://github.com/stripe/stripe-cli/releases
   ```

2. **Login to Stripe**:

   ```bash
   stripe login
   ```

3. **Forward webhooks to local server**:

   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhooks
   ```

4. **Copy webhook secret** from CLI output to `STRIPE_WEBHOOK_SECRET`

### Option B: Production Webhook Endpoint

1. Deploy your app to production
2. Go to **Developers** → **Webhooks** in Stripe Dashboard
3. **Add endpoint**: `https://yourdomain.com/api/stripe/webhooks`
4. **Select events**:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.trial_will_end`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** to `STRIPE_WEBHOOK_SECRET`

## Step 4: Database Migration

Ensure your Supabase database has the correct subscription tier values. The database schema uses:

- `basic` (maps to "Starter" plan)
- `pro` (maps to "Professional" plan)
- `enterprise` (maps to "Unlimited" plan)

## Step 5: Testing

### Test Payment Flow

1. **Start your development server**:

   ```bash
   npm run dev
   ```

2. **Start Stripe webhook forwarding** (in separate terminal):

   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhooks
   ```

3. **Visit pricing page**: `http://localhost:3000/pricing`

4. **Test checkout process**:
   - Click "Get Started" on any plan
   - Use test card numbers:
     - **Success**: `4242 4242 4242 4242`
     - **Declined**: `4000 0000 0000 0002`
     - **3D Secure**: `4000 0025 0000 3155`
   - Use any future expiration date and any 3-digit CVC

### Test Webhook Events

1. **Complete a subscription** to trigger webhooks
2. **Check webhook logs**:

   ```bash
   # In your webhook terminal
   # You should see events being received and processed
   ```

3. **Verify database updates**:
   - Check that subscription is created in Supabase
   - Verify user tier is updated correctly

### Test Subscription Management

1. **Access billing portal**:
   - Go to dashboard after subscribing
   - Click "Manage Subscription"
   - Update payment method, cancel subscription, etc.

2. **Test subscription changes**:
   - Upgrade/downgrade plans
   - Cancel subscription
   - Update payment method

### Test Library Access

1. **Verify access control**:
   - Starter: Can access basic tier libraries
   - Professional: Can access basic + pro tier libraries
   - Unlimited: Can access all tier libraries

## Troubleshooting

### Common Issues

1. **Webhook signature verification failed**:
   - Ensure `STRIPE_WEBHOOK_SECRET` matches CLI output
   - Check webhook endpoint URL is correct

2. **Price ID not found**:
   - Verify price IDs are copied correctly from Stripe Dashboard
   - Ensure products are in "Live" mode for production

3. **Database permission errors**:
   - Check Supabase RLS policies
   - Verify service role key has proper permissions

4. **Checkout session creation fails**:
   - Check all required environment variables are set
   - Verify Stripe keys are for correct environment (test/live)

### Logs and Debugging

1. **Check application logs**: `npm run dev` output
2. **Check Stripe webhook logs**: Stripe CLI output
3. **Check Supabase logs**: Supabase dashboard logs
4. **Check browser network tab**: For API request/response details

## Production Deployment

Before going live:

1. **Switch to live Stripe keys**
2. **Update webhook endpoint** to production URL
3. **Test with real payment method** (start with small amount)
4. **Set up monitoring** for failed payments and webhooks
5. **Configure email notifications** for subscription events

## Security Considerations

1. **Environment variables**: Never expose secret keys in frontend code
2. **Webhook signature verification**: Always verify webhook authenticity
3. **Database security**: Use RLS policies and proper permissions
4. **Error handling**: Don't expose sensitive error details to users
5. **Logging**: Log important events but not sensitive data

## Support

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe CLI Reference**: https://stripe.com/docs/cli
- **Test Card Numbers**: https://stripe.com/docs/testing#cards
- **Webhook Testing**: https://stripe.com/docs/webhooks/test
