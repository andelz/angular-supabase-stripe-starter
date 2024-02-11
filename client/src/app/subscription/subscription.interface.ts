import { Provider } from "@supabase/supabase-js";
import { AuthProvider } from "./services/auth/auth.interface";

export interface SubscriptionModuleConfig {
  supabase: {
    // URL of your Supabase project
    url: string;
    // Supabase projects anon key
    key: string;
  };
  auth: {
    // auth providers that your app should support
    providers: AuthProvider[];
    // wheter or not to support sign in/up with email and password
    disableLoginWithEmail: boolean;
  };
  tables: {
    // name of the table that contains the user profile data
    profile: string;
  };
}


