///--------------------------------------------
//Title: cart.service.ts
//Author: Kyle Hochdoerfer
//Date: 04/11/24
//Description: Cart service for Web Dev Grill
//---------------------------------------------

//Import statements
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//Create and export the cart service
@Injectable({
  providedIn: 'root'
})
export class CartService {

  //Declare a constructor that passes in httpClient
  constructor(private http: HttpClient) { }

  //Create a function for deleting an item from a cart
  deleteCartItem(userId: string, dishName: string){
    return this.http.delete('/api/cart/' + userId + '/' + dishName);
  }

  //Function for changing the cart quantity
  changeCartQuantity(userId: string, dishName: string, operation: string){
    return this.http.put('api/cart/' + userId + '/' + dishName + '/' + operation, userId);
  }

  //Function for submitting an order to the database
  submitOrder(userId: string, orders: any){
    return this.http.post('api/cart/' + userId, {orders});
  }
}
