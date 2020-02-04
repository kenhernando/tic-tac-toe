import { Injectable } from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {

  constructor() { }
  createDb(){

    const config = [{
      id:  0,
      color: 'primary',
      label: '?',
      disabled: false,
      tempData: 0
    }, {
      id:  1,
      color: 'primary',
      label: '?',
      disabled: false,
      tempData: 0
    }, {
      id:  2,
      color: 'primary',
      label: '?',
      disabled: false,
      tempData: 0
    }, {
      id:  3,
      color: 'primary',
      label: '?',
      disabled: false,
      tempData: 0
    }, {
      id:  4,
      color: 'primary',
      label: '?',
      disabled: false,
      tempData: 0
    }, {
      id:  5,
      color: 'primary',
      label: '?',
      disabled: false,
      tempData: 0
    }, {
      id:  6,
      color: 'primary',
      label: '?',
      disabled: false,
      tempData: 0
    }, {
      id:  7,
      color: 'primary',
      label: '?',
      disabled: false,
      tempData: 0
    }, {
      id:  8,
      color: 'primary',
      label: '?',
      disabled: false,
      tempData: 0
    }];
 
    return {config};
 
   }

}


