/**
 * Title: security-routing.module.ts
 * Author: Kyle Hochdoerfer
 * Date: 3/19/24
 * Description: Security routing for Web Dev Grill
 */

// import statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityComponent } from './security.component';
import { SigninComponent } from './signin/signin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegistrationComponent } from './registration/registration.component';

//Security routing
const routes: Routes = [
  {
    path: '',
    component: SecurityComponent,
    children: [
      {
        path: 'signin',
        component: SigninComponent,
        title: 'BCRS: Sign In'
      },
      {
        path: 'not-found',
        component: NotFoundComponent,
        title: '404 Error'
      },
      {
        path: 'registration',
        component: RegistrationComponent,
        title: 'register'
      }
    ]
  },
];

//Create and export ngmodule
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }

