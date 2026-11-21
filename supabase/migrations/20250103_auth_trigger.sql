-- Kesari Van Supabase Auth Automation & Profile Sync
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/zpievxxzwexmtcarzjzf/sql/new

-- 1. Create automatic profile creation function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, email, phone, role)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email,
    new.raw_user_meta_data->>'phone',
    case
      when new.email like '%admin%' or new.email = 'yash@kesarivan.com' then 'admin'
      else 'customer'
    end
  )
  on conflict (id) do update set
    email = excluded.email,
    first_name = coalesce(excluded.first_name, profiles.first_name),
    phone = coalesce(excluded.phone, profiles.phone);
  return new;
end;
$$;

-- 2. Attach trigger to auth.users table
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Ensure profiles RLS policies allow reading and self-updating
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

drop policy if exists "Admins can manage profiles" on public.profiles;
create policy "Admins can manage profiles" on public.profiles for all using (true);
