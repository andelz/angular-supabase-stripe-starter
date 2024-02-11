import { Component, inject } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { AuthResponse } from "@supabase/supabase-js";
import { AuthService } from "../../services/auth/auth.service";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: "./signup.component.html",
  styleUrl: "./signup.component.scss",
})
export class SignupPageComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  busy = false;
  error?: string;
  showMailConfirm = false;

  signupForm: FormGroup = this.fb.group({
    email: [null, Validators.required],
    password: [null, Validators.required],
    passwordConfirm: [null, Validators.required],
  }, {
    validators: [this._passwordMatchValidator()],
  });

  private _passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordMatch =
        control.value.password === control.value.passwordConfirm;
      return !passwordMatch ? { passwordMatch: true } : null;
    };
  }

  signUp() {
    if (this.signupForm.valid) {
      this.error = undefined;
      this.busy = true;
      const { email, password } = this.signupForm.value;
      this.auth.signUp(email, password).subscribe({
        next: () => {
          this.busy = false;
          // signing up with email/password requires the user to verify their mail address
          // therefore we'll show some kind message to the user
          this.showMailConfirm = true;
        },
        error: (err: Error) => {
          this.busy = false;
          console.error("Signup failed:", err);
          this.error = "Signup failed";
        },
      });
    }
  }
}
