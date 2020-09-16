import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FunctionsService } from '../functions.service';
import { MenuController, ModalController, ActionSheetController } from '@ionic/angular';
import { InfomodalPage } from '../infomodal/infomodal.page';
import { DataService } from '../data.service';
import { ApiService } from '../api.service';

import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.page.html',
  styleUrls: ['./updateprofile.page.scss'],
})
export class UpdateprofilePage implements OnInit {

  first_name = '';
  last_name = '';
  email = '';
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
    private sanitizer: DomSanitizer) {
      this.first_name = this.data.logged_user.firstname;
      this.last_name = this.data.logged_user.lastname;
      this.email = this.data.logged_user.email;
      this.birthday = this.data.logged_user.birthday;
      this.avatar_url = this.data.logged_user.avatar_url;
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  ngOnInit() {
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

  updateProfile() {
    if (this.first_name != '' && this.last_name != '' && this.email != '' && this.fun.validateEmail(this.email)) {
      this.apiService.post("auth/updateProfile", {
        id_customer: this.data.logged_user.id_customer,
        firstname: this.first_name,
        lastname: this.last_name,
        email: this.email,
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
  safePath(path) {
    return this.sanitizer.bypassSecurityTrustUrl(path);
  }
}
