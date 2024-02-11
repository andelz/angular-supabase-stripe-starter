import { inject, Injectable } from "@angular/core";
import { FunctionsResponse } from "@supabase/functions-js";
import {
  AuthResponse,
  createClient,
  SupabaseClient,
} from "@supabase/supabase-js";
import { from, Observable, ReplaySubject } from "rxjs";
import { map } from "rxjs/operators";
import { SUBSCRIPTION_MODULE_CONFIG } from "../../subscription.token";
import { SupabaseAuthStateChange } from "./supabase.interface";

/**
 * Wrapper service for Supabase
 */
@Injectable({
  providedIn: "root",
})
export class SupabaseService {
  private moduleConfig = inject(SUBSCRIPTION_MODULE_CONFIG);
  private _supabase: SupabaseClient;
  private _sbAuthStateSource = new ReplaySubject<SupabaseAuthStateChange>();
  sbAuthState$: Observable<SupabaseAuthStateChange> = this._sbAuthStateSource
    .asObservable();

  get _client(): SupabaseClient {
    return this._supabase;
  }

  constructor() {
    this._supabase = createClient(
      this.moduleConfig.supabase.url,
      this.moduleConfig.supabase.key,
      {
        auth: {
          autoRefreshToken: true,
        },
      },
    );
  }

  signUp(email: string, password: string): Observable<AuthResponse> {
    return from(
      this._supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            email,
          },
        },
      }),
    );
  }

  invokeFunction<T>(fnc: string, payload?: any): Observable<T | null> {
    return from(
      this._supabase.functions.invoke<T>(fnc, {
        body: payload,
      }),
    ).pipe(
      map((res: FunctionsResponse<T>) => {
        if (res.error) {
          console.log(`Error invoking function '${fnc}':`, res.error);
          throw new Error(`Error invoking function '${fnc}'`);
        }
        return res.data;
      }),
    );
  }
}
