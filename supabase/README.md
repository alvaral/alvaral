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
