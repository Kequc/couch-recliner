import {default as Err, ErrCallback} from './err';
import {default as Db} from './db';
import {default as Doc} from './doc';
import deepExtend = require('deep-extend');

export interface ErrModelCallback {
    (err?: Err, model?: Model): any;
}

export default class Model {
    static db: Db;
    doc: Doc;

    protected _changes: SimpleObject = {};

    constructor (data: Doc|SimpleObject = {}) {
        if (data instanceof Doc)
            this.doc = data;
        else
            this._changes = data;
    }

    static find (id: string, callback: ErrModelCallback = ()=>{}) {
        if (!this.db)
            callback(Err.missingDecorator());
        else {
            this.db.doc.read(id, (err, doc) => {
                if (doc)
                    callback(err, new this(doc));
                else
                    callback(err);
            });
        }
    }

    getAttr (path: string): any {
        const parts = path.split('.');
        let node = this._changes;
        for (const part of parts) {
            node = node[part];
            if (node === undefined) return this._getDocAttr(parts);
        }
        return deepExtend({}, node);
    }

    protected _getDocAttr (parts: string[]): any {
        if (!this.doc) return undefined;
        let node = this.doc.body;
        for (const part of parts) {
            node = node[part];
            if (node === undefined) return undefined;
        }
        return deepExtend({}, node);
    }

    setAttr (path: string, value: any) {
        const parts = path.split('.');
        const key = parts.pop();
        const added: SimpleObject = {};
        let node = added;
        for (const part of parts) {
            node = node[part] = {};
        }
        node[key] = value;
        deepExtend(this._changes, added);
    }

    getId (): string {
        return (this.doc ? this.doc.getId() : this._changes['_id']);
    }

    getDb (): Db {
        return (<any>this.constructor).db;
    }

    save (callback: ErrCallback = ()=>{}) {
        this.update(this._changes, (err) => {
            if (!err)
                this._changes = {};
            callback(err);
        });
    }

    update (body: SimpleObject, callback: ErrCallback = ()=>{}) {
        if (!this.getDb())
            callback(Err.missingDecorator());
        else if (this.doc)
            this.doc.update(body, callback);
        else {
            this.getDb().doc.updateOrWrite(this.getId(), body, (err, doc) => {
                if (doc)
                    this.doc = doc;
                callback(err);
            });
        }
    }

    destroy (callback: ErrCallback = ()=>{}) {
        if (!this.getDb())
            callback(Err.missingDecorator());
        else
            this.getDb().doc.destroy(this.getId(), callback);
    }
}
