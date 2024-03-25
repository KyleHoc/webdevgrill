/**
    Title: menu.service.ts
    Author: Kyle Hochdoerfer
    Date: 03/15/24
    Description: Menu service
*/

//Import statements
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from './security/user-model';

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

  //Returns http request for finding a menu document based on the provided name
  findMenuItemByName(name: string){
    return this.http.get('/api/menu/' + name)
  }

  //Returns http request for finding a user document based on the provided ID
  findUserById(id: string){
    return this.http.get('/api/security/' + id)
  }

  //Returns http request for updating a user
  updateUser(id: string, user: UserModel){
    return this.http.put('api/security/' + id, { user })
  }
}