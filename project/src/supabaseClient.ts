import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pfncgbzfsvxqgxyygldp.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmbmNnYnpmc3Z4cWd4eXlnbGRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MjI3NTQsImV4cCI6MjA2MzM5ODc1NH0.NstSnyos7AnnE0beGFEQz0McKc0KOSgGKnnj6cKopZA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
