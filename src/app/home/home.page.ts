/**
 * Shoppr - E-commerce app starter Ionic 4(https://www.enappd.com)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source .
 * 
 */
import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MenuController, IonSlides } from '@ionic/angular';
import { FunctionsService } from '../functions.service';
import { DataService, HomeTab, Product } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('Slides') slides: IonSlides;

  segment = '';
  index = 0;
  data: any = [];  //Category list
  categories: any = {};
  products: any = {};
  tempdata: Array<Array<Product>> = [];
  // sponsored: Array<Product> = [];
  // product_data_1: Array<Product> = [];
  // product_data_2: Array<Product> = [];
  // product_data_3: Array<Product> = [];
  // product_data_4: Array<Product> = [];
  // product_data_5: Array<Product> = [];
  slideOpts = {
    effect: 'flip',
    zoom: false
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private menuCtrl: MenuController,
    private fun: FunctionsService,
    private dataService: DataService,
    public apiService: ApiService,
    private ref: ChangeDetectorRef) {
    // this.data = [];
    // this.data = dataService.tabs;
    // this.sponsored = dataService.sponsored;
    // this.product_data_1 = dataService.products_1;
    // this.product_data_2 = dataService.products_2;
    // this.product_data_3 = dataService.products_3;
    // this.product_data_4 = dataService.products_4;
    // this.product_data_5 = dataService.products_5;
    this.tempdata = [
      dataService.sponsored,
      dataService.products_1,
      dataService.products_2,
      dataService.products_3,
      dataService.products_4,
      dataService.products_5,
    ];

    const d = this.activatedRoute.snapshot.paramMap.get('id');
    if (d) {
      this.segment = this.data[parseInt(d, 10)].title;
    } else {
      // this.segment = this.data[0].title;
    }
    this.apiService.post("product/category", {})
      .then((values: any) => {
        var { result, data } = values;
        if (!result) return;

        this.categories = data;
        this.data = this.getToolbarNames();
        if (this.data.length > 0) {
          this.segment = this.data[0].name;
          this.update(0);
        }
        dataService.tabs = this.data;
      });
  }

  getToolbarNames() {
    var data = [];
    Object.keys(this.categories).forEach(key => {
      var { id_parent } = this.categories[key];
      if (id_parent == 2)
        data.push(this.categories[key]);
    });
    return data;
  }

  getSubCategories(category_id) {
    var data = [];
    Object.keys(this.categories).forEach(key => {
      var { id_parent } = this.categories[key];
      if (id_parent == category_id)
        data.push(this.categories[key]);
    });
    return data;
  }

  onSubCategory(id_parent, data) {
    var { id_category } = data;

    this.apiService.post("product/items", { categoryId: id_category, isGroupBy: 1 })
      .then((values: any) => {
        var { result, data } = values;
        if (!result) return;

        data = this.fun.processProductData(data);
        this.products [id_parent] = data;
        console.log(this.products);
        this.ref.detectChanges();
      });
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'start');
    this.menuCtrl.enable(true, 'end');
  }

  seg(event) {
    console.log("SEG");
    this.segment = event.detail.value;
  }

  drag() {
    let distanceToScroll = 0;
    for (let index in this.data) {
      if (parseInt(index) < this.index) {
        distanceToScroll = distanceToScroll + document.getElementById('seg_' + index).offsetWidth + 24;
      }
    }
    document.getElementById('dag').scrollLeft = distanceToScroll;
  }

  preventDefault(e) {
    e.preventDefault();
  }

  async change() {
    await this.slides.getActiveIndex().then(data => this.index = data);
    this.segment = this.data[this.index].name;
    this.update(this.index);
    this.drag();
  }

  side_open() {
    this.menuCtrl.toggle('end');
  }

  update(i) {
    this.slides.slideTo(i).then((res) => console.log('responseSlideTo', res));

    return;
    var category = this.data[i];
    var { id_category } = category;
    if (this.products[id_category]) {
      console.log("Use original item");
      return;
    }

    this.apiService.post("product/items", { id_category })
      .then((values: any) => {
        console.log("update i: ", i);
        if (!values.result) return;
        this.products[i] = this.apiService.convertProducts(values.data);
        // this.products [i] = this.tempdata [i % 6];
        this.ref.detectChanges();
        console.log("Products", this.products);
        // this.slides.slideTo(i).then((res) => console.log('responseSlideTo', res));
      });
  }
}
