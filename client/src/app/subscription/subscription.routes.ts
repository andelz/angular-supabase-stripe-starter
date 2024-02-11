import { Route } from "@angular/router";
import { LoginPageComponent } from "./pages/login/login.component";
import { SuccessPageComponent } from "./pages/payment/success/success.component";
import { CancelledPageComponent } from "./pages/payment/cancelled/cancelled.component";
import { SignupPageComponent } from "./pages/signup/signup.component";
import { OnboardingPageComponent } from "./pages/onboarding/onboarding.component";
import { authenticatedGuard } from "./guards/authenticated.guard";
import { ProfilePageComponent } from "./pages/profile/profile.component";
import { subscribedGuard } from "./guards/subscribed.guard";

export const subscriptionModuleRoutes: Route[] = [
  { path: "login", component: LoginPageComponent },
  { path: "signup", component: SignupPageComponent },
  { path: "profile", component: ProfilePageComponent, canActivate: [authenticatedGuard, subscribedGuard] },
  { path: "onboarding", component: OnboardingPageComponent, canActivate: [authenticatedGuard] },
  { path: "payment/success", component: SuccessPageComponent, canActivate: [authenticatedGuard] },
  { path: "payment/cancelled", component: CancelledPageComponent, canActivate: [authenticatedGuard] },
];
