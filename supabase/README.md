# Supabase setup

1. In Supabase, open the SQL editor and run `supabase/schema.sql`.
2. Create your admin user in Authentication.
3. Copy that user's UUID and run:

```sql
insert into public.admin_users (user_id)
values ('YOUR_AUTH_USER_ID')
on conflict (user_id) do nothing;
```

4. Add these variables in Vercel:

```txt
NEXT_PUBLIC_SITE_URL=https://alvaral.dev
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Do not add the Supabase secret key to the frontend or to Vercel unless a future
server-only feature explicitly needs it.

## Import existing content

Run `supabase/seed-legacy-posts.sql` in the Supabase SQL editor to import the
two posts that used to live as TSX files:

- `frontend-vs-backend`
- `ideal-developer`

The script is safe to run more than once. It upserts the posts and their ES/EN
translations.

Run `supabase/seed-legacy-photos.sql` to register the existing homepage images
in the backoffice. These records point to the current `/assets/images/*.webp`
files, so do not delete those files unless you upload replacements to Supabase
Storage first.

## About page

Run `supabase/add-about-profile.sql` if your Supabase database was created
before the about-page editor existed. It adds the singleton `about_profile`
record used by `/about` and `/admin/about`.

## Analytics

Run `supabase/add-analytics.sql` if your Supabase database was created before
the analytics dashboard existed. It adds `analytics_page_views`, which stores
page, timestamp, region headers, device type, browser, OS, and sanitized
referrer information for `/admin/analytics`.
