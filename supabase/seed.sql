-- Auto-generated from src/data/products.json by scripts/generate-seed.mjs
-- Run this whole file in the Supabase SQL editor.

create table if not exists public.steps (
  id text primary key,
  step_number int not null,
  title text not null,
  icon text not null
);

create table if not exists public.products (
  id text primary key,
  step_id text not null references public.steps(id) on delete cascade,
  category text not null,
  title text not null,
  description text,
  learn_more_url text,
  discount numeric,
  billing_suffix text,
  transparent_image boolean not null default false,
  highlight_title boolean not null default false
);

alter table public.products add column if not exists single_select boolean not null default false;

create table if not exists public.variants (
  id text primary key,
  product_id text not null references public.products(id) on delete cascade,
  label text,
  swatch text,
  image text,
  price numeric not null,
  default_qty int not null default 0,
  stock int
);

create table if not exists public.shipping_options (
  id text primary key,
  label text not null,
  price numeric not null,
  discount numeric,
  image text,
  is_default boolean not null default false,
  sort_order int not null default 0
);

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null
);

alter table public.steps enable row level security;
alter table public.products enable row level security;
alter table public.variants enable row level security;
alter table public.shipping_options enable row level security;
alter table public.app_settings enable row level security;

create policy "Public read access" on public.steps for select using (true);
create policy "Public read access" on public.products for select using (true);
create policy "Public read access" on public.variants for select using (true);
create policy "Public read access" on public.shipping_options for select using (true);
create policy "Public read access" on public.app_settings for select using (true);

truncate table public.variants, public.products, public.steps, public.shipping_options, public.app_settings cascade;

-- steps
insert into public.steps (id, step_number, title, icon) values ('cameras', 1, 'Choose your cameras', 'camera');
insert into public.steps (id, step_number, title, icon) values ('plan', 2, 'Choose your plan', 'shield');
insert into public.steps (id, step_number, title, icon) values ('sensors', 3, 'Choose your sensors', 'sensor');
insert into public.steps (id, step_number, title, icon) values ('protection', 4, 'Add extra protection', 'protection');

-- products
insert into public.products (id, step_id, category, title, description, learn_more_url, discount, billing_suffix, transparent_image, highlight_title, single_select) values ('wyze-cam-v4', 'cameras', 'Cameras', 'Wyze Cam v4', 'The clearest Wyze Cam ever made.', '#', 22, null, false, false, false);
insert into public.products (id, step_id, category, title, description, learn_more_url, discount, billing_suffix, transparent_image, highlight_title, single_select) values ('wyze-cam-pan-v3', 'cameras', 'Cameras', 'Wyze Cam Pan v3', '360° pan and 180° tilt security camera.', '#', 12, null, false, false, false);
insert into public.products (id, step_id, category, title, description, learn_more_url, discount, billing_suffix, transparent_image, highlight_title, single_select) values ('wyze-floodlight-v2', 'cameras', 'Cameras', 'Wyze Cam Floodlight v2', '2K floodlight camera with a 160° wide-angle view for your garage.', '#', 22, null, false, false, false);
insert into public.products (id, step_id, category, title, description, learn_more_url, discount, billing_suffix, transparent_image, highlight_title, single_select) values ('wyze-doorbell', 'cameras', 'Cameras', 'Wyze Duo Cam Doorbell', 'Two cameras. Two views. Double the porch protection.', '#', null, null, false, false, false);
insert into public.products (id, step_id, category, title, description, learn_more_url, discount, billing_suffix, transparent_image, highlight_title, single_select) values ('wyze-battery-cam-pro', 'cameras', 'Cameras', 'Wyze Battery Cam Pro', 'Protect anywhere. See everything in 2.5K HDR. No power outlet or electrician needed.', '#', null, null, false, false, false);
insert into public.products (id, step_id, category, title, description, learn_more_url, discount, billing_suffix, transparent_image, highlight_title, single_select) values ('cam-unlimited', 'plan', 'Plan', 'Cam Unlimited', 'Unlimited cloud storage for every camera on your account.', '#', 24, '/mo', true, true, true);
insert into public.products (id, step_id, category, title, description, learn_more_url, discount, billing_suffix, transparent_image, highlight_title, single_select) values ('motion-sensor', 'sensors', 'Sensors', 'Wyze Sense Motion Sensor', 'Detects motion and triggers your cameras or alarm.', '#', null, null, false, false, false);
insert into public.products (id, step_id, category, title, description, learn_more_url, discount, billing_suffix, transparent_image, highlight_title, single_select) values ('sense-hub', 'sensors', 'Sensors', 'Wyze Sense Hub (Required)', 'Connects all your Wyze Sense sensors to the app.', '#', null, null, false, false, false);
insert into public.products (id, step_id, category, title, description, learn_more_url, discount, billing_suffix, transparent_image, highlight_title, single_select) values ('microsd-256', 'protection', 'Accessories', 'Wyze MicroSD Card (256GB)', 'Local backup storage for your cameras.', '#', null, null, false, false, false);

