import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { tap } from "rxjs/operators";
import { Plan } from "../../../../../../supabase/functions/_shared/interface";
import { AuthService } from "../../services/auth/auth.service";
import { SubscriptionService } from "../../services/subscription/subscription.service";
import { BusyCoverDirective } from "src/app/components/busy-cover/busy-cover.directive";
import { User } from "../../services/auth/auth.interface";

interface Tile {
  id: string;
  label: string;
  price: number;
  currency: string;
  subscribed: boolean;
  plan: Plan;
}

@Component({
  selector: "app-plans",
  standalone: true,
  imports: [CommonModule, BusyCoverDirective],
  templateUrl: "./plans.component.html",
  styleUrl: "./plans.component.scss",
})
export class PlansComponent {
  user?: User | null;
  tiles: Tile[] = [];
  error?: string;
  busy = false;

  private subscription = inject(SubscriptionService);
  private auth = inject(AuthService);

  constructor() {
    this.auth.$user.pipe(
      takeUntilDestroyed(),
      tap((u: User | null) => this.user = u),
    ).subscribe();

    this.busy = true;
    this.subscription.getPlans().subscribe({
      next: (plans) =>
        this.tiles = (plans || []).map((p: Plan) => ({
          id: p.id,
          label: this._lookupKeyToLabel(p.lookup_key),
          price: p.price.value / 100,
          currency: p.price.currency,
          plan: p,
          subscribed: p.lookup_key === this.user?.subscribed,
        })),
      error: (err) => this.error = "Error fetching plans",
    }).add(() => this.busy = false);
  }

  // Map lookup key to a more compelling label
  private _lookupKeyToLabel(lk: string): string {
    const labels: {[k: string]: string} = {
      annual: 'Annual',
      monthly: 'Monthly',
    }
    return labels[lk] || lk;
  }

  subscribeTo(plan: Plan) {
    this.busy = true;
    this.subscription.subscribeTo(plan).subscribe({
      next: (res) => {
        console.log(res);
        // update user state
        this.auth.fetchUser();
      },
      error: (err) => {
        this.error = err.message;
      },
    }).add(() => this.busy = false);
  }
}
