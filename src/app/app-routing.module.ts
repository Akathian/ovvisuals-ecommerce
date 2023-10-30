import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { environment } from 'src/environments/environment';
import * as firebase from 'firebase';

import { LoginComponent } from './components/login/login.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import 'firebase/database';
import 'firebase/auth';
import { AdminComponent } from './components/admin/admin.component';

firebase.initializeApp(environment.firebaseConfig);
firebase.analytics();

const routes: Routes = [
  { path: '', component: GalleryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
];
// { path: 'custom', component: CustomComponent },

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