-- variants
insert into public.variants (id, product_id, label, swatch, image, price, default_qty, stock) values ('wyze-cam-v4-white', 'wyze-cam-v4', 'White', '#f2f2f2', 'https://ytmnxgsglijfjrjpnduq.supabase.co/storage/v1/object/public/product-images/cam-v4.png', 35.98, 1, 8);
insert into public.variants (id, product_id, label, swatch, image, price, default_qty, stock) values ('wyze-cam-v4-grey', 'wyze-cam-v4', 'Grey', '#8a8a8a', 'https://ytmnxgsglijfjrjpnduq.supabase.co/storage/v1/object/public/product-images/cam-v4.png', 35.98, 0, 10);
insert into public.variants (id, product_id, label, swatch, image, price, default_qty, stock) values ('wyze-cam-v4-black', 'wyze-cam-v4', 'Black', '#1c1c1c', 'https://ytmnxgsglijfjrjpnduq.supabase.co/storage/v1/object/public/product-images/cam-v4.png', 35.98, 0, 10);
insert into public.variants (id, product_id, label, swatch, image, price, default_qty, stock) values ('wyze-cam-pan-v3-white', 'wyze-cam-pan-v3', 'White', '#f2f2f2', 'https://ytmnxgsglijfjrjpnduq.supabase.co/storage/v1/object/public/product-images/cam-pan-v3.png', 34.98, 2, 6);
insert into public.variants (id, product_id, label, swatch, image, price, default_qty, stock) values ('wyze-cam-pan-v3-black', 'wyze-cam-pan-v3', 'Black', '#1c1c1c', 'https://ytmnxgsglijfjrjpnduq.supabase.co/storage/v1/object/public/product-images/cam-pan-v3.png', 34.98, 0, 6);
insert into public.variants (id, product_id, label, swatch, image, price, default_qty, stock) values ('wyze-floodlight-v2-white', 'wyze-floodlight-v2', 'White', '#f2f2f2', 'https://ytmnxgsglijfjrjpnduq.supabase.co/storage/v1/object/public/product-images/floodlight-v2.png', 69.98, 0, 5);
insert into public.variants (id, product_id, label, swatch, image, price, default_qty, stock) values ('wyze-floodlight-v2-black', 'wyze-floodlight-v2', 'Black', '#1c1c1c', 'https://ytmnxgsglijfjrjpnduq.supabase.co/storage/v1/object/public/product-images/floodlight-v2.png', 69.98, 0, 5);
insert into public.variants (id, product_id, label, swatch, image, price, default_qty, stock) values ('wyze-doorbell-default', 'wyze-doorbell', null, null, 'https://ytmnxgsglijfjrjpnduq.supabase.co/storage/v1/object/public/product-images/doorbell.png', 69.98, 0, 4);
insert into public.variants (id, product_id, label, swatch, image, price, default_qty, stock) values ('wyze-battery-cam-pro-white', 'wyze-battery-cam-pro', 'White', '#f2f2f2', 'https://ytmnxgsglijfjrjpnduq.supabase.co/storage/v1/object/public/product-images/battery-cam-pro.png', 89.98, 0, 7);
insert into public.variants (id, product_id, label, swatch, image, price, default_qty, stock) values ('wyze-battery-cam-pro-black', 'wyze-battery-cam-pro', 'Black', '#1c1c1c', 'https://ytmnxgsglijfjrjpnduq.supabase.co/storage/v1/object/public/product-images/battery-cam-pro.png', 89.98, 0, 7);
insert into public.variants (id, product_id, label, swatch, image, price, default_qty, stock) values ('cam-unlimited-default', 'cam-unlimited', null, null, 'https://ytmnxgsglijfjrjpnduq.supabase.co/storage/v1/object/public/product-images/cam-unlimited.svg', 12.99, 1, null);
insert into public.variants (id, product_id, label, swatch, image, price, default_qty, stock) values ('motion-sensor-default', 'motion-sensor', null, null, 'https://ytmnxgsglijfjrjpnduq.supabase.co/storage/v1/object/public/product-images/motion-sensor.png', 29.99, 2, 12);
insert into public.variants (id, product_id, label, swatch, image, price, default_qty, stock) values ('sense-hub-default', 'sense-hub', null, null, 'https://ytmnxgsglijfjrjpnduq.supabase.co/storage/v1/object/public/product-images/sense-hub.png', 0, 1, 6);
insert into public.variants (id, product_id, label, swatch, image, price, default_qty, stock) values ('microsd-256-default', 'microsd-256', null, null, 'https://ytmnxgsglijfjrjpnduq.supabase.co/storage/v1/object/public/product-images/microsd-256.png', 20.98, 2, 15);

-- shipping options
insert into public.shipping_options (id, label, price, discount, image, is_default, sort_order) values ('fast-shipping', 'Fast Shipping', 5.99, 100, 'https://ytmnxgsglijfjrjpnduq.supabase.co/storage/v1/object/public/product-images/carbon_delivery.svg', true, 0);

-- settings
insert into public.app_settings (key, value) values ('financing', '{"months":12}'::jsonb);
