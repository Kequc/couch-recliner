/* class List
 *
 * Represents a single result set containing references
 * to documents but perhaps only limited data from
 * each of them.
 *
 * Used in general for returned views.
 *
 */
'use strict';

class List {
    constructor(Model, body) {
        this.Model = Model;
        this.total = 0;
        this.offset = 0;
        this.rows = [];
        if (body) {
            this.total = body.total_rows;
            this.offset = body.offset;
            this.rows = body.rows;
        }
    }

    ids() {
        return this.rows.map(row => row.id);
    }

    keys() {
        return this.rows.map(row => row.key);
    }

    values() {
        return this.rows.map(row => row.doc || row.value);
    }

    docs() {
        return this.rows.map(row => _docForRow(this.Model, row));
    }

    doc(index) {
        return _docForRow(this.Model, this.rows[index]);
    }
}

function _docForRow(Model, row) {
    return (row ? new Model(row.doc || row.value, { id: row.id }) : undefined);
}

module.exports = List;
