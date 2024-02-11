import { inject, Injectable } from "@angular/core";
import { AuthService } from "./services/auth/auth.service";

Injectable();
export class SubscriptionModuleInit {
  private auth = inject(AuthService);

  init(): Promise<any> {
    return this.auth.init();
  }
}
