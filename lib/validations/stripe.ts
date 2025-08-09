import { z } from 'zod';

export const checkoutRequestSchema = z.object({
  tier: z.enum(['basic', 'pro', 'enterprise']),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export const portalRequestSchema = z.object({
  returnUrl: z.string().url().optional(),
});

export const webhookEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.any(),
  }),
  created: z.number(),
});

export const subscriptionMetadataSchema = z.object({
  userId: z.string().uuid(),
  tier: z.enum(['basic', 'pro', 'enterprise']),
});

export type CheckoutRequestSchema = z.infer<typeof checkoutRequestSchema>;
export type PortalRequestSchema = z.infer<typeof portalRequestSchema>;
export type WebhookEventSchema = z.infer<typeof webhookEventSchema>;
export type SubscriptionMetadataSchema = z.infer<
  typeof subscriptionMetadataSchema
>;
