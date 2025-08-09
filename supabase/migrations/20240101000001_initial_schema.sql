-- Enable RLS
alter table auth.users enable row level security;

-- Create custom types
create type subscription_tier as enum ('basic', 'pro', 'enterprise');
create type subscription_status as enum ('active', 'canceled', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired', 'trialing');
create type library_category as enum ('data_processing', 'automation', 'analysis', 'integration', 'communication', 'utilities', 'other');

-- Create profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  username text unique,
  bio text,
  website text,
  location text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create libraries table
create table public.libraries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text not null,
  long_description text,
  category library_category not null default 'other',
  tier_required subscription_tier not null default 'basic',
  version text not null default '1.0.0',
  download_url text not null,
  file_size bigint, -- in bytes
  tags text[] default array[]::text[],
  author_id uuid references public.profiles(id) on delete set null,
  featured boolean default false,
  published boolean default false,
  download_count integer default 0,
  rating numeric(3,2) default 0.0,
  rating_count integer default 0,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  published_at timestamp with time zone
);

-- Create subscriptions table
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  stripe_subscription_id text unique not null,
  stripe_customer_id text not null,
  tier subscription_tier not null,
  status subscription_status not null,
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  cancel_at_period_end boolean default false,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create downloads table
create table public.downloads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  library_id uuid references public.libraries(id) on delete cascade not null,
  downloaded_at timestamp with time zone default now() not null,
  ip_address inet,
  user_agent text
);

-- Create library_ratings table
create table public.library_ratings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  library_id uuid references public.libraries(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  review text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  unique(user_id, library_id)
);

-- Create indexes for better performance
create index idx_profiles_username on public.profiles(username);
create index idx_profiles_email on public.profiles(email);
create index idx_libraries_slug on public.libraries(slug);
create index idx_libraries_category on public.libraries(category);
create index idx_libraries_tier_required on public.libraries(tier_required);
create index idx_libraries_published on public.libraries(published);
create index idx_libraries_featured on public.libraries(featured);
create index idx_libraries_author_id on public.libraries(author_id);
create index idx_subscriptions_user_id on public.subscriptions(user_id);
create index idx_subscriptions_stripe_subscription_id on public.subscriptions(stripe_subscription_id);
create index idx_subscriptions_status on public.subscriptions(status);
create index idx_downloads_user_id on public.downloads(user_id);
create index idx_downloads_library_id on public.downloads(library_id);
create index idx_downloads_downloaded_at on public.downloads(downloaded_at);
create index idx_library_ratings_user_id on public.library_ratings(user_id);
create index idx_library_ratings_library_id on public.library_ratings(library_id);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at_column();

create trigger update_libraries_updated_at before update on public.libraries
  for each row execute function update_updated_at_column();

create trigger update_subscriptions_updated_at before update on public.subscriptions
  for each row execute function update_updated_at_column();

create trigger update_library_ratings_updated_at before update on public.library_ratings
  for each row execute function update_updated_at_column();

-- Create function to handle new user registration
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );
  return new;
end;
$$;

-- Create trigger for new user registration
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update library rating stats
create or replace function update_library_rating_stats()
returns trigger as $$
begin
  if TG_OP = 'INSERT' or TG_OP = 'UPDATE' then
    update public.libraries
    set 
      rating = (
        select coalesce(avg(rating), 0)
        from public.library_ratings
        where library_id = NEW.library_id
      ),
      rating_count = (
        select count(*)
        from public.library_ratings
        where library_id = NEW.library_id
      )
    where id = NEW.library_id;
    return NEW;
  end if;
  
  if TG_OP = 'DELETE' then
    update public.libraries
    set 
      rating = (
        select coalesce(avg(rating), 0)
        from public.library_ratings
        where library_id = OLD.library_id
      ),
      rating_count = (
        select count(*)
        from public.library_ratings
        where library_id = OLD.library_id
      )
    where id = OLD.library_id;
    return OLD;
  end if;
  
  return null;
end;
$$ language plpgsql;

-- Create trigger for library rating stats
create trigger update_library_rating_stats_trigger
  after insert or update or delete on public.library_ratings
  for each row execute function update_library_rating_stats();

-- Create function to increment download count
create or replace function increment_download_count()
returns trigger as $$
begin
  update public.libraries
  set download_count = download_count + 1
  where id = NEW.library_id;
  return NEW;
end;
$$ language plpgsql;

-- Create trigger for download count
create trigger increment_download_count_trigger
  after insert on public.downloads
  for each row execute function increment_download_count();