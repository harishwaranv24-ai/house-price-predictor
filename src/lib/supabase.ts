import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface House {
  id?: string;
  square_feet: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  lot_size: number;
  garage_spaces: number;
  location_score: number;
  actual_price: number;
  created_at?: string;
}

export interface Prediction {
  id?: string;
  square_feet: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  lot_size: number;
  garage_spaces: number;
  location_score: number;
  predicted_price: number;
  created_at?: string;
}
