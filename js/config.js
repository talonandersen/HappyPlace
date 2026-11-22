/* Cloud sync settings. Leave blank to run HappyPlace device-only.
   The anon key is meant to be public: Row Level Security in supabase/schema.sql
   is what keeps each person's data private. Never put the service_role key here. */
window.HP_CONFIG = {
  supabaseUrl: "",
  supabaseAnonKey: ""
};
