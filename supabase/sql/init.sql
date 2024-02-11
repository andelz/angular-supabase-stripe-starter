
-- TABLES ---------------------------------------
-- ----------------------------------------------
drop table if exists user_profile;
drop table if exists customer;

-- USER PROFILE ---------------------------------
-- This table contains user data. Users should only be able to view and update their own data.
create table user_profile (
  id uuid primary key references auth.users on delete cascade not null,
  email text,
  username text,
  avatar_url text,
  subscribed text
);
alter table user_profile enable row level security;
create policy "Can view own user data." on public.user_profile for select to authenticated using (auth.uid() = id);
create policy "Can update own user data." on public.user_profile for update to authenticated using (auth.uid() = id);

 
-- CUSTOMERS ------------------------------------
-- Customer table that maps auth.user to a stripe user 
create table customer (
  id uuid primary key references auth.users on delete cascade not null,
  stripe_customer_id text,
  subscription_id text,
  lookup_key text
);
alter table customer enable row level security;


-- DATABASE FUNCTIONS AND TRIGGERS --------------
-- ----------------------------------------------
-- Create a new entry in 'public.user_profile' each time a new user signs up
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.user_profile (id, username, avatar_url, email)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    new.raw_user_meta_data->>'email'
    );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------
-- update user profile entry each time the subscription state changes  
create or replace function public.handle_subscription_change() 
returns trigger as $$
begin
  update public.user_profile 
  set subscribed = new.lookup_key
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_subscription_changed
  after update on public.customer
  for each row execute function public.handle_subscription_change();

-- ----------------------------------------------
-- create db function to check whether or not user is subscribed for use in eg. RLS rules
create or replace function check_user_subscribed (user_id uuid)
returns bool as $$
  select exists (
    select id from customer where (id = $1) AND subscription_id is not null
  )
$$ language sql security definer;