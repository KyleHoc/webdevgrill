/**
    Title: menu.service.ts
    Author: Kyle Hochdoerfer
    Date: 03/15/24
    Description: Menu service
*/

//Import statements
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  //Declare a constructor that passes in http using Http Client
  constructor(private http: HttpClient) { }

  //Returns http request for the findAllMenuItems API
  findAllMenuItems(){
    return this.http.get('/api/menu/')
  }
}