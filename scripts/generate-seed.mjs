import { readFileSync, writeFileSync } from 'fs'

const data = JSON.parse(readFileSync('src/data/products.json', 'utf8'))
const PRODUCT_TABLES = ['products', 'plan', 'sensors', 'accessories']

function sqlStr(value) {
  if (value === null || value === undefined) return 'null'
  return `'${String(value).replace(/'/g, "''")}'`
}

function sqlNum(value) {
  return value === null || value === undefined ? 'null' : String(value)
}

function sqlBool(value) {
  return value ? 'true' : 'false'
}

const lines = []

lines.push(`-- Auto-generated from src/data/products.json by scripts/generate-seed.mjs
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
`)

// steps
lines.push('-- steps')
for (const step of data.steps) {
  lines.push(
    `insert into public.steps (id, step_number, title, icon) values (${sqlStr(step.id)}, ${sqlNum(step.stepNumber)}, ${sqlStr(step.title)}, ${sqlStr(step.icon)});`,
  )
}

// map productId -> stepId via steps[].productIds
const stepIdByProductId = {}
for (const step of data.steps) {
  for (const pid of step.productIds) stepIdByProductId[pid] = step.id
}

// products + variants (flattened across the category arrays)
lines.push('\n-- products')
const allProducts = PRODUCT_TABLES.flatMap((key) => data[key] ?? [])
for (const product of allProducts) {
  const stepId = stepIdByProductId[product.id]
  lines.push(
    `insert into public.products (id, step_id, category, title, description, learn_more_url, discount, billing_suffix, transparent_image, highlight_title) values (${sqlStr(product.id)}, ${sqlStr(stepId)}, ${sqlStr(product.category)}, ${sqlStr(product.title)}, ${sqlStr(product.description)}, ${sqlStr(product.learnMoreUrl)}, ${sqlNum(product.discount)}, ${sqlStr(product.billingSuffix)}, ${sqlBool(product.transparentImage)}, ${sqlBool(product.highlightTitle)});`,
  )
}

lines.push('\n-- variants')
for (const product of allProducts) {
  for (const variant of product.variants) {
    lines.push(
      `insert into public.variants (id, product_id, label, swatch, image, price, default_qty, stock) values (${sqlStr(variant.id)}, ${sqlStr(product.id)}, ${sqlStr(variant.label)}, ${sqlStr(variant.swatch)}, ${sqlStr(variant.image)}, ${sqlNum(variant.price)}, ${sqlNum(variant.defaultQty)}, ${sqlNum(variant.stock)});`,
    )
  }
}

// shipping options
lines.push('\n-- shipping options')
for (const option of data.shippingOptions ?? []) {
  lines.push(
    `insert into public.shipping_options (id, label, price, discount, image, is_default, sort_order) values (${sqlStr(option.id)}, ${sqlStr(option.label)}, ${sqlNum(option.price)}, ${sqlNum(option.discount)}, ${sqlStr(option.image)}, ${sqlBool(option.isDefault)}, ${sqlNum(option.sortOrder ?? 0)});`,
  )
}

// settings (financing, guarantee)
lines.push('\n-- settings')
if (data.guarantee) {
  lines.push(
    `insert into public.app_settings (key, value) values ('guarantee', '${JSON.stringify(data.guarantee).replace(/'/g, "''")}'::jsonb);`,
  )
}
if (data.financing) {
  lines.push(
    `insert into public.app_settings (key, value) values ('financing', '${JSON.stringify(data.financing).replace(/'/g, "''")}'::jsonb);`,
  )
}

writeFileSync('supabase/seed.sql', lines.join('\n') + '\n')
console.log('Wrote supabase/seed.sql')
