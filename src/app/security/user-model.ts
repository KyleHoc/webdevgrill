/**
 * Title: user-model.ts
 * Author: Kyle Hochdoerfer
 *  Date: 03/17/24
 * Description: User Interface for registration
*/

//Create and export the user model
export interface UserModel {
  userId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  cart: Array<any>;
}
