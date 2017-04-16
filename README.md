Couch Recliner
===

Utility modules for interacting with CouchDB2.0/Cloudant using Nodejs. It retries requests and generally tries to keep things as simple as possible.

### Installation

```
npm install couch-recliner --save
```

### Usage

This library exposes set of Model centric modules, in order to interact with your database you must have a Model describing it.

```javascript
const { Model } = require('couch-recliner');

class Cat extends Model {
    meow() {
        console.log(this.body.name + ' meows.');
    }
}

Cat.dbName = 'cats';
```

Your model will have a `dbName` representing the name of the database you want it to use. Within a model instance the document body can be accessed at `this.body`, it is recommended not to modify the body directly. Instead manipulate data using the methods which follow.

### Creating documents

```javascript
Cat.create({ name: 'Sally' }, (err, doc) => {
    if (!err)
        doc.meow();
});
```
```
Sally meows.
```

You may instead choose to use the [DocOperations](./docs/doc-operations.md) module directly which will do the exact same thing. The following code is equivalent to the above.

```javascript
const { DocOperations } = require('couch-recliner');

DocOperations.create(Cat, { name: 'Sally' }, (err, doc) => {
    if (!err)
        doc.meow();
});
```
```
Sally meows.
```

### Writing documents

In cases where you know which `id` you intend to use, and want to write directly to that `id`.

```javascript
// Equivalent to: DocOperations.write(Cat, ...)

Cat.write('jacob', { name: 'Jacob' }, (err, doc) => {
    if (!err)
        doc.meow();
});
```
```
Jacob meows.
```

This writes a document to the database with an id of `jacob`. If you already have a `doc` instance you may choose to use it, for this purpose there is `writeFixed`.

```javascript
// Equivalent to: DocOperations.writeFixed(doc, ...)

doc.write({ name: 'Jacob' }, (err) => {
    if (!err)
        doc.meow();
});
```
```
Jacob meows.
```

The write operation will overwrite existing data, replacing it entirely so be careful with it.

### Reading documents

If you have a document in the database and you want the most up to date version use `read`.

```javascript
// Equivalent to: DocOperations.read(Cat, ...)

Cat.read('jacob', (err, doc) => {
    if (!err)
        doc.meow();
});
```
```
Jacob meows.
```

```javascript
// Equivalent to: DocOperations.readFixed(doc, ...)

doc.read((err) => {
    if (!err)
        doc.meow();
});
```
```
Jacob meows.
```

### Updating documents

```javascript
// Equivalent to: DocOperations.update(Cat, ...)

Cat.update('jacob', { breed: 'Cheshire' }, (err, doc) => {
    if (!err)
        console.log(doc.body.name + ' is a ' + doc.body.breed + ' cat.');
});
```
```
Jacob is a Cheshire cat.
```

```javascript
// Equivalent to: DocOperations.updateFixed(doc, ...)

doc.update({ breed: 'Cheshire' }, (err) => {
    if (!err)
        console.log(doc.body.name + ' is a ' + doc.body.breed + ' cat.');
});
```
```
Jacob is a Cheshire cat.
```

For more complex updates look at [json-artisan](https://github.com/Kequc/json-artisan), Couch Recliner uses this library internally to provide update operations.

### Updating documents even if they don't exist

Sometimes you are not sure or do not care about whether a document exists in the database, the `updateOrWrite` method will first try to update it. But if it doesn't exist will create it.

```javascript
// Equivalent to: DocOperations.updateOrWrite(Cat, ...)

Cat.updateOrWrite('matthew', { name: 'Matthew', eyes: 'green' }, (err, doc) => {
    if (!err)
        console.log(doc.body.name + ' has ' + doc.body.eyes + ' eyes.');
});
```
```
Matthew has green eyes.
```

### Head operations

Head operations are a much faster version of `read`. You get only enough information to know whether or not the document exists and what the current revision is.

```javascript
// Equivalent to: DocOperations.head(Cat, ...)

Cat.head('matthew', (err, rev) => {
    if (!err)
        console.log(rev);
});
```
```
1-###
```

```javascript
// Equivalent to: DocOperations.headFixed(doc, ...)

doc.head((err, rev) => {
    if (!err)
        console.log(rev);
});
```
```
1-###
```

### Destroying documents

```javascript
// Equivalent to: DocOperations.destroy(Cat, ...)

Cat.destroy('matthew', (err) => {
    if (!err)
        console.log('success!');
});
```
```
success!
```

```javascript
// Equivalent to: DocOperations.destroyFixed(doc, ...)

doc.destroy((err) => {
    if (!err) {
        console.log(doc.body);
        console.log(doc.id);
        console.log(doc.rev);
    }
});
```
```
{}
undefined
undefined
```

### Multipart requests

It is possible to add/remove/modify attachments along with your documents. To do this make changes to the `_attachments` object. In it you'll see existing attachments listed in key value form, where key is the name of the attachment.

```javascript
// Example of an existing attachment in a document body

{
    _attachments: {
        'vet-bill-01-20-2017.htm': {
            stub: true,
            content_type: 'text/html',
            length: 521
        }
    }
}
```

If you modify this object, attachments will be modified or even deleted on the server. If you are adding something to `_attachments` ensure it has a `content_type` and a `body`. Body can be either string or a Buffer.

```javascript
const vet = {
    content_type: 'text/html',
    body: fs.readFileSync(path.join(__dirname, './Documents/vet-bill-03-05-2017.htm'))
};
```

```javascript
// Modify the document, leave the existing attachment add the new one

{
    name: 'Jacob the expensive cat',
    _attachments: {
        'vet-bill-01-20-2017.htm': {
            stub: true,
            content_type: 'text/html',
            length: 521
        },
        'vet-bill-03-05-2017.htm': vet
    }
}
```

**As a tip:** If you are updating a document, you do not need to care about existing attachments. An attachment will only be destroyed if it's value is set `undefined` explicitly.

### Reading attachments

Reading an attachment returns data in the form of a Buffer.

```javascript
// Equivalent to: AttachmentOperations.read(Cat, ...)

Cat.attachment('jacob', 'vet-bill-03-05-2017.htm', (err, buffer) => {
    if (!err)
        console.log(buffer.length);
});
```
```
470
```

You may also use this operation inline.

```javascript
// Equivalent to: AttachmentOperations.readFixed(doc, ...)

doc.attachment('vet-bill-03-05-2017.htm', (err, buffer) => {
    if (!err)
        console.log(buffer.length);
});
```
```
470
```

### Finding documents

You can use [FindOperations](./docs/find-operations.md) to search for a set of results, or look up a document with something other than it's id.

```javascript
// Equivalent to: FindOperations.find(Model, ...)

Cat.find({ name: 'Sally' }, (err, docs) => {
    if (!err && docs.length > 0)
        docs[0].meow();
});
```
```
Sally meows
```

```javascript
// Equivalent to: FindOperations.findOne(Model, ...)

Cat.findOne({ name: 'Sally' }, (err, doc) => {
    if (!err)
        doc.meow();
});
```
```
Sally meows
```

### View operations

Coming soon.

### Show operations

Coming soon.

### Bulk operations

Coming soon hopefully.

### More documentation

Please see the **[./docs](./docs)** directory for more detailed information about available modules.

### Contribute

If you like what you see please feel encouraged to [get involved](https://github.com/Kequc/couch-recliner/issues) report problems and submit pull requests! As of the time of this writing the project is new with one maintainer.
