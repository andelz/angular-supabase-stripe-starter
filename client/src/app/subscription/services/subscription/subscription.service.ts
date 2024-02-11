import { inject, Injectable } from "@angular/core";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { from, map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import {
  Plan,
  StripeCheckoutParams,
  StripeCheckoutResponse,
} from "../../../../../../supabase/functions/_shared/interface";
import { AuthService } from "../auth/auth.service";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable({
  providedIn: "root",
})
export class SubscriptionService {
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);

  /**
   * Get the available plans from stripe-inventory edge function
   * @returns
   */
  getPlans(): Observable<Plan[] | null> {
    return this.supabase.invokeFunction<Plan[]>("stripe-inventory");
  }

  subscribeTo(p: Plan): Observable<any> {
    return this._createCheckoutSession(p);
  }

  /**
   * Update existing subscription to a new plan
   * @param plan The plan to update the subscription to
   * @returns Observable resolving with the updated subscription object
   */
  updateSubscription(plan: Plan): Observable<{ updatedSubscription: unknown }> {
    return this.supabase.invokeFunction<StripeCheckoutResponse>(
      "stripe-checkout",
      {
        update: {
          newPrice: plan.id,
        },
      },
    ).pipe(
      map((res: StripeCheckoutResponse | null) => {
        if (!res) throw new Error("Updating subscription failed.");
        return res.update!;
      }),
    );
  }

  /**
   * Cancel existing subscription
   * @param subscriptionID ID of the subscription to be canceled
   * @returns Observable resolving with the canceled subscription object
   */
  cancelSubscription(
    subscriptionID?: string,
  ): Observable<{ canceledSubscription: unknown }> {
    return this.supabase.invokeFunction<StripeCheckoutResponse>(
      "stripe-checkout",
      { cancel: { subscriptionID } },
    ).pipe(
      map((res: StripeCheckoutResponse | null) => {
        if (!res) throw new Error("Canceling subscription failed.");
        return res.cancel!;        
      }),
    );
  }

  private _createCheckoutSession(p: Plan): Observable<string> {
    const i: StripeCheckoutParams = {
      checkout: {
        redirectPath: `${location.origin}/payment/`,
        lineItems: [{
          price: p.id,
          quantity: 1,
        }],
      },
    };
    return from(
      this.supabase.invokeFunction<{ checkout: { sessionId: string } }>(
        "stripe-checkout",
        i,
      ),
    ).pipe(
      map((res: { checkout: { sessionId: string } } | null) => {
        if (!res?.checkout.sessionId) {
          throw new Error("Got no checkout session ID");
        }
        // 'stripe-checkout' edge function will return a checkout ID which be
        // used to redirect to Stripe checkout
        this._redirectToCheckout(res.checkout.sessionId);
        return res.checkout.sessionId;
      }),
    );
  }

  private async _redirectToCheckout(checkoutSessionId: string) {
    const stripe = await loadStripe(
      environment.STRIPE_PUBLISHABLE_KEY,
    ) as Stripe;
    return from(stripe.redirectToCheckout({ sessionId: checkoutSessionId }));
  }
}
