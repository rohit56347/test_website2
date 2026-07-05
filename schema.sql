-- ==========================================
-- AEROSOUND SINGLE PRODUCT STOREFRONT SCHEMA
-- ==========================================

-- 1. EXTENSIONS
-- Enable uuid-ossp if not already enabled
create extension if not exists "uuid-ossp";

-- 2. PRODUCTS TABLE
create table if not exists public.products (
    id text primary key,
    name text not null,
    description text not null,
    price numeric not null check (price >= 0),
    image_url text not null,
    stock_quantity integer not null default 0 check (stock_quantity >= 0),
    specs jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed Default Product
insert into public.products (id, name, description, price, image_url, stock_quantity, specs)
values (
    'aerosound-x1',
    'AeroSound X1 Wireless Headphones',
    'Experience absolute sonic purity. The AeroSound X1 combines state-of-the-art hybrid Active Noise Cancellation with precision-tuned 40mm dynamic drivers to deliver an immersive, studio-grade listening experience.',
    2499,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    125,
    '{
        "battery_life": "Up to 45 hours (ANC off) / 30 hours (ANC on)",
        "driver_size": "40mm High-Resolution Dynamic Drivers",
        "connectivity": "Bluetooth 5.3 & Ultra-Low Latency USB-C Audio",
        "noise_cancelling": "Hybrid Active Noise Cancelling (up to -42dB)",
        "weight": "250g Ultra-Comfort Design"
    }'::jsonb
)
on conflict (id) do nothing;


-- 3. CUSTOMERS TABLE
create table if not exists public.customers (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text unique not null,
    phone text not null,
    address text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 4. ORDERS TABLE
create table if not exists public.orders (
    id uuid default gen_random_uuid() primary key,
    customer_id uuid references public.customers(id) on delete cascade not null,
    product_id text references public.products(id) on delete restrict not null,
    quantity integer not null check (quantity > 0),
    total_amount numeric not null check (total_amount >= 0),
    status text not null default 'pending' check (status in ('pending', 'paid', 'shipped', 'cancelled')),
    payment_method text not null default 'cod' check (payment_method = 'cod'),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 5. ADMINS WHITELIST TABLE
-- This table whitelists which Supabase Auth users have admin privileges
create table if not exists public.admins (
    id uuid references auth.users(id) on delete cascade primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

-- Enable Row Level Security on all tables
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.admins enable row level security;

-- Helper function to check if the current request user is an admin
create or replace function public.is_admin()
returns boolean security definer as $$
begin
  return exists (
    select 1 from public.admins where id = auth.uid()
  );
end;
$$ language plpgsql;


-- --- PRODUCTS POLICIES ---
-- 1. Anyone (public storefront) can select products
create policy "Allow public read access to products"
on public.products for select
using (true);

-- 2. Only whitelisted admins can insert or update products
create policy "Allow admins to insert products"
on public.products for insert
with check (public.is_admin());

create policy "Allow admins to update products"
on public.products for update
using (public.is_admin())
with check (public.is_admin());


-- --- CUSTOMERS POLICIES ---
-- 1. Anonymous users can create/insert a customer record during checkout
create policy "Allow public to create customer record"
on public.customers for insert
with check (true);

-- 2. Only admins can view customer lists
create policy "Allow admins to view customer records"
on public.customers for select
using (public.is_admin());

-- 3. Only admins can update customer records
create policy "Allow admins to update customer records"
on public.customers for update
using (public.is_admin())
with check (public.is_admin());


-- --- ORDERS POLICIES ---
-- 1. Anonymous users can create/insert an order during checkout
create policy "Allow public to create orders"
on public.orders for insert
with check (true);

-- 2. Only admins can view orders
create policy "Allow admins to view orders"
on public.orders for select
using (public.is_admin());

-- 3. Only admins can update orders (e.g. status updates)
create policy "Allow admins to update orders"
on public.orders for update
using (public.is_admin())
with check (public.is_admin());


-- --- ADMINS POLICIES ---
-- 1. Admins can view the whitelist
create policy "Allow admins to view admin whitelist"
on public.admins for select
using (public.is_admin());


-- ========================================================
-- INSTRUCTIONS: HOW TO ADD THE FIRST ADMIN USER
-- ========================================================
--
-- Since Row Level Security requires users to be in the `admins` table to manage data:
--
-- Step 1: Register an account in Supabase Auth (using your storefront's admin login form
--         or the Supabase Auth Dashboard). Let's say the registered user gets a UUID of
--         '11111111-2222-3333-4444-555555555555'.
--
-- Step 2: Whitelist this user as an admin by running the following SQL in the
--         Supabase SQL Editor:
--
--         INSERT INTO public.admins (id)
--         VALUES ('your-user-uuid-here');
--
-- Note: Replace 'your-user-uuid-here' with the actual UUID of the user created in Step 1.
-- You can find this in the Supabase Dashboard under Authentication -> Users.
