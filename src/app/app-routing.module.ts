import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrowserModule } from '@angular/platform-browser';

import { ProductListComponent } from './components/shopping-cart/product-list/product-list.component';
import { CustomComponent } from './components/shopping-cart/product-list/custom/custom.component';
import { AboutComponent } from './components/about/about.component';
import { ProductPageComponent } from './components/shopping-cart/product-page/product-page.component';
import { LoginComponent } from './components/login/login.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

import { environment } from 'src/environments/environment';

import * as firebase from 'firebase';

firebase.initializeApp(environment.firebaseConfig);

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:type', component: ProductListComponent },
  { path: 'products/:type/:id', component: ProductPageComponent },
  { path: 'custom', component: CustomComponent },
  { path: 'login', component: LoginComponent },
  { path: 'checkout', component: CheckoutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),],
  exports: [RouterModule]
})
export class AppRoutingModule { }


