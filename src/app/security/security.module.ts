/**
 * Title: security.module.ts
 * Author: Kyle Hochdoerfer
 * Date: 3/6/24
*/

// imports statements
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { SecurityRoutingModule } from './security-routing.module';
import { SecurityComponent } from './security.component';
import { RegistrationComponent } from './registration/registration.component';
import { SigninComponent } from './signin/signin.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    SecurityComponent,
    RegistrationComponent,
    SigninComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class SecurityModule { }
