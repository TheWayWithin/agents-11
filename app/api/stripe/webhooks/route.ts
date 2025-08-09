import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import {
  stripe,
  STRIPE_WEBHOOK_SECRET,
  HANDLED_WEBHOOK_EVENTS,
} from '@/lib/stripe/stripe';
import {
  upsertSubscription,
  cancelSubscriptionInDB,
  parseStripeSubscription,
} from '@/lib/stripe/subscription';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Only process events we care about
    if (!HANDLED_WEBHOOK_EVENTS.includes(event.type as any)) {
      console.log(`Ignoring unhandled event type: ${event.type}`);
      return NextResponse.json({ received: true });
    }

    console.log(`Processing webhook: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionUpdate(event: any) {
  const subscription = event.data.object;
  const customerId = subscription.customer;

  // Find user by customer ID
  const userId = await getUserIdFromCustomer(customerId);
  if (!userId) {
    console.error(`No user found for customer: ${customerId}`);
    return;
  }

  try {
    const subscriptionData = parseStripeSubscription(subscription);
    await upsertSubscription(userId, subscriptionData);
    console.log(`Subscription updated for user: ${userId}`);
  } catch (error) {
    console.error('Failed to update subscription:', error);
    throw error;
  }
}

async function handleSubscriptionDeleted(event: any) {
  const subscription = event.data.object;

  try {
    await cancelSubscriptionInDB(subscription.id);
    console.log(`Subscription canceled: ${subscription.id}`);
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    throw error;
  }
}

async function handleTrialWillEnd(event: any) {
  const subscription = event.data.object;
  const customerId = subscription.customer;

  const userId = await getUserIdFromCustomer(customerId);
  if (!userId) {
    console.error(`No user found for customer: ${customerId}`);
    return;
  }

  // TODO: Send trial ending notification email
  console.log(`Trial ending soon for user: ${userId}`);
}

async function handlePaymentSucceeded(event: any) {
  const invoice = event.data.object;
  const subscriptionId = invoice.subscription;

  if (subscriptionId) {
    // Refresh subscription data to ensure it's up to date
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const customerId = subscription.customer as string;

    const userId = await getUserIdFromCustomer(customerId);
    if (userId) {
      const subscriptionData = parseStripeSubscription(subscription);
      await upsertSubscription(userId, subscriptionData);
      console.log(
        `Payment succeeded and subscription updated for user: ${userId}`
      );
    }
  }
}

async function handlePaymentFailed(event: any) {
  const invoice = event.data.object;
  const subscriptionId = invoice.subscription;
  const customerId = invoice.customer;

  const userId = await getUserIdFromCustomer(customerId);
  if (!userId) {
    console.error(`No user found for customer: ${customerId}`);
    return;
  }

  if (subscriptionId) {
    // Update subscription status to reflect payment failure
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const subscriptionData = parseStripeSubscription(subscription);
    await upsertSubscription(userId, subscriptionData);
  }

  // TODO: Send payment failed notification email
  console.log(`Payment failed for user: ${userId}`);
}

async function getUserIdFromCustomer(
  customerId: string
): Promise<string | null> {
  try {
    // First try to get from Stripe customer metadata
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer.deleted && customer.metadata.userId) {
      return customer.metadata.userId;
    }

    // If not in metadata, try to find in our database
    const supabase = createSupabaseServerClient();
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();

    return subscription?.user_id || null;
  } catch (error) {
    console.error('Failed to get user ID from customer:', error);
    return null;
  }
}
