/**
    Title: menu.component.ts
    Author: Kyle Hochdoerfer
    Date: 03/14/24
    Description: Menu component
*/

//Import statements
import { Component } from '@angular/core';
import { MenuService } from '../menu.service';

//Create and export the menu component
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  //Initialize menu and error message variables
  menu: any;
  errorMessage: string

  //Initialize variables for each type of menu object
  appetizers: any;
  entrees: any;
  desserts: any;

  //Declare a constructor that passes in the menu service
  constructor(private menuService: MenuService){
    //Set menu variables and error message to empty arrays and an empty string
    this.menu = []
    this.appetizers = []
    this.entrees = []
    this.desserts = []
    this.errorMessage = ''

    //Subscribe to the menu service using the menu service's find all menu items function
    this.menuService.findAllMenuItems().subscribe({
      next: (menuData: any ) => {
        //Output the list of menu items, and save the menu variable as an array of menu objects
        console.log ('List of menu items:', this.menu);
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
  }
}
