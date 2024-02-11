import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { tap } from "rxjs/operators";
import { AuthService } from "../../services/auth/auth.service";
import { PlansComponent } from "../../components/plans/plans.component";
import { BusyCoverDirective } from "src/app/components/busy-cover/busy-cover.directive";
import { SubscriptionService } from "../../services/subscription/subscription.service";
import { Plan } from "../../../../../../supabase/functions/_shared/interface";
import { Router } from "@angular/router";
import { User } from "../../services/auth/auth.interface";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PlansComponent,
    BusyCoverDirective,
  ],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.scss",
})
export class ProfilePageComponent {
  private auth = inject(AuthService);

  private subscriptionService = inject(SubscriptionService);
  private fb = inject(FormBuilder);
  user?: User | null;
  error?: string;
  busy = {
    profile: false,
    plans: false,
    cancel: false,
  };
  cancelSubscriptionConfirm = false;

  profileForm: FormGroup = this.fb.group({
    username: ["", Validators.required],
  });

  constructor() {
    this.auth.$user.pipe(
      takeUntilDestroyed(),
      tap((u: User | null) => {
        this.user = u;
        this.profileForm.patchValue({
          username: u?.username,
        });
        this.profileForm.markAsPristine();
      }),
    ).subscribe();
  }

  // save changes to profile
  saveProfile() {
    this.busy.profile = true;
    this.auth.updateUserProfile({
      id: this.user!.id,
      username: this.profileForm.value.username,
    }).subscribe({
      error: (err: Error) => this.error = err.message,
    }).add(() => this.busy.profile = false);
  }

  // Update subscription to a new plan
  updateSubscription(plan: Plan) {
    this.busy.plans = true;
    this.subscriptionService.updateSubscription(plan).subscribe({
      error: () => this.error = "Could not update subscription",
    }).add(() => this.busy.cancel = false);
  }

  // cancel current subscription
  cancelSubscription() {
    this.busy.cancel = true;
    this.subscriptionService.cancelSubscription().subscribe({
      error: () => this.error = "Could not cancel subscription",
    }).add(() => {
      this.busy.cancel = false
      this.auth.logout().subscribe();
    });
  }
}
