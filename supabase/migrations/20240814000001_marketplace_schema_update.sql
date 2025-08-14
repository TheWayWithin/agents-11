-- Migration: Update schema to match marketplace technical specification
-- This migration transforms the existing library-focused schema to the new agent marketplace schema

-- Drop existing tables to rebuild with new structure
DROP TRIGGER IF EXISTS update_library_rating_stats_trigger ON public.library_ratings;
DROP TRIGGER IF EXISTS increment_download_count_trigger ON public.downloads;
DROP TRIGGER IF EXISTS update_library_ratings_updated_at ON public.library_ratings;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
DROP TRIGGER IF EXISTS update_libraries_updated_at ON public.libraries;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

DROP TABLE IF EXISTS public.library_ratings CASCADE;
DROP TABLE IF EXISTS public.downloads CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.libraries CASCADE;

-- Drop old enums
DROP TYPE IF EXISTS subscription_tier CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;
DROP TYPE IF EXISTS library_category CASCADE;

-- Create new enums for marketplace
CREATE TYPE subscription_tier AS ENUM ('single', 'library', 'unlimited');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'past_due', 'paused');
CREATE TYPE agent_status AS ENUM ('draft', 'pending_review', 'published', 'suspended');
CREATE TYPE pricing_model AS ENUM ('free', 'paid', 'freemium');
CREATE TYPE access_granted_via AS ENUM ('single', 'library', 'unlimited', 'free');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Update profiles table with new fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS is_developer BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS developer_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  parent_id UUID REFERENCES categories(id),
  sort_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create agents table (replaces libraries)
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  developer_id UUID REFERENCES profiles(id),
  category_id UUID REFERENCES categories(id),
  
  -- Versioning
  current_version TEXT NOT NULL DEFAULT '1.0.0',
  github_repo TEXT NOT NULL,
  installation_command TEXT,
  
  -- Pricing & Access
  pricing_model pricing_model DEFAULT 'free',
  minimum_tier subscription_tier DEFAULT 'single',
  
  -- Metadata
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  icon_url TEXT,
  banner_url TEXT,
  documentation_url TEXT,
  
  -- Stats
  total_installs INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  
  -- Status
  status agent_status DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create libraries table (collections of agents)
CREATE TABLE public.libraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  developer_id UUID REFERENCES profiles(id),
  icon_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create library_agents table (many-to-many relationship)
CREATE TABLE public.library_agents (
  library_id UUID REFERENCES libraries(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (library_id, agent_id)
);

-- Create updated subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  
  -- Subscription details
  tier subscription_tier NOT NULL,
  status subscription_status NOT NULL,
  
  -- For single/library tiers
  agent_id UUID REFERENCES agents(id), -- For single agent subscriptions
  library_id UUID REFERENCES libraries(id), -- For library subscriptions
  
  -- Billing
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create user_agent_access table (derived from subscriptions)
CREATE TABLE public.user_agent_access (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  granted_via access_granted_via NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, agent_id)
);

-- Create agent_installations table (replaces downloads)
CREATE TABLE public.agent_installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  version TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  installed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create reviews table (replaces library_ratings)
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT,
  content TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(agent_id, user_id)
);

