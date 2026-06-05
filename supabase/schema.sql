-- ============================================================
--  Movify — Supabase Şema
--  Supabase Dashboard → SQL Editor'a yapıştır ve çalıştır
-- ============================================================

-- Filmler
create table if not exists movies (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  director    text,
  genre       text,
  year        integer,
  rating      numeric(3,1),
  description text,
  poster      text,
  created_at  timestamptz default now()
);

-- If the table already exists, add director column:
-- alter table movies add column if not exists director text;

-- Türler (ileride kullanım için)
create table if not exists genres (
  id   serial primary key,
  name text not null unique
);

-- Film–Tür ilişkisi (many-to-many)
create table if not exists movie_genres (
  movie_id uuid references movies(id) on delete cascade,
  genre_id integer references genres(id) on delete cascade,
  primary key (movie_id, genre_id)
);

-- Kullanıcılar (auth kurulana kadar UUID session tabanlı)
create table if not exists users (
  id         uuid primary key default gen_random_uuid(),
  username   text,
  email      text unique,
  created_at timestamptz default now()
);

-- Favoriler
create table if not exists favorites (
  id         serial primary key,
  user_id    uuid not null,
  movie_id   uuid references movies(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, movie_id)
);

-- İzlenen filmler
create table if not exists watched_movies (
  id         serial primary key,
  user_id    uuid not null,
  movie_id   uuid references movies(id) on delete cascade,
  watched_at timestamptz default now(),
  unique (user_id, movie_id)
);

-- Puanlar (1–5 arası kullanıcı puanı)
create table if not exists ratings (
  id         serial primary key,
  user_id    uuid not null,
  movie_id   uuid references movies(id) on delete cascade,
  rating     integer check (rating between 1 and 5),
  created_at timestamptz default now(),
  unique (user_id, movie_id)
);

-- Yorumlar
create table if not exists reviews (
  id          serial primary key,
  user_id     uuid not null,
  movie_id    uuid references movies(id) on delete cascade,
  review_text text,
  created_at  timestamptz default now()
);

-- Kullanıcı listeleri
create table if not exists user_lists (
  id         serial primary key,
  user_id    uuid not null,
  name       text not null,
  created_at timestamptz default now()
);

-- Liste–Film ilişkisi
create table if not exists user_list_movies (
  id       serial primary key,
  list_id  integer references user_lists(id) on delete cascade,
  movie_id uuid references movies(id) on delete cascade,
  added_at timestamptz default now(),
  unique (list_id, movie_id)
);

-- ============================================================
--  Row Level Security (RLS) — isteğe bağlı, auth sonrası
-- ============================================================
-- alter table movies enable row level security;
-- alter table favorites enable row level security;
-- alter table watched_movies enable row level security;
-- alter table ratings enable row level security;
