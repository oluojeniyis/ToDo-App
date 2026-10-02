create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamp without time zone not null default timezone('utc'::text, now()),
  updated_at timestamp without time zone not null default timezone('utc'::text, now())
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  slug text not null unique,
  name text not null,
  category text not null check (category in ('wholesale-blanks', 'retail-polos', 'bespoke-mesh', 'accessories')),
  description text not null default '',
  price numeric(12, 2) not null check (price >= 0),
  currency text not null default 'NGN' check (currency ~ '^[A-Z]{3}$'),
  sizes text[] not null default '{}',
  colors jsonb not null default '[]'::jsonb check (jsonb_typeof(colors) = 'array'),
  mesh_placements text[] not null default array['none']::text[],
  sales_units jsonb not null default '[]'::jsonb check (jsonb_typeof(sales_units) = 'array'),
  created_at timestamp without time zone not null default timezone('utc'::text, now()),
  updated_at timestamp without time zone not null default timezone('utc'::text, now())
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'pending', 'processing', 'fulfilled', 'cancelled')),
  currency text not null default 'NGN' check (currency ~ '^[A-Z]{3}$'),
  subtotal numeric(12, 2) not null default 0 check (subtotal >= 0),
  total numeric(12, 2) not null default 0 check (total >= 0),
  created_at timestamp without time zone not null default timezone('utc'::text, now()),
  updated_at timestamp without time zone not null default timezone('utc'::text, now())
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  size text not null,
  color text not null,
  mesh_placement text not null default 'none',
  sales_unit_label text not null,
  sales_unit_quantity integer not null default 1 check (sales_unit_quantity > 0),
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  created_at timestamp without time zone not null default timezone('utc'::text, now())
);

create index orders_user_id_created_at_idx on public.orders (user_id, created_at desc);
create index order_items_order_id_idx on public.order_items (order_id);

create or replace function public.set_updated_at_utc()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := timezone('utc'::text, now());
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at_utc();

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at_utc();

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at_utc();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Public can read products"
  on public.products for select
  to anon, authenticated
  using (true);

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);
create policy "Users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
create policy "Users can delete their own profile"
  on public.profiles for delete
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can read their own orders"
  on public.orders for select
  to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can create their own orders"
  on public.orders for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users can update their own orders"
  on public.orders for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users can delete their own orders"
  on public.orders for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can read their own order items"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders as owned_order
      where owned_order.id = order_items.order_id
        and owned_order.user_id = (select auth.uid())
    )
  );
create policy "Users can create their own order items"
  on public.order_items for insert
  to authenticated
  with check (
    exists (
      select 1 from public.orders as owned_order
      where owned_order.id = order_items.order_id
        and owned_order.user_id = (select auth.uid())
    )
  );
create policy "Users can update their own order items"
  on public.order_items for update
  to authenticated
  using (
    exists (
      select 1 from public.orders as owned_order
      where owned_order.id = order_items.order_id
        and owned_order.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.orders as owned_order
      where owned_order.id = order_items.order_id
        and owned_order.user_id = (select auth.uid())
    )
  );
create policy "Users can delete their own order items"
  on public.order_items for delete
  to authenticated
  using (
    exists (
      select 1 from public.orders as owned_order
      where owned_order.id = order_items.order_id
        and owned_order.user_id = (select auth.uid())
    )
  );

grant select on public.products to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.orders, public.order_items to authenticated;
