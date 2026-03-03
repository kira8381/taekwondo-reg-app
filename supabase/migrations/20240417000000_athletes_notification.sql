-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Athletes Table
CREATE TABLE IF NOT EXISTS public.athletes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    gender TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    age_category TEXT NOT NULL,
    nationality TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    club TEXT NOT NULL,
    coach TEXT,
    belt_level TEXT NOT NULL,
    dan_kup TEXT,
    weight_category FLOAT,
    height FLOAT,
    event_category TEXT[] DEFAULT '{}',
    blood_type TEXT,
    medical_condition BOOLEAN DEFAULT FALSE,
    medical_condition_detail TEXT,
    emergency_contact TEXT,
    emergency_phone TEXT,
    payment_method TEXT NOT NULL,
    payment_screenshot TEXT, -- This will store the base64 or bucket URL
    registration_fee FLOAT NOT NULL,
    registration_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;

-- Allow public registration (INSERT)
CREATE POLICY "Allow public registration" ON public.athletes 
FOR INSERT WITH CHECK (true);

-- Allow authenticated users (Admin) to view data (SELECT)
CREATE POLICY "Allow admin view" ON public.athletes 
FOR SELECT USING (true); -- Simplified for now, in production check for admin role

-- Notification Function to trigger Edge Function
CREATE OR REPLACE FUNCTION public.notify_admin_on_registration()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := 'https://' || current_setting('app.supabase_project_ref') || '.supabase.co/functions/v1/notify-admin',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for registration
CREATE TRIGGER on_athlete_registration
  AFTER INSERT ON public.athletes
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_on_registration();