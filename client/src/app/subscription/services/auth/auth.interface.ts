import { Provider } from "@supabase/supabase-js";

export interface LoginResult {
    confirmEmailRequired?: boolean
}

// This should match the columns of your profile table
export interface User {
    id: string;
    email: string;
    username: string;
    avatar_url: string;
    subscribed: string;
  }

export interface AuthProvider {
    id: Provider;
    label: string;
  }