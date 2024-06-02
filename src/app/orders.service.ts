///--------------------------------------------
//Title: orders.service.ts
//Author: Kyle Hochdoerfer
//Date: 05/10/24
//Description: Order service for Web Dev Grill
//---------------------------------------------

//Import statements
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//Create and export the order service
@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  //Declare a constructor that passes in httpClient
  constructor(private http: HttpClient) { }

  //Function for finding the user's orders
  findOrdersById(id: string){
    return this.http.get('/api/orders/' + id);
  }
}
