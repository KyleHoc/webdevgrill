/**
 * Title: registration.component.ts
 * Author: Kyle Hochdoerfer
 * Date: 03/20/2024
 */

import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '../security.service';
import { UserModel } from '../user-model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  //Define variables for error message, session user, and isloading
  errorMessage: string;
  isLoading: boolean = false;

  //Use form builder to create a registration form
  registrationForm: FormGroup = this.fb.group({
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    email:  [null, Validators.compose([Validators.required, Validators.email ])],
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')])],
  });

  //Define a constructor that passes in routing, form builder, and security service
  constructor(
    private securityService: SecurityService,
    private router: Router,
    private fb: FormBuilder
  ) {
    //Set default values for error message
    this.errorMessage = '';
  }

  //Registration function
  register(){
    //Create a user object based on user input
    const user: UserModel = {
      userId: '111', //Temporary ID until the API sets it
      email: this.registrationForm.controls['email'].value,
      password: this.registrationForm.controls['password'].value,
      firstName: this.registrationForm.controls['firstName'].value,
      lastName: this.registrationForm.controls['lastName'].value,
      cart: []
    }

    //Verify that all fields have been filled out and display an error message in the event they are not
   if(!user.email || !user.password || !user.firstName || !user.lastName){
      this.errorMessage = 'Please fill out all form fields before submitting';
      this.isLoading = false;
      this.hideAlert();
      return;
   }

    //Create a new user and redirect back to user log-in page.
    this.securityService.registerUser(user).subscribe({
      next: (res) => {
      console.log(res);
      this.router.navigate(['/security/signin']);
      this.isLoading = false
      },
    error: (err) => {
      console.log('error', err);
      this.errorMessage = err.message;
      this.isLoading = false;
      }
    })
  }

  // Set a timeout for alert displays
  hideAlert() {
    setTimeout( () => {
      this.errorMessage = '';
    }, 5000)
  }
}