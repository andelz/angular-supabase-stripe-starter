import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../services/auth/auth.service";

export const subscribedGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.subscribed) return true;
  else if (!auth.authenticated) {
    router.navigate(["login"]);
    return false;
  } else {
    router.navigate(["onboarding"]);
    return false;
  }
};
