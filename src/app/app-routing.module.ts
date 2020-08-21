import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrowserModule } from '@angular/platform-browser';

import { ProductListComponent } from './components/shopping-cart/product-list/product-list.component';
import { PostersComponent } from './components/shopping-cart/product-list/posters/posters.component';
import { CustomComponent } from './components/shopping-cart/product-list/custom/custom.component';
import { AboutComponent } from './components/about/about.component';


const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'posters', component: PostersComponent },
  { path: 'custom', component: CustomComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


