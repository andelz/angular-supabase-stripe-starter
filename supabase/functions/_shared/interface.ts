export interface Plan {
  id: string;
  name: string;
  lookup_key: string;
  price: {
    currency: string;
    value: number;
  };
  recurring: {
    interval: "year" | "month" | "week" | "day";
    interval_count: number;
    // trial_period_days: null;
  };
}

export interface Customer {
  id: string;
  stripe_customer_id: string;
  subscription_id?: string;
  lookup_key?: string;
}

export interface StripeCheckoutLineItem {
  price: string;
  quantity: number;
}

export interface StripeCheckoutParams {
  checkout?: {
    redirectPath: string;
    lineItems: [{
      price: string;
      quantity: number;
    }];
  };
  update?: {
    newPrice: string;
  };
  cancel?: {
    subscriptionID?: string;
  };
}

export interface StripeCheckoutResponse {
  checkout?: {
    sessionId: string;
  };
  update?: {
    // the updated subscription object
    updatedSubscription: unknown;
  };
  cancel?: {
    // the updated subscription object
    canceledSubscription: unknown;
  };
}
