export const testUsers = {
  new: {
    fullName: 'John Doe',
    email: `test+${Date.now()}@example.com`,
    password: 'TestPassword123!',
  },
  existing: {
    email: 'existing@example.com', 
    password: 'ExistingPassword123!',
  },
} as const;

export const mockLibraryData = {
  agent11: {
    name: 'Agent-11',
    slug: 'agent-11',
    price: 299,
    tier: 'pro',
  },
  empire11: {
    name: 'Empire-11', 
    slug: 'empire-11',
    price: 999,
    tier: 'enterprise',
  },
} as const;

export const subscriptionTiers = {
  pro: {
    name: 'Professional',
    price: 97,
    features: ['Access to Agent-11', 'Premium Support', 'Commercial License'],
  },
  enterprise: {
    name: 'Enterprise',
    price: 297,
    features: ['Everything in Pro', 'Empire-11 Access', 'Priority Support', 'Custom Integration'],
  },
} as const;