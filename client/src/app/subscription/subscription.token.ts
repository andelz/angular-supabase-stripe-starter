import { InjectionToken } from "@angular/core";
import { SubscriptionModuleConfig } from "./subscription.interface";

export const SUBSCRIPTION_MODULE_CONFIG = new InjectionToken<SubscriptionModuleConfig>('SUBSCRIPTION_MODULE_CONFIG');