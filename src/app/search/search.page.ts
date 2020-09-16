/**
 * Shoppr - E-commerce app starter Ionic 4(https://www.enappd.com)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source .
 * 
 */
import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { DataService } from '../data.service';
import { HomePage } from '../home/home.page';
import { NavController, MenuController } from '@ionic/angular';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  trending = [];
  recent = [];
  searchKey = "";
  searchResult = [];

  constructor(private menuCtrl: MenuController,
    private fun: FunctionsService,
    private dataService: DataService,
    private nav: NavController,
    public apiService: ApiService) {
    this.trending = dataService.tabs;
    this.recent = dataService.recent;
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(false, 'end');
  }

  onSearch() {
    if (this.searchKey == "") return;

    this.apiService.post("product/search", { key: this.searchKey })
      .then((values: any) => {
        var { result, data } = values;
        if (!result) return;
        
        this.searchResult = this.fun.processProductData(data);
      });
  }
}
