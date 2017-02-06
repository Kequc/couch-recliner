/* class List
 *
 * Represents a single result set containing references
 * to documents but perhaps only limited data from
 * each of them.
 *
 * Used in general for returned views.
 *
 */
"use strict";
const _ = require("underscore");

const Doc = require("./doc");

class List {
    constructor(db, body) {
        this.total = 0;
        this.offset = 0;
        this.rows = [];
        this.db = db;
        if (body) {
            this.total = body.total_rows;
            this.offset = body.offset;
            this.rows = body.rows;
        }
    }

    ids() {
        return _.map(this.rows, (row) => { return row.id; });
    }

    keys() {
        return _.map(this.rows, (row) => { return row.key; });
    }

    values() {
        return _.map(this.rows, (row) => { return row.doc || row.value; });
    }

    docs() {
        return _.map(this.rows, (row) => { return this._docForRow(row); });
    }

    doc(index) {
        let row = this.rows[index];
        return (row ? this._docForRow(row) : undefined);
    }

    _docForRow(row) {
        return new this.db.doc.model(this.db, (row.doc || row.value), { id: row.id });
    }
}

module.exports = List;