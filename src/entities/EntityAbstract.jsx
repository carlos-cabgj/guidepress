import {Component} from 'react';

export default class EntityAbstract extends Component {

  get(key){
    return this.attrs[key];
  }

  set(key, value){
    this.attrs[key] = value;
  }

  fill(data){
    for(let i in this.attrs){
      if(data[i]){
        this.attrs[i] = data[i]
      }
    }
  }

  toArray(){
    return this.attrs;
  }
}