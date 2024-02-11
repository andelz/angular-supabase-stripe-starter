import { inject, Injectable, NgZone } from "@angular/core";
import {
  AuthError,
  AuthResponse,
  AuthTokenResponsePassword,
  OAuthResponse,
  PostgrestResponse,
  Provider,
} from "@supabase/supabase-js";
import {
  BehaviorSubject,
  from as fromPromise,
  map,
  Observable,
  skipWhile,
  tap,
  throwError,
} from "rxjs";
import { SUBSCRIPTION_MODULE_CONFIG } from "../../subscription.token";
import { SupabaseService } from "../supabase/supabase.service";
import { Router } from "@angular/router";
import { LoginResult, User } from "./auth.interface";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private moduleConfig = inject(SUBSCRIPTION_MODULE_CONFIG);
  private ngZone = inject(NgZone);

  private _user?: User | null;
  private _$user = new BehaviorSubject<User | null | undefined>(undefined);
  $user: Observable<User | null> = this._$user.asObservable()
    .pipe(
      skipWhile((_) => typeof _ === "undefined"),
    ) as Observable<User | null>;

  get authenticated(): boolean {
    return !!this._user;
  }

  get subscribed(): boolean {
    return !!this._user?.subscribed;
  }

  private _onAuthStateChange(user: User | null) {
    // wrap in zone to make change detection aware of this 'Off-Angular-Event'
    this.ngZone.run(() => {
      this._user = user;
      this._$user.next(this._user);
    });
  }

  // called by APP_INITIALZER to fetch user before app starts
  init(): Promise<any> {
    return this.supabase._client.auth.getUser()
      .then((res): Promise<User | null> =>
        this._fetchUserProfile(
          (res.data && res.data.user && !res.error)
            ? res.data.user.id
            : undefined,
        )
      )
      .then((res: User | null) => {
        this._onAuthStateChange(res);
        // After the initial value is set, listen for auth state changes
        this.supabase._client.auth.onAuthStateChange((event, session) => {
          this._fetchUserProfile(session ? session.user.id : undefined).then(
            (res) => {
              this._onAuthStateChange(res);
            },
          );
        });
      });
  }

  private async _fetchUserProfile(userId?: string): Promise<User | null> {
    return userId
      ? this.supabase._client
        .from(this.moduleConfig.tables.profile)
        .select()
        .eq("id", userId)
        .single()
        .then(({ data, error }) => data ?? null)
      : Promise.resolve(null);
  }

  login(email: string, password: string): Observable<LoginResult> {
    return fromPromise(
      this.supabase._client.auth.signInWithPassword({
        email,
        password,
      }).then((res: AuthTokenResponsePassword) => {
        if (res.error) {
          if (res.error.message === "Email not confirmed") {
            return {
              confirmEmailRequired: true,
            };
          } else throw new Error("Login failed");
        }
        return {};
      }),
    );
  }

  logout(): Observable<boolean> {
    return fromPromise(this.supabase._client.auth.signOut()).pipe(
      map((res: { error: AuthError | null }) => {
        if (res.error) throw new Error(res.error.message);
        this.router.navigate([""]);
        return true;
      }),
    );
  }

  loginWithProvider(provider: Provider): Observable<OAuthResponse> {
    return fromPromise(
      this.supabase._client.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: this.moduleConfig.supabase.url,
        },
      }),
    );
  }

  /**
   * Sign up a new user using email & password
   * @param email New users email address
   * @param password New users password
   * @returns ID of the newly created user
   * @throws Error if the signup failed or required params are missing
   */
  signUp(
    email: string,
    password: string,
  ): Observable<string> {
    return (email && password)
      ? fromPromise(this.supabase._client.auth.signUp({
        email,
        password,
        options: {
          data: {
            email,
          },
        },
      })).pipe(
        map((res: AuthResponse) => {
          if (res.error) throw new Error(res.error.message);
          else return res.data.user!.id;
        }),
      )
      : throwError(() => new Error("Missing email / password"));
  }

  /**
   * Update user profile
   * @param user The user profile
   * @returns Observable that resolves with the updated user
   * @throws Error if update failed
   */
  updateUserProfile(user: Partial<User>): Observable<User> {
    return fromPromise(
      this.supabase._client
        .from(this.moduleConfig.tables.profile)
        .update({
          username: user.username,
        })
        .eq("id", user.id)
        .select(),
    ).pipe(
      map((res: PostgrestResponse<unknown>) => {
        if (res.error) {
          console.error("Update of user profile failed:", res.error.message);
          throw new Error("Updating user profile failed");
        } else return res.data[0] as User;
      }),
      tap((user: User) => {
        this._user = user;
        this._$user.next(this._user);
      }),
    );
  }

  /**
   * Refresh user
   */
  fetchUser(): void {
    if (!this._user) return;
    this._fetchUserProfile(this._user.id).then((user: User | null) => {
      this._user = user;
      this._$user.next(this._user);
    });
  }
}
