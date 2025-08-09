-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.libraries enable row level security;
alter table public.subscriptions enable row level security;
alter table public.downloads enable row level security;
alter table public.library_ratings enable row level security;

-- Profiles policies
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Public profiles are viewable by authenticated users" on public.profiles
  for select using (auth.role() = 'authenticated');

-- Libraries policies
create policy "Published libraries are viewable by everyone" on public.libraries
  for select using (published = true);

create policy "Authors can view their own unpublished libraries" on public.libraries
  for select using (auth.uid() = author_id);

create policy "Authors can insert new libraries" on public.libraries
  for insert with check (auth.uid() = author_id);

create policy "Authors can update their own libraries" on public.libraries
  for update using (auth.uid() = author_id);

create policy "Authors can delete their own libraries" on public.libraries
  for delete using (auth.uid() = author_id);

-- Subscriptions policies
create policy "Users can view their own subscriptions" on public.subscriptions
  for select using (auth.uid() = user_id);

create policy "Users can insert their own subscriptions" on public.subscriptions
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own subscriptions" on public.subscriptions
  for update using (auth.uid() = user_id);

-- Downloads policies
create policy "Users can view their own downloads" on public.downloads
  for select using (auth.uid() = user_id);

create policy "Users can download libraries they have access to" on public.downloads
  for insert with check (
    auth.uid() = user_id and
    public.user_can_access_library(auth.uid(), library_id)
  );

-- Library ratings policies
create policy "All authenticated users can view ratings" on public.library_ratings
  for select using (auth.role() = 'authenticated');

create policy "Users can rate libraries they have access to" on public.library_ratings
  for insert with check (
    auth.uid() = user_id and
    public.user_can_access_library(auth.uid(), library_id)
  );

create policy "Users can update their own ratings" on public.library_ratings
  for update using (auth.uid() = user_id);

create policy "Users can delete their own ratings" on public.library_ratings
  for delete using (auth.uid() = user_id);

-- Additional security functions
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
      'jamie@agents11.com'
    )
  );
$$;

-- Admin policies for managing content
create policy "Admins can do everything on libraries" on public.libraries
  for all using (public.is_admin());

create policy "Admins can view all profiles" on public.profiles
  for select using (public.is_admin());

create policy "Admins can view all subscriptions" on public.subscriptions
  for select using (public.is_admin());

create policy "Admins can view all downloads" on public.downloads
  for select using (public.is_admin());

-- Create indexes for RLS performance
create index if not exists idx_profiles_auth_id on public.profiles(id);
create index if not exists idx_libraries_author_published on public.libraries(author_id, published);
create index if not exists idx_subscriptions_user_status on public.subscriptions(user_id, status);
create index if not exists idx_downloads_user_library on public.downloads(user_id, library_id);
create index if not exists idx_library_ratings_user_library on public.library_ratings(user_id, library_id);