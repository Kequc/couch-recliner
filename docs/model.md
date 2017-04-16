Model
===

The model is the foundation of this library, you build one to describe characteristics and functionality of a given database. And instances of it represent documents. The simplest implementation of a model requires that you specify a `dbName`.

Without a `dbName` specified you'll just receive db name not defined errors all the time.

```javascript
const { Model } = require('couch-recliner');

class Cat extends Model {
    meow() {
        console.log(this.body.name + ' meows.');
    }
}

Cat.dbName = 'cats';
```

### couch =

A [Couch](./couch.md) instance is for connectivity to the database, useful rather than always relying on the default.

```javascript
const couch = {
    production: 'https://somelocation.com',
    any: 'http://localhost:5984'
};

Cat.couch = couch;
```

### id, rev, body

On model instances, generally referred to as a `doc` throughout these pages, have `doc.id`, `doc.rev`, and `doc.body`. Referring to their database document id, revision, and content.

### MAX_TRIES =

You may change the default 5 max retries offered on your model. This library is optimistic, retries are often necessary in order to correct out of date revision ids. Sometimes a retry is used when the database does not exist. Congested updates to the same document can also cause quite a few conflicts and more retries might be necessary.

But in those cases a better solution would be to use some sort of queueing system.

```javascript
Cat.MAX_TRIES = 10;
```

### Helpers

Your models come with a default set of helper methods, which are actually just aliases. That list of bundled aliases follow.

#### #create

`DocOperations.create(this, ...);`

#### #read

`DocOperations.read(this, ...);`

#### #write

`DocOperations.write(this, ...);`

#### #update

`DocOperations.update(this, ...);`

#### #updateofWrite

`DocOperations.updateOrWrite(this, ...);`

#### #destroy

`DocOperations.destroy(this, ...);`

#### #head

`DocOperations.head(this, ...);`

#### #findOne

`FindOperations.findOne(this, ...);`

#### #find

`FindOperations.find(this, ...);`

#### #attachment

`AttachmentOperations.read(this, ...);`

#### .read

`DocOperations.readFixed(this, ...);`

#### .write

`DocOperations.writeFixed(this, ...);`

#### .update

`DocOperations.updateFixed(this, ...);`

#### .destroy

`DocOperations.destroyFixed(this, ...);`

#### .head

`DocOperations.headFixed(this, ...);`

#### .attachment

`AttachmentOperations.readFixed(this, ...);`
