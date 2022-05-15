import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInOutComponent } from './log-in-out/log-in-out.component';
import { RegistrationComponent } from './registration/registration.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {path:'search-name', component: ViewComponent},
  {path:'register', component: RegistrationComponent},
  {path:'*', component: RegistrationComponent},
  {path:'login', component: LogInOutComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
