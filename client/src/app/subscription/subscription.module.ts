import { APP_INITIALIZER, ModuleWithProviders, NgModule } from "@angular/core";

import { RouterModule } from "@angular/router";
import { SubscriptionModuleInit } from "./subscription.init";
import { SubscriptionModuleConfig } from "./subscription.interface";
import { subscriptionModuleRoutes } from "./subscription.routes";
import { SUBSCRIPTION_MODULE_CONFIG } from "./subscription.token";

export function initializeModule(subscriptionInit: SubscriptionModuleInit) {
  const fnc: Function = () => {
    return subscriptionInit.init();
  };
  return fnc;
}

@NgModule({
  imports: [
    RouterModule.forChild(subscriptionModuleRoutes),
  ],
})
export class SubscriptionModule {
  static forRoot(
    cfg: SubscriptionModuleConfig,
  ): ModuleWithProviders<SubscriptionModule> {
    return ({
      ngModule: SubscriptionModule,
      providers: [
        { provide: SUBSCRIPTION_MODULE_CONFIG, useValue: cfg },
        SubscriptionModuleInit,
        {
          provide: APP_INITIALIZER,
          useFactory: initializeModule,
          deps: [SubscriptionModuleInit],
          multi: true,
        },
      ],
    });
  }
}
