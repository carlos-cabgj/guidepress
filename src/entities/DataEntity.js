import { Component } from 'react';

export default class DataEntity extends Component {

  constructor(data = []){
    super();

    this.attrs = {
      name       : 'Novo Conteúdo',
      author     : '',
      thumb      : '/rss_p.png',
      image      : '',
      url        : '',
      description: '',
      category   : '',
      items      : [],
      created    : new Date(),
      status     : 'new' // new, loaded, error
    }
    if(data){
      this.fill(data)
    }
  }

  // validatorsAttrs = {
  //   "status" : (value){}
  // }

  // filterAttrs = {
  //   "status" : (value){}
  // }

  get(key){
    return this.attrs[key];
  }

  fill(data){
    for(let i in this.attrs){
      if(data[i]){
        this.attrs[i] = data[i]
      }
    }
  }

  setFilterStatus(value){

  }

  toArray(){
    return this.attrs;
  }
}