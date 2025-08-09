-- Create user_library_access view for simplified access control queries
create or replace view public.user_library_access as
select 
  l.id as library_id,
  l.name as library_name,
  l.slug,
  l.description,
  l.category,
  l.tier_required,
  l.published,
  l.featured,
  l.download_count,
  l.rating,
  l.rating_count,
  l.created_at as library_created_at,
  l.author_id,
  author.full_name as author_name,
  author.username as author_username,
  u.id as user_id,
  u.email as user_email,
  s.id as subscription_id,
  s.tier as user_tier,
  s.status as subscription_status,
  s.current_period_end,
  case 
    -- Always allow access to basic tier libraries if user is authenticated
    when l.tier_required = 'basic' then true
    -- Allow access if user has active subscription with required tier or higher
    when s.status = 'active' and s.current_period_end > now() then
      case 
        when s.tier = 'enterprise' then true -- enterprise has access to everything
        when s.tier = 'pro' and l.tier_required in ('basic', 'pro') then true
        when s.tier = 'basic' and l.tier_required = 'basic' then true
        else false
      end
    else false
  end as has_access,
  -- Check if user has already downloaded this library
  exists(
    select 1 from public.downloads d 
    where d.user_id = u.id and d.library_id = l.id
  ) as has_downloaded
from public.libraries l
left join public.profiles author on l.author_id = author.id
cross join public.profiles u
left join public.subscriptions s on u.id = s.user_id 
  and s.status = 'active' 
  and s.current_period_end > now()
where l.published = true;

-- Create a simplified function to check library access for a specific user
create or replace function public.user_can_access_library(
  p_user_id uuid,
  p_library_id uuid
) returns boolean
language plpgsql
security definer
as $$
declare
  v_tier_required subscription_tier;
  v_user_tier subscription_tier;
  v_subscription_active boolean;
begin
  -- Get the required tier for the library
  select tier_required into v_tier_required
  from public.libraries
  where id = p_library_id and published = true;
  
  if not found then
    return false; -- Library doesn't exist or is not published
  end if;
  
  -- Basic tier libraries are always accessible to authenticated users
  if v_tier_required = 'basic' then
    return true;
  end if;
  
  -- Check user's subscription
  select 
    tier,
    status = 'active' and current_period_end > now()
  into v_user_tier, v_subscription_active
  from public.subscriptions
  where user_id = p_user_id
    and status = 'active'
    and current_period_end > now()
  order by 
    case tier
      when 'enterprise' then 3
      when 'pro' then 2
      when 'basic' then 1
    end desc
  limit 1;
  
  if not found or not v_subscription_active then
    return false; -- No active subscription
  end if;
  
  -- Check tier access
  return case
    when v_user_tier = 'enterprise' then true
    when v_user_tier = 'pro' and v_tier_required in ('basic', 'pro') then true
    when v_user_tier = 'basic' and v_tier_required = 'basic' then true
    else false
  end;
end;
$$;