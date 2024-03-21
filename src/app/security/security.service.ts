
/**
 * Title: security.service.ts
 * Author: Kyle Hochdoerfer
 *  Date: 03/19/24
 * Description: security service for Web Dev Grill
*/

//Import statements
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from './user-model';

//Create and export security service
@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  //Create a constructor that passes in HttpClient
  constructor(private http: HttpClient) { }

  // Pathway for signIn
 signIn(email: string, password: string) {
  return this.http.post('/api/security/signIn', { email, password })
 }

  //Registration function that returns an http post request with a new user object
  registerUser(user: UserModel){
    return this.http.post('/api/security/register', {user})
  }
}