import { Component, OnInit } from "@angular/core";
import { PlansComponent } from "../../components/plans/plans.component";

@Component({
  selector: "app-onboarding",
  standalone: true,
  imports: [PlansComponent],
  templateUrl: "./onboarding.component.html",
  styleUrl: "./onboarding.component.scss",
})
export class OnboardingPageComponent implements OnInit {
  // plans: Plan[] = [];
  // error?: string;

  // private supabase = inject(SupabaseService);
  // private subscription = inject(SubscriptionService);
  // private auth = inject(AuthService);

  constructor() {
    // this.auth.$user.subscribe(res => {
      
    // });
  }


  ngOnInit(): void {
    // this.subscription.getPlans().subscribe()
  }
}
