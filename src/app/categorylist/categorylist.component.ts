import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-categorylist',
  templateUrl: './categorylist.component.html',
  styleUrls: ['./categorylist.component.scss'],
})
export class CategorylistComponent implements OnInit {

  @Input() recieved_data: Array<any>;
  @Output() onOpen = new EventEmitter();

  constructor(
    public apiService: ApiService,
  ) { }

  ngOnInit() { }


  open(index, data) {
    this.recieved_data.forEach(item => item.selected = false);
    this.recieved_data [index].selected = true;
    
    this.onOpen.emit(data);
  }
}
