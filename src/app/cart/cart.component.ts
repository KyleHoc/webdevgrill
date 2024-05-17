///--------------------------------------------
//Title: cart.component.ts
//Author: Kyle Hochdoerfer
//Date: 04/09/24
//Description: Cart component for Web Dev Grill
//---------------------------------------------

//Import statements
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { MenuService } from '../menu.service';
import { UserModel } from '../security/user-model';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {

  //Create variables to hold isSigned in, user, total, tax and errorMessage
  isSignedIn: boolean;
  user: UserModel;
  errorMessage: string;
  successMessage: string;
  total: number;
  tax: number;

  //Create a variable to hold the user's cart
  myCart: any;

  //Declare a constructor that passes in the menu service
  constructor(private menuService: MenuService, private cookieService: CookieService, private cartService: CartService, private router: Router){
    //Determine if the user is signed in using cookie service
    this.isSignedIn = this.cookieService.get('session_user') ? true : false;

    //Initialize empty values for myCart, tax, and errorMessage
    this.myCart = [];
    this.errorMessage = '';
    this.successMessage = '';
    this.total = 0;
    this.tax = 0;

    //Initialize the user object
    this.user = {} as UserModel;

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

          console.log(this.user);

          //Set the cart total
          this.total = user.total;

          //Calculate sales tax
          this.tax = this.calculateTax(this.total);

          //Set myCart to hold the user's cart data
          this.myCart = user.cart;
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

  //Function for deleting an item from the user's cart
  deleteItem(userId: string, dishName: string, deleteAll: boolean){
    //Declare a variable for holding the value of the item being deleted
    let minusTotal = 0;

    if(deleteAll){
      //Confirm whether the user is sure that they want to delete the item or not
      if(!confirm("Are you sure you want to remove this item?")){
        return
      }
    }

    //Subscribe to the cart service to delete an item from the cart
    this.cartService.deleteCartItem(userId, dishName).subscribe({
      //If the item is deleted successfully, remove it from the cart array
      next: (res: any) => {
        console.log(dishName + ' removed from cart');

        //Get the dish item that's quantity is being changed
        let dish = this.myCart.find((element: { name: string; }) => element.name == dishName);

       //Convert the price of the item to a float
       let price = parseFloat(dish.price);

        //Calculate the amount being subtracted from the total
        minusTotal = (dish.quantity * price);

        //Set the calculated value to two decimal places
        minusTotal = parseFloat(minusTotal.toFixed(2));

        //Filter the cart to remove the deleted item
        this.myCart = this.myCart.filter((item: { name: string; }) => item.name !== dishName)

        //Update the total
        this.total = this.total - minusTotal;

        //Calculate sales tax
        this.tax = this.calculateTax(this.total);

        //Set the success message
        //this.successMessage = 'Item deleted'

        //Hide the resulting alert after five seconds
        //this.hideAlert()
      },
      error: (err) => {
        //If there is an error, log it to the console and set the error message
        console.log('error', err);
        this.errorMessage = err.message
        //this.hideAlert()
      }
    })
  }

  //Function for changing the cart quantity
  changeQuantity(userId: string, dishName: string, operation: string){

    //Subscribe to the cart service to change the cart quantity
    this.cartService.changeCartQuantity(userId, dishName, operation).subscribe({
      //If the quantity was successfully changed
      next: (res: any) => {

        //Get the dish item that's quantity is being changed
        let dish = this.myCart.find((element: { name: string; }) => element.name == dishName);

       //Convert the price of the item to a float
       let price = parseFloat(dish.price);


        //Determine if the operation is addition or subtraction
        if(operation == 'plus'){

          //If the quantity value is plus, add one to item quantity
          this.myCart.find((item: { name: string; }) => item.name == dishName).quantity++;

          //Update the total
          this.total =  this.total + price;

        } else {
          //Otherwise, subtract one from the item quantity
          this.myCart.find((item: { name: string; }) => item.name == dishName).quantity--;

          //Update the total
          this.total =  this.total - price;
        }

        //Calculate sales tax
        this.tax = this.calculateTax(this.total);
      },
      error: (err) => {
        //If there is an error, log it to the console and set the error message
        console.log('error', err);
        this.errorMessage = err.message
      }
    })
  }

  //Function for submitting an order to the database
  submitOrder(userId: string, order: any){
    //Subscribe to the cart service to change the cart quantity
    this.cartService.submitOrder(userId, order).subscribe({
      //If the quantity was successfully changed
      next: (res: any) => {
        //Output a message to the console stating that the quantity has been changed
        console.log(`Order submitted`);

        //Empty the cart UI
        this.myCart = [];

        //Reset the total
        this.total = 0;

        //Reset the tax
        this.tax = 0;

        //Change the success message
        this.successMessage = "Success! Your order has been submitted!"

        //Navigate back to the home page once an order has been made
        //this.router.navigate(['/']);
      },
      error: (err) => {
        //If there is an error, log it to the console and set the error message
        console.log('error', err);
        this.errorMessage = err.message
      }
    })
  }

  //Function for calculating sales tax
  calculateTax(total: number){
    //Calculate sales tax
    return this.tax = total * .08;
  }

  // Set a timeout for alert displays
  hideAlert() {
    setTimeout( () => {
      this.errorMessage = '';
      this.successMessage= '';
    }, 5000)
  }
}
