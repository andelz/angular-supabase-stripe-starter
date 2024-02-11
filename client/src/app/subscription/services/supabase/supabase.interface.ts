import { AuthChangeEvent, Session } from "@supabase/supabase-js";

export interface SupabaseAuthStateChange {
  event: AuthChangeEvent;
  session: Session | null;
}
