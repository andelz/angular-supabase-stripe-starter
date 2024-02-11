import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./subscription/services/auth/auth.service";
import { SupabaseService } from "./subscription/services/supabase/supabase.service";
import { User } from "./subscription/services/auth/auth.interface";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private sb = inject(SupabaseService);
  user?: User | null;

  constructor() {
    this.auth.$user.subscribe((u: User | null) => {
      this.user = u;
    });
  }

  logout() {
    this.auth.logout().subscribe();
  }
}
