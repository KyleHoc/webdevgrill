/**
 * Title: app-routing.module.ts
 * Author: Kyle Hochdoerfer
 * Date: 3/6/24
 */

// imports statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';
import { AboutComponent } from './about/about.component';

// routes array with a path, component, and title for each route in the application (e.g. home, about, contact, etc.)
const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'Web Dev Grill: Home' // title for the home page
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'Web Dev Grill: Home'
      },
      {
        path: 'menu',
        component: MenuComponent,
        title: "Web Dev Grill: Menu"
      },
      {
        path: 'cart',
        component: CartComponent,
        title: "Web Dev Grill: Your Cart"
      },
      {
        path: 'orders',
        component: OrdersComponent,
        title: "Web Dev Grill: Your Orders"
      },
      {
        path: 'about',
        component: AboutComponent,
        title: "Web Dev Grill: About Us"
      }
    ]
  },
  {
    // path for the security module (e.g. login, register, forgot password, etc.)
    path: 'security',
    loadChildren: () => import('./security/security.module').then(m => m.SecurityModule)
  }
];

@NgModule({
  // imports the RouterModule and defines the routes array and other options (e.g. useHash, enableTracing, scrollPositionRestoration)
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false, scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