-- Create payouts table
CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID REFERENCES profiles(id) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Revenue breakdown
  total_revenue DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL, -- 30%
  net_payout DECIMAL(10,2) NOT NULL, -- 70%
  
  -- Payment details
  stripe_payout_id TEXT,
  status payout_status DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create analytics_events table
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id),
  agent_id UUID REFERENCES agents(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create performance indexes
CREATE INDEX idx_profiles_username ON profiles(username) WHERE username IS NOT NULL;
CREATE INDEX idx_profiles_stripe_customer ON profiles(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX idx_profiles_is_developer ON profiles(is_developer) WHERE is_developer = true;

CREATE INDEX idx_agents_developer ON agents(developer_id);
CREATE INDEX idx_agents_category ON agents(category_id);
CREATE INDEX idx_agents_status ON agents(status) WHERE status = 'published';
CREATE INDEX idx_agents_slug ON agents(slug);
CREATE INDEX idx_agents_pricing_model ON agents(pricing_model);
CREATE INDEX idx_agents_minimum_tier ON agents(minimum_tier);

CREATE INDEX idx_libraries_developer ON libraries(developer_id);
CREATE INDEX idx_libraries_slug ON libraries(slug);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_subscription ON subscriptions(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;
CREATE INDEX idx_subscriptions_status ON subscriptions(status) WHERE status = 'active';
CREATE INDEX idx_subscriptions_agent ON subscriptions(agent_id) WHERE agent_id IS NOT NULL;
CREATE INDEX idx_subscriptions_library ON subscriptions(library_id) WHERE library_id IS NOT NULL;

CREATE INDEX idx_user_agent_access_user ON user_agent_access(user_id);
CREATE INDEX idx_user_agent_access_agent ON user_agent_access(agent_id);
CREATE INDEX idx_user_agent_access_expires ON user_agent_access(expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX idx_installations_agent ON agent_installations(agent_id);
CREATE INDEX idx_installations_user ON agent_installations(user_id);
CREATE INDEX idx_installations_installed_at ON agent_installations(installed_at);

CREATE INDEX idx_reviews_agent ON reviews(agent_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

CREATE INDEX idx_payouts_developer ON payouts(developer_id);
CREATE INDEX idx_payouts_period ON payouts(period_start, period_end);
CREATE INDEX idx_payouts_status ON payouts(status);

CREATE INDEX idx_analytics_events_created ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_analytics_events_agent ON analytics_events(agent_id) WHERE agent_id IS NOT NULL;

-- Recreate updated_at triggers
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at 
  BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_libraries_updated_at 
  BEFORE UPDATE ON libraries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at 
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update agent rating stats
CREATE OR REPLACE FUNCTION update_agent_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE agents
    SET 
      average_rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE agent_id = NEW.agent_id
      ),
      rating_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE agent_id = NEW.agent_id
      )
    WHERE id = NEW.agent_id;
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    UPDATE agents
    SET 
      average_rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE agent_id = OLD.agent_id
      ),
      rating_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE agent_id = OLD.agent_id
      )
    WHERE id = OLD.agent_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for agent rating stats
CREATE TRIGGER update_agent_rating_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_agent_rating_stats();

-- Create function to increment installation count
CREATE OR REPLACE FUNCTION increment_installation_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE agents
  SET total_installs = total_installs + 1
  WHERE id = NEW.agent_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for installation count
CREATE TRIGGER increment_installation_count_trigger
  AFTER INSERT ON agent_installations
  FOR EACH ROW EXECUTE FUNCTION increment_installation_count();

-- Insert default categories
INSERT INTO categories (slug, name, description, icon, sort_order) VALUES
('automation', 'Automation', 'Agents that automate repetitive tasks and workflows', 'Zap', 1),
('data-processing', 'Data Processing', 'Agents for data analysis, transformation, and insights', 'Database', 2),
('communication', 'Communication', 'Agents for messaging, notifications, and team coordination', 'MessageSquare', 3),
('development', 'Development', 'Agents for code generation, testing, and development workflows', 'Code', 4),
('marketing', 'Marketing', 'Agents for content creation, social media, and marketing automation', 'Megaphone', 5),
('productivity', 'Productivity', 'Agents that enhance personal and team productivity', 'Clock', 6),
('integration', 'Integration', 'Agents that connect different services and platforms', 'Link', 7),
('utilities', 'Utilities', 'General purpose utility agents and tools', 'Settings', 8);

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE agents IS 'AI agents published by developers';
COMMENT ON TABLE libraries IS 'Collections of related agents';
COMMENT ON TABLE subscriptions IS 'User subscription records linked to Stripe';
COMMENT ON TABLE user_agent_access IS 'Tracks which agents users can access based on subscriptions';
COMMENT ON TABLE agent_installations IS 'Log of agent installations/downloads';
COMMENT ON TABLE reviews IS 'User reviews and ratings for agents';
COMMENT ON TABLE payouts IS 'Developer payout records';
COMMENT ON TABLE analytics_events IS 'Event tracking for analytics and A/B testing';