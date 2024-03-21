/**
 * Title: signin.component.ts
 * Author: Kyle Hochdoerfer
 * Date: 03/20/2024
 */

//import statements
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SecurityService } from '../security.service';

//exports session user interface
export interface SessionUser {
  userId: number;
  firstName: string;
  lastName: string
  email: string;
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})

//exports class
export class SigninComponent {
  //variables created
  errorMessage: string;
  sessionUser: SessionUser
  isLoading: boolean = false;

  //form builder creates signin form that and accepts numerical values
  signInForm = this.fb.group({
    email: [null, Validators.compose([Validators.required, Validators.email])],
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$')])]
  });

  //constructor created that passes the following
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private securityService: SecurityService,
    private fb: FormBuilder
  ) {
    this.sessionUser = {} as SessionUser; // Initialize a session user object
    this.errorMessage = ''; //default value set
  }

  //function for user to signin
  signIn() {
    //set isLoading to true and get Id from form
    this.isLoading = true;
    let email = this.signInForm.controls['email'].value;
    let password = this.signInForm.controls['password'].value


    //if email and is not valid an error message is displayed
    if (!email || !password) {
      this.errorMessage = 'Please enter an email and password in the fields below!';
      this.isLoading = false;
      this.hideAlert();
      return;

    }

    //subscribe to security service
    this.securityService.signIn(email, password).subscribe({
      next: (user: any) => {
        console.log('user', user);

        this.sessionUser = user;

        //set session cookies
        this.cookieService.set('session_user', JSON.stringify(this.sessionUser), 1);
        this.cookieService.set('session_name', `${user.firstName} ${user.lastName}`, 1);

        //returns url
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';

        this.isLoading = false;

        this.router.navigate([returnUrl]);
      },
      error: (err) => {
        this.isLoading = false;


        if (err.error.message) {
          //sets value of error message
          this.errorMessage = err.error.message
          if (err.error.message ='Valid email and/or password not found') {
            this.errorMessage = 'Invalid email and/or password! Please try again!'
          }
          console.log('err', err);
          this.hideAlert();
          return;
        }
      }
    });
  }

  // Set a timeout for alert displays
  hideAlert() {
    setTimeout( () => {
      this.errorMessage = '';
    }, 5000)
  }

}
