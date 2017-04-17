DocOperations
===

This module is powerful and contains most of the operations you will need to perform on your [Model](./model.md). In most cases the first parameter is the model, or in `<ops>Fixed` versions it's the model instance. Followed by a [Body](./body.md).

The body can contain attachments, by making use of the `_attachments` parameter. This is outlined in some more detail on the [README](../README.md) and the [Body](./body.md) documentaion.

### create

If you don't care what the id of your document is, this operation will create one for you.

```javascript
const { DocOperations } = require('couch-recliner');

DocOperations.create(Cat, { name: 'Tammy' }, (err, doc) => {
    if (!err) {
        console.log(doc.id);
        console.log(doc.rev);
        console.log(doc.body);
    }
});
```
```
b77509102b4dc0a1389ae3b6d248ef18
1-75efcce1f083316d622d389f3f9813f7
{
    _attachments: {},
    name: 'Tammy'
}
```

### read

Read the latest version of the document from the database.

```javascript
const id = 'b77509102b4dc0a1389ae3b6d248ef18';

DocOperations.read(Cat, id, (err, doc) => {
    if (!err)
        console.log(doc.body.name);
});
```
```
Tammy
```

```javascript
DocOperations.readFixed(doc, (err, doc) => {
    if (!err)
        console.log(doc.body.name);
});
```
```
Tammy
```

### write

Write a document overwriting if it already exists.

```javascript
DocOperations.write(Cat, id, { name: 'Foots' }, (err, doc) => {
    if (!err)
        console.log(doc.body.name);
});
```
```
Foots
```

```javascript
DocOperations.writeFixed(doc, { name: 'Foots' }, (err, doc) => {
    if (!err)
        console.log(doc.body.name);
});
```
```
Foots
```

### update

Updates an existing document in the database, this is a deep extend operation fulfilled by the [json-artisan](https://github.com/Kequc/json-artisan) library.

```javascript
DocOperations.update(Cat, id, { eyes: 'green' }, (err, doc) => {
    if (!err)
        console.log(doc.body.name + ' has ' + doc.body.eyes + ' eyes.');
});
```
```
Foots has green eyes.
```

```javascript
DocOperations.updateFixed(doc, { name: 'Foots' }, (err, doc) => {
    if (!err)
        console.log(doc.body.name + ' has ' + doc.body.eyes + ' eyes.');
});
```
```
Foots has green eyes.
```

### updateOrWrite

Will perform an `update` but if the document does not exist, will create it.

```javascript
DocOperations.updateOrWrite(Cat, id, { name: 'Stevie' }, (err, doc) => {
    if (!err)
        console.log(doc.body.name);
});
```
```
Stevie
```

### head

Head will determine whether the document exists and if so what it's current revision is in the database.

```javascript
DocOperations.head(Cat, id, (err, rev) => {
    if (!err)
        console.log(rev);
});
```
```
3-efa0539cc8d54024b95851082c074942
```

```javascript
DocOperations.writeFixed(doc, (err, rev) => {
    if (!err)
        console.log(rev);
});
```
```
3-efa0539cc8d54024b95851082c074942
```

### destroy

This removes the document from the database. The fixed version of this operation will also empty your model instance of any data to prevent misuse.

```javascript
DocOperations.destroy(Cat, id, (err) => {
    if (!err)
        console.log('success!');
});
```
```
success!
```

```javascript
DocOperations.destroyFixed(doc, (err, rev) => {
    if (!err)
        console.log(doc.body);
});
```
```
{}
```
