/**
 * Shoppr - E-commerce app starter Ionic 4(https://www.enappd.com)
 *
 * Copyright © 2018-present Enappd. All rights reserved.
 *
 * This source code is licensed as per the terms found in the
 * LICENSE.md file in the root directory of this source .
 *
 */


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './data.service';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // urlPrefix = "http://localhost:3000/";
  // urlPrefix = "http://127.0.0.1:3000/";
  // urlPrefix = "http://192.168.108.165:3000/";
  urlPrefix = "http://api.kareita.com/";

  constructor(
    private httpClient: HttpClient
  ) { }

  post(url, body) {
    let requestUrl = `${this.urlPrefix}${url}`;
    return this.httpClient.post(requestUrl, body).toPromise();
  }

  convertProducts(from: Array<any>): Array<Product> {
    var to: Array<Product> = [];
    from.forEach(item => {
      to.push({
        name: item.reference,
        image: [],
        size: 'M',
        cost_price: item.price,
        stock: item.quantity,
      });
    });
    
    return to;
  }

  getCategoryImage(item) {
    return `http://kareita.com/c/${item.id_category}-category_default/${item.link_rewrite}.jpg`;
  }

  getSubCategoryImage(item) {
    return `http://kareita.com/c/${item.id_category}-small_default/${item.link_rewrite}.jpg`;
  }
}