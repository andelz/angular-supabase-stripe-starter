import { Component, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Provider } from "@supabase/supabase-js";
import { AuthService } from "../../services/auth/auth.service";
import { SUBSCRIPTION_MODULE_CONFIG } from "../../subscription.token";
import { BusyCoverDirective } from "src/app/components/busy-cover/busy-cover.directive";
import { AuthProvider, LoginResult } from "../../services/auth/auth.interface";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, BusyCoverDirective],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private moduleConfig = inject(SUBSCRIPTION_MODULE_CONFIG);

  disableLoginWithEmail = !!this.moduleConfig.auth.disableLoginWithEmail;
  providers: AuthProvider[] = this.moduleConfig.auth.providers;
  busy = false;
  error?: string;
  notification?: string;

  emailLoginForm: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required],
  });

  login() {
    if (this.emailLoginForm.valid) {
      this.error = this.notification = undefined;
      this.busy = true;
      const { email, password } = this.emailLoginForm.value;
      this.auth.login(email, password)
        .subscribe({
          next: (res: LoginResult) => {
            if (res.confirmEmailRequired) {
              this.notification = "You have not yet confirmed your eMail address ...";
            } else {this.router.navigateByUrl(
                this.route.snapshot.queryParamMap.get("redirect_url") ?? "",
              );}
          },
          error: (err) => this.error = err,
        }).add(() => this.busy = false);
    }
  }

  loginWithProvider(provider: string) {
    this.busy = true;
    this.auth.loginWithProvider(provider as Provider).subscribe().add(() => this.busy = false);
  }

  ngOnInit(): void {
    if (this.auth.authenticated) this.router.navigateByUrl("");
  }
}
