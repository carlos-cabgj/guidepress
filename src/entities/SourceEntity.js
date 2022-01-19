import EntityAbstract from './EntityAbstract.jsx';
import { v4 as uuidv4 } from 'uuid';

export default class SourceEntity extends EntityAbstract
{
  constructor(data = []){
    super();
    this.attrs = {
      id         : uuidv4(),
      name       : 'Novo Conteúdo',
      author     : '',
      thumb      : 'add',
      thumbColor : 'gray',
      image      : '',
      url        : '',
      description: '',
      category   : '',
      active     : true,
      items      : [],
      created    : '',
      status     : 'new' // new, loaded, error
    }
    if(data){
      this.fill(data);
    }
  }
}