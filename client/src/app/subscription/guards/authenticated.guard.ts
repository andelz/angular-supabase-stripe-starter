import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../services/auth/auth.service";

export const authenticatedGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.authenticated || route.fragment?.startsWith('access_token=')) {
    return true;
  } else {
    const navExtras = route.fragment
      ? {
        // in case of OAuth provider login we need to also preserve the fragments
        // as they may contain access tokens
        fragment: route.fragment,
      }
      : {
        // capture the current url so we can redirect after login
        queryParams: { redirect_url: state.url },
      };
    router.navigate(["login"], navExtras);
    return false;
  }
};
