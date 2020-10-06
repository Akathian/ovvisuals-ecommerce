import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrowserModule } from '@angular/platform-browser';

import { ProductListComponent } from './components/product-list/product-list.component';
import { CustomComponent } from './components/custom/custom.component';
import { AboutComponent } from './components/about/about.component';
import { ProductPageComponent } from './components/product-list/product-page/product-page.component';
import { LoginComponent } from './components/login/login.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { TermsComponent } from './components/legal/terms/terms.component';

import { environment } from 'src/environments/environment';
import { ShippingComponent } from './components/checkout/shipping/shipping.component';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';;
import { PrivacyComponent } from './components/legal/privacy/privacy.component';
import { AdminComponent } from './components/admin/admin.component';


firebase.initializeApp(environment.firebaseConfig);

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:type', component: ProductListComponent },
  { path: 'products/:type/:id', component: ProductPageComponent },
  { path: 'custom', component: CustomComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/:cat', component: LoginComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'gallery/:content', component: GalleryComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'shipping', component: ShippingComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/:cat', component: AdminComponent },
  { path: 'admin/:cat/:uid', component: AdminComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes),],
  exports: [RouterModule]
})
export class AppRoutingModule { }


