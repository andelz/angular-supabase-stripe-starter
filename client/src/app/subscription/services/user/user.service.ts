import { inject, Injectable, NgZone } from "@angular/core";
import {
  AuthChangeEvent,
  AuthResponse,
  AuthTokenResponse,
  Provider,
  Session,
  User as SupabaseUser,
  UserResponse,
} from "@supabase/supabase-js";
import {
  catchError,
  EMPTY,
  filter,
  from,
  map,
  Observable,
  of,
  ReplaySubject,
  switchMap,
  tap,
} from "rxjs";
import { SupabaseAuthStateChange } from "src/app/subscription/services/supabase/supabase.interface";
import { User } from "../../subscription.interface";
import { SUBSCRIPTION_MODULE_CONFIG } from "../../subscription.token";
import { SupabaseService } from "../supabase/supabase.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class UserService {
  // private ngZone = inject(NgZone);
  // private router = inject(Router);
  // private supabase = inject(SupabaseService);
  // private moduleConfig = inject(SUBSCRIPTION_MODULE_CONFIG);

  // private _user?: User;
  // private _userSource = new ReplaySubject<User | undefined>();
  // user$: Observable<User | undefined> = this._userSource.asObservable();

  // constructor() {
  //   this.supabase.sbAuthState$.pipe(
  //     filter((e: SupabaseAuthStateChange) =>
  //       e.event === "SIGNED_IN" || e.event === "USER_UPDATED" ||
  //       e.event === "SIGNED_OUT"
  //     ),
  //     switchMap((e: SupabaseAuthStateChange) =>
  //       (e.event === "SIGNED_OUT")
  //         ? of(undefined)
  //         : this._fetchProfile(e.session!.user.id)
  //     ),
  //   ).subscribe((res: User | undefined) => {
  //     this.ngZone.run(() => {
  //       this._user = res;
  //       this._userSource.next(this._user);
  //     });
  //   });
  // }

  // private _fetchProfile(userId: string): Observable<User> {
  //   return from(
  //     this.supabase._client.from(this.moduleConfig.tables.profile)
  //       .select()
  //       .eq("id", userId)
  //       .single(),
  //   ).pipe(
  //     map((res) => res.data as User),
  //   );
  // }

  // isAuthenticated(): boolean {
  //   return !!this._user;
  // }

  // isSubscribed() {
  //   return false;
  // }

  // login(
  //   email: string,
  //   password: string,
  // ): Observable<AuthTokenResponse | undefined> {
  //   return (email && password)
  //     ? this.supabase.login(email, password)
  //     : of(undefined);

  //   // if (email && password) {
  //   //   this.supabase.login(email, password)
  //   //     .subscribe((res: AuthTokenResponse) => {
  //   //       console.log(res);
  //   //     });
  //   // }
  // }

  // loginWithProvider(provider: string) {
  //   return this.supabase.loginWithProvider(provider as Provider);
  // }

  // logout() {
  //   return this.supabase.logout();
  // }

  // signUp(
  //   email: string,
  //   password: string,
  // ): Observable<AuthResponse | undefined> {
  //   return (email && password)
  //     ? this.supabase.signUp(email, password)
  //     : of(undefined);
  // }
}
