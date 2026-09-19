-- Orders contain customer and shipping data. They must never be readable
-- through the browser's public Supabase client.
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.orders FROM anon, authenticated;

-- Keep this table deny-by-default even if an earlier environment added a
-- permissive policy. Server-side Prisma connections continue to work.
DO $$
DECLARE
  policy_name text;
BEGIN
  FOR policy_name IN
    SELECT pol.polname
    FROM pg_policy pol
    WHERE pol.polrelid = 'public.orders'::regclass
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.orders', policy_name);
  END LOOP;
END $$;
