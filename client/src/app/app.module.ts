import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { ReactiveFormsModule } from "@angular/forms";
import { environment } from "src/environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SubscriptionModule } from "./subscription/subscription.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    SubscriptionModule.forRoot({
      auth: {
        disableLoginWithEmail: false,
        providers: [{ id: "google", label: "Google" }],
      },
      supabase: {
        key: environment.SUPABASE_KEY,
        url: environment.SUPABASE_URL,
      },
      tables: {
        profile: "user_profile",
      },
    }),
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
