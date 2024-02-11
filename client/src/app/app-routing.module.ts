import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MyAppComponent } from "./pages/my-app/my-app.component";
import { authenticatedGuard } from "./subscription/guards/authenticated.guard";
import { subscribedGuard } from "./subscription/guards/subscribed.guard";

const routes: Routes = [
  { path: "", component: MyAppComponent, canActivate: [authenticatedGuard, subscribedGuard] },
  // default route
  // { path: "", redirectTo: "/app", pathMatch: "full",  },
  // { path: "/", redirectTo: "", pathMatch: "full",  },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
