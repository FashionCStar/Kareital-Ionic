/**
 * Shoppr - E-commerce app starter Ionic 4(https://www.enappd.com)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source .
 *
 */
import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './speech.page.html',
  styleUrls: ['./speech.page.scss'],
})
export class SpeechPage {

  email = '';
  password = '';

  constructor(
    public navCtrl: NavController, 
    private speechRecognition: SpeechRecognition, 
    private plt: Platform, 
    private cd: ChangeDetectorRef,
    private androidPermissions: AndroidPermissions
  ) {
  }
  matches: String[];
  isRecording = false;
  
  isIos() {
    return this.plt.is('ios');
  }
 
  stopListening() {
    this.speechRecognition.stopListening().then(() => {
      this.isRecording = false;
    });
  }

  checkPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
    );
    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.RECORD_AUDIO]);
  }
 
  getPermission() {
    this.speechRecognition.isRecognitionAvailable()
    .then((available: boolean) => { console.log("eeeeeeeeee - available", available); alert(available) });
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        console.log("eeeeeeeee - hasPermission: ", hasPermission);
        alert (hasPermission);
        if (!hasPermission) {
          this.speechRecognition.requestPermission();
        }
      })
      .catch(error => {
        console.log("eeeeeeeee - errorPermission: ", error);
      });
  }
 
  startListening() {
    let options = {
      language: 'en-US'
    }
    console.log("eeeeeeeeee - start listening");
    alert("started")
    this.speechRecognition.startListening(options).subscribe((matches) => 
      {
        this.matches = matches;
        console.log(this.matches[0] + "eeeeeeeeeee - matches");
        alert(this.matches[0]);
        this.cd.detectChanges();
      },
      (onerror) => {
        console.log('eeeeeeeeeeee - start error:', onerror);
        alert (onerror);
      }
    );
    this.isRecording = true;
  }
}
