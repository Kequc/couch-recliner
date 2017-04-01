Couch Recliner
===

Utility modules for interacting with CouchDB using Nodejs

#### Notice:

This repo is under heavy development my previous library is available on npm until this is ready.

[nano-records](https://www.npmjs.com/package/nano-records)

### Installation

```
npm install couch-recliner --save
```

### Usage

Couch Recliner exposes set of Model centric helper methods, therefore you must have a Model describing your database.

```javascript
const CouchRecliner = require('couch-recliner');

class Cat extends CouchRecliner.Model {
    meow() {
        console.log(this.body.name + ' meows.');
    }
}

Cat.dbName = 'cats';
```

Your model must have a `dbName` representing the database you want to use. Custom extensions access the document body at `this.body`, it is recommended not to modify the body directly. Instead manipulate data using the methods which follow.

### Creating documents

```javascript
Cat.create({ name: 'Sally' }, (err, doc) => {
    if (!err) doc.meow();
});
```
```
Sally meows.
```

In all instances you may choose instead to use the provided helpers directly. The following code example is equivalent to the above.

```javascript
const DocOperations = CouchRecliner.DocOperations;

DocOperations.create(Cat, { name: 'Sally' }, (err, doc) => {
    if (!err) doc.meow();
});
```

### Writing documents

In cases where you know which `id` you intend to use, and wish to write directly to that `id` overwriting anything which may be there.

```javascript
// Equivalent to: DocOperations.write(Cat, ...)

Cat.write('jacob', { name: 'Jacob' }, (err, doc) => {
    if (!err) doc.meow();
});
```
```
Jacob meows.
```

The above writes a document to the database with a fixed id of `jacob`. If you already have a `doc` instance you may choose to overwrite it, for this purpose there is `writeFixed`.

```javascript
// Equivalent to: DocOperations.writeFixed(doc, ...)

doc.write({ name: 'Jacob' }, (err) => {
    if (!err) doc.meow();
});
```
```
Jacob meows.
```

The write operation will overwrite any existing document, replacing it entirely, so be careful with it.

### Reading documents

If you have a document in the database and you want the most up to date version, use the `read` operation.

```javascript
// Equivalent to: DocOperations.read(Cat, ...)

Cat.read('jacob', (err, doc) => {
    if (!err) doc.meow();
});
```
```
Jacob meows.
```

You may also use this operation inline.

```javascript
// Equivalent to: DocOperations.readFixed(doc, ...)

doc.read((err) => {
    if (!err) doc.meow();
});
```
```
Jacob meows.
```

### Updating documents

```javascript
// Equivalent to: DocOperations.update(Cat, ...)

Cat.update('jacob', { breed: 'Cheshire' }, (err, doc) => {
    if (!err) console.log(doc.body.name + ' is a ' + doc.body.breed + ' cat.');
});
```
```
Jacob is a Cheshire cat.
```

For more complex updates look at [json-artisan](https://github.com/Kequc/json-artisan), Couch Recliner uses this module internally to provide update operations.

```javascript
// Equivalent to: DocOperations.updateFixed(doc, ...)

doc.update({ breed: 'Cheshire' }, (err) => {
    if (!err) console.log(doc.body.name + ' is a ' + doc.body.breed + ' cat.');
});
```
```
Jacob is a Cheshire cat.
```

### Updating documents even if they don't exist

Sometimes you are not sure or do not care about whether a document exists in the database, the `updateOrWrite` operation will first try to update it. But if it doesn't exist will create one.

```javascript
// Equivalent to: DocOperations.updateOrWrite(Cat, ...)

Cat.updateOrWrite('matthew', { name: 'Matthew', eyes: 'green' }, (err, doc) => {
    if (!err) console.log(doc.body.name + ' has ' + doc.body.eyes + ' eyes.');
});
```
```
Matthew has green eyes.
```

### Head operations

Head operations are a much faster version of `read` operations, you will not get the document body, only enough information to know whether or not the document exists and what it's `_rev` is.

```javascript
// Equivalent to: DocOperations.head(Cat, ...)

Cat.head('matthew', (err, rev) => {
    if (!err) console.log(rev);
});
```
```
1-###
```

```javascript
// Equivalent to: DocOperations.headFixed(doc, ...)

doc.head((err, rev) => {
    if (!err) console.log(rev);
});
```
```
1-###
```

### Destroying documents

```javascript
// Equivalent to: DocOperations.destroy(Cat, ...)

Cat.destroy('matthew', (err) => {
    if (!err) console.log('success!');
});
```
```
success!
```

Also works inline.

```javascript
// Equivalent to: DocOperations.destroyFixed(doc, ...)

doc.destroy((err) => {
    if (!err) console.log(doc.body);
});
```
```
{}
```

### Contribute

If you like what you see please feel encouraged to [get involved](https://github.com/Kequc/couch-recliner/issues) report problems and submit pull requests! As of the time of this writing the project is new with one maintainer.
