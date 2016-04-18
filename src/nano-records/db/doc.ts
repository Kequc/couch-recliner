import {default as Db, iNanoError} from '../db';
import {default as Doc} from '../doc';
import {default as DbDocAttachment} from './doc/attachment';
import deepExtend = require('deep-extend');

export default class DbDoc
{
  db: Db;
  attachment: DbDocAttachment;
  
  constructor (db: Db)
  {
    this.db = db;
    this.attachment = new DbDocAttachment(this);
  }
  
  create (body: { [index: string]: any }, callback: (err?: Error, doc?: Doc)=>any = ()=>{}, tries: number = 0)
  {
    tries++;
    this._performCreate(body, (err, result) => {
      if (err) {
        if (tries <= 1 && err.reason === 'no_db_file') {
          // create db
          this._performDbCreate((err) => {
            if (err)
              callback(err);
            else
              this.create(body, callback, tries);
          });
        }
        else
          callback(err);
      }
      else {
        let doc = new Doc(this.db, body); 
        doc.body['_id'] = result['id'];
        doc.body['_rev'] = result['rev'];
        callback(null, doc); // created successfully
      }
    });
  }
  
  private _performCreate (body: { [index: string]: any }, callback: (err: iNanoError, result: { [index: string]: any })=>any)
  {
    this.db.raw.insert(body, callback);
  }
  
  private _performDbCreate (callback: (err: iNanoError)=>any)
  {
    this.db.nano.db.create(this.db.dbName, callback);
  }
  
  get (id: string, callback: (err?: Error, doc?: Doc)=>any = ()=>{})
  {
    this._performGet(id, (err, result) => {
      if (err)
        callback(err);
      else
        callback(null, new Doc(this.db, result)); // document found!
    });
  }
  
  private _performGet (id: string, callback: (err: Error, result: Object)=>any)
  {
    this.db.raw.get(id, callback);
  }
  
  update (id: string, body: { [index: string]: any }, callback: (err?: Error)=>any = ()=>{})
  {
    this.get(id, (err, doc) => {
      if (err)
        callback(err);
      else
        doc.update(body, callback); // attempt update
    });
  }
  
  updateOrCreate (id: string, body: { [index: string]: any }, callback: (err?: Error, doc?: Doc)=>any = ()=>{})
  {
    this.get(id, (err, doc) => {
      if (err)
        this.create(deepExtend({}, body, { '_id': id }), callback); // attempt create
      else {
        doc.update(body, (err) => {
          if (err)
            callback(err);
          else
            callback(null, doc);
        }); // attempt update
      }
    });
  }
  
  destroy (id: string, callback: (err?: Error)=>any = ()=>{})
  {
    this.get(id, (err, doc) => {
      if (err)
        callback(err);
      else
        doc.destroy(callback); // attempt destroy
    });
  }
}
