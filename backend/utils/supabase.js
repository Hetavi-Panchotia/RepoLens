const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === "" || supabaseAnonKey === "") {
  console.warn('Supabase URL or Anon Key is missing. Caching will be disabled.');
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err.message);
  }
}

module.exports = supabase;
