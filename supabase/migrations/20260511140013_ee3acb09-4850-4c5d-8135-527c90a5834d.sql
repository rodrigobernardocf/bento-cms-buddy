
-- ============ ENUM ============
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'author');
CREATE TYPE public.post_status AS ENUM ('draft', 'published');

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============ USER ROLES ============
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role helper (security definer to avoid recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============ CATEGORIES ============
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- ============ POSTS ============
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image_url TEXT,
  status post_status NOT NULL DEFAULT 'draft',
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  published_at TIMESTAMPTZ
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE INDEX posts_author_idx ON public.posts(author_id);
CREATE INDEX posts_status_idx ON public.posts(status);

-- ============ POST_CATEGORIES (pivot) ============
CREATE TABLE public.post_categories (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;

-- ============ updated_at trigger ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER posts_set_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ Auto-create profile + author role on signup ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'author');
  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ RLS POLICIES ============

-- profiles: anyone authenticated can read, users update own, admins anything
CREATE POLICY "Profiles readable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
CREATE POLICY "Admins manage profiles" ON public.profiles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- user_roles: users see own roles, admins manage
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- categories: public read, admins/editors manage
CREATE POLICY "Categories public read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Editors manage categories" ON public.categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- posts
CREATE POLICY "Published posts public" ON public.posts FOR SELECT
  USING (status = 'published' OR auth.uid() = author_id
         OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Authenticated can create posts" ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors update own posts" ON public.posts FOR UPDATE
  USING (auth.uid() = author_id
         OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Authors delete own posts" ON public.posts FOR DELETE
  USING (auth.uid() = author_id
         OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- post_categories
CREATE POLICY "Post categories public read" ON public.post_categories FOR SELECT USING (true);
CREATE POLICY "Manage own post categories" ON public.post_categories FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.posts p
            WHERE p.id = post_id
              AND (p.author_id = auth.uid()
                   OR public.has_role(auth.uid(), 'admin')
                   OR public.has_role(auth.uid(), 'editor')))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.posts p
            WHERE p.id = post_id
              AND (p.author_id = auth.uid()
                   OR public.has_role(auth.uid(), 'admin')
                   OR public.has_role(auth.uid(), 'editor')))
  );

-- ============ STORAGE BUCKET for media ============
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

CREATE POLICY "Media public read" ON storage.objects FOR SELECT
  USING (bucket_id = 'media');
CREATE POLICY "Authenticated upload media" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Owner update own media" ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND owner = auth.uid());
CREATE POLICY "Owner delete own media" ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin')));
