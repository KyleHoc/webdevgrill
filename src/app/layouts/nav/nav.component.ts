/**
 * Title: nav.component.ts
 * Author: Kyle Hochdoerfer
 * Date: 3/6/24
 */

// imports statements
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

//Create and export appUser
export interface AppUser {
  fullName: string;
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {

  appUser: AppUser
  isSignedIn: boolean

  //Declare a constructor that passed in cookie service, checks is the user is signed in, and sets appuser
  constructor(private cookieService: CookieService) {
    this.appUser = {} as AppUser;
    this.isSignedIn = this.cookieService.get('session_user') ? true : false;

   // check if user is logged in and log user's name to console
    if (this.isSignedIn) {
      this.appUser = {
        fullName: this.cookieService.get('session_name'),
      }
      console.log(this.appUser.fullName)
    }
  }

  // function to sign out user and clear cookies
  signout() {
    console.log('Signing out...');
    this.cookieService.deleteAll();
    window.location.href = '/';
  }
}
