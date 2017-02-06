Nano Records
===

A module for interacting with CouchDB through [nano](https://github.com/dscape/nano) with Nodejs.

Conflicts are avoided with automated retries, errors are sanitised, designs are persisted on an as-needed basis, and so on. Intended to make life simpler by abstracting away some general database busywork and hopefully makes it easy to get up and running.

[npm](https://www.npmjs.com/package/nano-records)

### Upgrading from 1.0.9 to 1.1.0

* `db.doc.forcedWrite` is now `db.doc.write`
* `db.doc.write` has been removed
* `db.doc.forcedUpdate` is now `db.doc.updateOrWrite`
* `db.designs.show` is now `db.show.catalog`
* `db.designs.view` is now `db.view.catalog`

### Install

```
npm install nano --save
npm install nano-records --save
```
```javascript
const nano = require('nano')("localhost");
const NanoRecords = require('nano-records');
const dbName = "my-database";
const db = new NanoRecords(nano, dbName);
```

Each NanoRecords instance represents one database.

Provide NanoRecords with a running instance of nano and a chosen database name. This should be all you need to get started.

### Documents

#### .create

Easiest way to persist a new record, returns a NanoRecords document, the `_id` attribute is generated by CouchDB.

```javascript
db.doc.create(body, (err, doc) => {
  if (err)
    return;
  // doc is a NanoRecords document
  console.log(doc.body);
});
```

#### .read

Retrieve the latest version of the body of a document.

```javascript
doc.read((err) => {
  if (!err)
    console.log('success!');
});
db.doc.read(id, (err, doc) => {
  if (err)
    return;
  // doc is a NanoRecords document
  console.log(doc.body);
});
```

#### .write

Overwrite an existing document or create a new document if one doesn't exist.

```javascript
doc.write(body, (err) => {
  if (!err)
    console.log('success!');
});
db.doc.write(id, body, (err, doc) => {
  if (err)
    return;
  // doc is a NanoRecords document
  console.log(doc.body);
});
```

#### .update

Deeply extend an existing document.

```javascript
doc.update(body, (err) => {
  if (!err)
    console.log('success!');
});
db.doc.update(id, body, (err, doc) => {
  if (err)
    return;
  // doc is a NanoRecords document
  console.log(doc.body);
});
```

#### .updateOrWrite

Deeply extend an existing document or create a document if one doesn't exist.

```javascript
db.doc.updateOrWrite(id, body, (err, doc) => {
  if (err)
    return;
  // doc is a NanoRecords document
  console.log(doc.body);
});
```

#### .destroy

Remove a document.

```javascript
doc.destroy((err) => {
  if (!err)
    console.log('success!');
});
db.doc.destroy(id, (err) => {
  if (!err)
    console.log('success!');
});
```

#### .head

Retrieve header information.

```javascript
doc.head((err, rev, result) => {
  if (err)
    return;
  // rev is the most up to date document revision
  console.log(result);
});
db.doc.head(id, (err, rev, result) => {
  if (err)
    return;
  // rev is the most up to date document revision
  console.log(result);
});
```

#### .getId .getRev .getBody

Access the document body's `_id` and `_rev` properties. Another way of writing `doc.body['_id']` and `doc.body['_rev']`.

Create a deep clone of the full document body `deepExtend({}, doc.body)`<sup>[1](https://github.com/unclechu/node-deep-extend)</sup>.

```javascript
doc.getId() == doc.body['_id']; // true
doc.getRev() == doc.body['_rev']; // true

doc.getBody(); // {}
```

### Attachments

#### .read

Read an attachment.

```javascript
doc.attachment.read(name, (err, data) => {
  if (err)
    return;
  console.log(data.length);
});
db.doc.attachment.read(id, name, (err, data) => {
  if (err)
    return;
  console.log(data.length);
});
```

#### .write

Overwrite an existing attachment with the same name or create a new attachment if one doesn't exist.

```javascript
doc.attachment.write(name, data, mimeType, (err) => {
  if (!err)
    console.log('success!');
});
db.doc.attachment.write(id, name, data, mimeType, (err) => {
  if (!err)
    console.log('success!');
});
```

#### .destroy

Remove an attachment.

```javascript
doc.attachment.destroy(name, (err) => {
  if (!err)
    console.log('success!');
});
db.doc.attachment.destroy(id, name, (err) => {
  if (!err)
    console.log('success!');
});
```

#### .list .exists

Return attachment names as an array and whether a specific attachment exists.

```javascript
doc.attachment.list();
doc.attachment.exists(name);
```

### Attachment streams

#### .createReadStream

Read the attachment as a stream.

```javascript
doc.attachment.createReadStream(name, (err) => {
  if (!err)
    console.log('success!');
}).pipe(fs.createWriteStream('./my-file.txt'));
db.doc.attachment.createReadStream(id, name, (err) => {
  if (!err)
    console.log('success!');
}).pipe(fs.createWriteStream('./my-file.txt'));
```

#### .createWriteStream

Write an attachment using a stream. It's important to note that streams cannot be retried, if there is an error you will have to pipe a new stream manually.

```javascript
const reader = fs.createReadStream('./my-file.txt');
reader.pipe(doc.attachment.createWriteStream(name, mimeType, (err) => {
  if (!err)
    console.log('success!');
}));
```

### Designs

When creating your NanoRecords instance optionally provide it a catalog of designs to use. You can learn more about [Views](http://docs.CouchDB.org/en/1.6.1/couchapp/views/intro.html) and [Design Documents](http://docs.CouchDB.org/en/1.6.1/couchapp/ddocs.html) on the CouchDB website.

```json
// > ./designs.json
{
  "foo": {
    "views": {
      "comments": {
        "map": "function (doc) { ... };",
        "reduce": "function (keys, values, rereduce) { ... };"
      }
    },
    "shows": {
      "post": "function (doc, req) { ... };"
    }
  },
  "bar": {
    "language": "javascript",
    "views": {}
  }
}
```
```javascript
const designs = require('./designs.json');
const db = new NanoRecords(nano, dbName, designs);
```

#### .catalog

Persist a show using the provided design (ie. `"foo"`) and name (ie. `"post"`) if it's not already there, then return the result for the doc.

```javascript
db.show.catalog(id, design, name, (err, result) => {
  if (err)
    return;
  console.log(result);
});
```

Persist a view similar to `db.show.catalog` and return the result. An empty list object is returned if there is an error.

```javascript
db.view.catalog(design, name, params, (err, list) => {
  if (err)
    return;
  // list is a NanoRecords list
  console.log(list.values());
});
```

### View helpers

#### .all

Will generate a view for you using the provided keys, which returns a list of documents.

Useful for simple search functions, for example `keys` may be `"user_id"` then you can provide `{ key: "myuserid" }` to `params` and find relevant results. The `keys` parameter may also be an array of values, or nested values. It's best not to provide parameters to this function which are dynamic in nature, as a new view is persisted to the database for each set of keys provided.

Complex views are still best constructed manually. Read more about view helpers on: [CouchDB design documents using view helpers in nano-records](http://www.kequc.com/2016/05/24/couchdb-design-documents-using-view-helpers-in-nano-records).

```javascript
db.view.all(keys, params, (err, list) => {
  if (err)
    return;
  // list is a NanoRecords list
  console.log(list.values());
});
```

#### .only

Will generate a view similar to `view.all` which only returns a specific set of values from each document. For example `["created_at", "title", "author.name"]` would return `{ created_at: "mydate", title: "mytitle", author: { name: "myauthorname" } }` as each result.

This is more efficient than performing a full document lookup.

```javascript
db.view.only(keys, values, params, (err, list) => {
  if (err)
    return;
  // list is a NanoRecords list
  console.log(list.values());
});
```

### Lists

The `list.docs` method may not give you complete document objects depending on the values that were returned by the view. However running `doc.read` will fetch the full document from the database, similarly all normal NanoRecords document functions should work as you expect.

A common way to get just the first document is `list.doc(0)`.

```javascript
list.total; // 11
list.offset; // 0
list.rows; // raw result
list.ids(); // [ids...]
list.keys(); // [keys...]
list.values(); // [values...]
list.docs(); // [NanoRecords documents...]
list.doc(index); // NanoRecords document
```

### Db

#### .create

You should never need to but it is there if you want to use it.

```javascript
db.create((err) => {
  if (!err)
    console.log('success!');
});
```

#### .destroy

Destroy the database, first parameter must be `_DESTROY_`.

```javascript
db.destroy("_DESTROY_", (err) => {
  if (!err)
    console.log('success!');
});
```

#### .reset

Destroy and then recreate the database, first parameter must be `_RESET_`.

```javascript
db.reset("_RESET_", (err) => {
  if (!err)
    console.log('success!');
});
```

### Errors

```javascript
err.scope; // source of the error
err.name; // error code
err.message; // more information
err.raw; // the full error returned from nano

// common errors
// ==
// not_found: Not found.
// missing_id: Id parameter required.
// conflict: There was a conflict.
// malformed_script: Problem with one of your designs.
// no_db_file: Database missing.
```

When an error is returned it has the above format. Generally you should never see `no_db_file` or `conflict` so maybe these are not so common errors.

A `conflict` would only happen if the max number of retries was reached on a request, possibly you have too much activity on a single document.

You might see `no_db_file` if your CouchDB has security locked down.

### Contribute

If you like what you see please feel encouraged to [get involved](https://github.com/Kequc/nano-records/issues) report problems and submit pull requests! As of the time of this writing the project is new with one maintainer.
