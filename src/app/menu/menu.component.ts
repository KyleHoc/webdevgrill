/**
    Title: menu.component.ts
    Author: Kyle Hochdoerfer
    Date: 03/14/24
    Description: Menu component
*/

//Import statements
import { Component } from '@angular/core';
import { MenuService } from '../menu.service';
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../security/user-model';

//Create and export the menu component
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  //Initialize menu and error message variables
  menu: any;
  errorMessage: string;
  successMessage: string;

  //Initialize variables for each type of menu object
  appetizers: any;
  entrees: any;
  desserts: any;

  //Create a variable to see if the user is signed in
  isSignedIn: boolean;

  //Create a user variable to hold the user's data
  user: UserModel;

  //Declare a constructor that passes in the menu service
  constructor(private menuService: MenuService, private cookieService: CookieService){
    //Set menu variables and error message to empty arrays and an empty string
    this.menu = []
    this.appetizers = []
    this.entrees = []
    this.desserts = []
    this.errorMessage = ''
    this.successMessage = ''

    //Subscribe to the menu service using the menu service's find all menu items function
    this.menuService.findAllMenuItems().subscribe({
      next: (menuData: any ) => {
        //Save the menu variable as an array of menu objects
        this.menu = menuData;

        //For every menu item:
        for(let item of this.menu){
          //If the item type is appetizer, push it onto the appetizer array
          if(item.type === "appetizer"){
            this.appetizers.push(item)
          }

          //If the item type is entree, push it onto the entree array
          if(item.type === "entree"){
            this.entrees.push(item)
          }

          //If the item type is dessert, push it onto the desserts array
          if(item.type === "dessert"){
            this.desserts.push(item)
          }
        }
      },
      error: (err) => {
        //Set the error message in the event of an error
        this.errorMessage = err.message
      },
      complete: () => {
      }
    })

    //Determine if the user is signed in using cookie service
    this.isSignedIn = this.cookieService.get('session_user') ? true : false;

    //Initialize the user object
    this.user = {} as UserModel

    //If a user is signed in:
    if(this.isSignedIn){
      //Get the current session user's JSON data
      const userJSON = this.cookieService.get('session_user');

      //Parse the user JSON to get the a user object
      const userData = JSON.parse(userJSON);

      //Subscribe to findUserById to get the user from the database
      this.menuService.findUserById(userData.userId).subscribe({
        next: (user: any) => {
          //Set user variable to hold the user's data
          this.user = user;
        },
        error: (err) => {
          //Error handling
          console.log('error', err);
          this.errorMessage = err.message;
        },

        complete: () => {
          //Output the user's name when successful
          console.log(this.user.firstName)
        }
      })
    }
  }

  //Function for adding a menu item to the user's cart
  addToCart(dish: any){
    //Create a newUser variable as an instance of user model
    let newUser = {} as UserModel;

    //Set all user fields to match the currently logged in user's information
    newUser.firstName = this.user.firstName;
    newUser.lastName = this.user.lastName;
    newUser.email = this.user.email;
    newUser.password = this.user.password;
    newUser.userId = this.user.userId;
    newUser.cart = this.user.cart

    //Add the new item to the user's cart
    newUser.cart.push(dish);
    console.log(this.user.userId)

    //Call the menu service to edit the current user so the dish is added to their cart
    this.menuService.updateUser(this.user.userId, newUser).subscribe({
      next:(res) => {
        //Display a success message stating that the item has been added to the cart
        this.successMessage = dish.name + " has been added to your cart"

        //Hide the successMessage alert
        this.hideAlert();
      },
      // Error handling
      error: (err) => {
        console.log('error', err);
        this.errorMessage = err.message;
        if (err = new Error('Unable to add item to cart') ) {
          this.errorMessage = 'Item not added to cart';
        }
        //Hide the error message
        this.hideAlert();
      }
    })
  }

    // Set a timeout for alert displays
    hideAlert() {
      setTimeout( () => {
        this.errorMessage = '';
        this.successMessage= '';
      }, 5000)
    }
}
