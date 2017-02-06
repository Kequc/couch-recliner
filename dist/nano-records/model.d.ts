import { default as Err, ErrCallback } from './err';
import { default as Db } from './db';
import { default as Doc } from './doc';
export interface ErrModelCallback {
    (err?: Err, model?: Model): any;
}
export default class Model {
    static db: Db;
    doc: Doc;
    protected _changes: SimpleObject;
    constructor(data?: Doc | SimpleObject);
    static find(id: string, callback?: ErrModelCallback): void;
    getAttr(path: string): any;
    protected _getDocAttr(parts: string[]): any;
    setAttr(path: string, value: any): void;
    getId(): string;
    getDb(): Db;
    save(callback?: ErrCallback): void;
    update(body: SimpleObject, callback?: ErrCallback): void;
    destroy(callback?: ErrCallback): void;
}
