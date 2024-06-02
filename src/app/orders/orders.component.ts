///--------------------------------------------
//Title: orders.component.ts
//Author: Kyle Hochdoerfer
//Date: 05/17/24
//Description: Orders component for Web Dev Grill
//---------------------------------------------

//Import statements
import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { OrdersService } from '../orders.service';

//Create and export the orders component
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {

  //Create variables to hold isSigned in and user
  isSignedIn: boolean;
  errorMessage: string;
  orders: any;
  orderData: any;

  constructor(private cookieService: CookieService, private router: Router, private ordersService: OrdersService){
    //Determine if the user is signed in using cookie service
    this.isSignedIn = this.cookieService.get('session_user') ? true : false;

    this.errorMessage = '';
    this.orders = [];
    this.orderData = [];

    //If a user is signed in:
    if(this.isSignedIn){
      //Get the current session user's JSON data
      const userJSON = this.cookieService.get('session_user');

      //Parse the user JSON to get the a user object
      const userData = JSON.parse(userJSON);

      //Subscribe to findOrdersById to get the orders from the database
      this.ordersService.findOrdersById(userData.userId).subscribe({
        next: (orders: any) => {
          let tax = 0;

          orders.forEach( (order: any) => {
            this.orders.push(order.items);
            tax = (order.total * .08) + order.total;
            this.orderData.push([order.orderTime, order.total, tax.toFixed(2), order.orderId])
          });

        },
        error: (err) => {
          //Error handling
          console.log('error', err);
          this.errorMessage = err.message;
        },

        complete: () => {
          console.log(this.orderData)
        }
      })
    }
  }
}
