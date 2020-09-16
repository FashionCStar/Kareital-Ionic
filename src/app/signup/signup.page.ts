/**
 * Shoppr - E-commerce app starter Ionic 4(https://www.enappd.com)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source .
 * 
 */
import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FunctionsService } from '../functions.service';
import { MenuController, ModalController, ActionSheetController } from '@ionic/angular';
import { InfomodalPage } from '../infomodal/infomodal.page';
import { DataService } from '../data.service';
import { ApiService } from '../api.service';

import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  first_name = '';
  last_name = '';
  email = '';
  password = '';
  birthday = '';
  avatar_url = '';

  constructor(
    private fun: FunctionsService,
    private menuCtrl: MenuController,
    private modalController: ModalController,
    private data: DataService,
    private apiService: ApiService,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private file: File,
    private sanitizer: DomSanitizer,
    private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
    this.avatar_url = '/uploads/profile.png';
  }

  readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      const formData = new FormData();
      formData.append('name', 'Hello');
      formData.append('file', imgBlob, file.name);
      this.apiService.post("auth/upload", formData).then((response: any) => {
        const { result, filepath } = response;
        if (result) {
          this.avatar_url = filepath;
          this.changeDetector.detectChanges();
        }
      })
    };
    reader.readAsArrayBuffer(file);
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      this.file.resolveLocalFilesystemUrl(imageData).then((entry: FileEntry) => {
        entry.file(file => {
          console.log("select image file", file);
          this.readFile(file);
        });
      });
    }, (err) => {
      // Handle error
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Avatar",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }
  signup() {
    if (this.first_name != '' && this.last_name != '' && this.email != '' && this.password != '' && this.fun.validateEmail(this.email)) {
      this.apiService.post("auth/signup", {
        firstname: this.first_name,
        lastname: this.last_name,
        email: this.email,
        passwd: this.password,
        birthday: this.birthday,
        avatar_url: this.avatar_url
      }).then((response: any) => {
        const { result, message, data } = response;
        if (result) {
          this.data.logged_user = data;
          this.fun.navigate('home', false);
        } else
          this.fun.presentToast(message, false, 'bottom', 2100);
      })
    }
    else {
      this.fun.presentToast('Wrong Input', true, 'bottom', 2100);
    }
  }

  async open_modal(b) {
    let modal;
    if (b) {
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { value: this.data.terms_of_use, title: 'Terms of Use' }
      });
    }
    else {
      modal = await this.modalController.create({
        component: InfomodalPage,
        componentProps: { value: this.data.privacy_policy, title: 'Privacy Policy' }
      });
    }
    return await modal.present();
  }
  
  safePath(path) {
    return this.sanitizer.bypassSecurityTrustUrl(path);
  }
}
