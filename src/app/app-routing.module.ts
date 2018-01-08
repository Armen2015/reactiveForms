import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

 import { HomeComponent } from './pages/home/home.component';
 import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  // { path: 'login', component: Form2Component },
  //{ path: 'step3', component: Form3Component },
];
 
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}