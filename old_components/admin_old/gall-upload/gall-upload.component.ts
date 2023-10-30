import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
@Component({
  selector: 'app-gall-upload',
  templateUrl: './gall-upload.component.html',
  styleUrls: ['./gall-upload.component.scss']
})
export class GallUploadComponent implements OnInit {
  cat;
  uid;
  customForm;
  categories = [];
  // eslint-disable-next-line prettier/prettier
  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) {
    this.customForm = this.formBuilder.group({ caption: '', link: '', 'new-category': '' });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.uid = params.get('uid');
      this.cat = params.get('cat');

      this.getCategories();
    });
  }

  onSubmit(event) {
    const galObj = {
      caption: event.caption,
      src: event.link,
      thumb: event.link
    };
    const new_cat = event['new-category'];
    delete event.caption;
    delete event.link;
    delete event['new-category'];
    const cats = Object.keys(event);
    for (const cat of cats) {
      firebase.database().ref('Gallery/' + cat + '/').once('value', function(catData) {
        const new_i = Object.keys(catData.val()).length;
        const updates = {};
        updates['Gallery/' + cat + '/' + new_i] = galObj;
        firebase.database().ref('Gallery/all/').once('value', function(allData) {
          const new_all_i = Object.keys(allData.val()).length;
          updates['Gallery/all/' + new_all_i] = galObj;
          firebase.database().ref().update(updates);
        });
      });
    }
    if (new_cat != '') {
      firebase.database().ref('Gallery/' + new_cat + '/').once('value', function(catData) {
        let new_i;
        try { new_i = Object.keys(catData.val()).length; } catch (e) { new_i = 0; }
        const updates = {};
        updates['Gallery/' + new_cat + '/' + new_i] = galObj;
        firebase.database().ref('Gallery/all/').once('value', function(allData) {
          const new_all_i = Object.keys(allData.val()).length;
          updates['Gallery/all/' + new_all_i] = galObj;
          firebase.database().ref().update(updates);
        });
      });
    }
    window.location.reload();
  }


  getCategories() {
    const self = this;
    firebase.database().ref('Gallery/').on('value', function(galData) {
      const a = Object.keys(galData.val());
      a.shift();
      self.categories = a;
    });
  }

  selectBox(name, event) {
    if (event.srcElement.checked) {
      this.customForm.value[name] = event.srcElement.checked;
    } else {
      delete this.customForm.value[name];
    }
  }

}
