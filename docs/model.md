Model
===

```javascript
const { Model } = require('couch-recliner');

class Account extends Model {
}

Account.dbName = 'accounts';
```

### #couch =

```javascript
Account.couch = {
    production: 'https://somelocation.com',
    any: 'http://localhost:5984'
};
```

Accepts a [Couch](./couch.md) instance or object.

### #MAX_TRIES =

```javascript
Account.MAX_TRIES = 10;
```

How many retries Couch Recliner is allowed to perform on a given request 5 by default.

### .id

```javascript
console.log(myDoc.id);
```
```
b77509102b4dc0a1389ae3b6d248e619
```

### .rev

```javascript
console.log(myDoc.rev);
```
```
3-efa0539cc8d54024b95851082c074942
```

### .body

```javascript
console.log(myDoc.body);
```
```
{
    name: 'Peter',
    age: 22
}
```

### Helpers

Your models come with a set of helper methods, which are actually just aliases.

| method | alias |
| - | - |
| #attachment | [AttachmentOperations](./attachment-operations.md)`.read(this, ...)` |
| #create  | [DocOperations](./doc-operations.md)`.create(this, ...)` |
| #destroy | [DocOperations](./doc-operations.md)`.destroy(this, ...)` |
| #find | [FindOperations](./find-operations.md)`.find(this, ...)` |
| #findOne | [FindOperations](./find-operations.md)`.findOne(this, ...)` |
| #head    | [DocOperations](./doc-operations.md)`.head(this, ...)` |
| #read    | [DocOperations](./doc-operations.md)`.read(this, ...)` |
| #update  | [DocOperations](./doc-operations.md)`.update(this, ...)` |
| #updateOrWrite | [DocOperations](./doc-operations.md)`.updateOrWrite(this, ...)` |
| #write   | [DocOperations](./doc-operations.md)`.write(this, ...)` |
| .attachment | [AttachmentOperations](./attachment-operations.md)`.readFixed(this, ...)` |
| .destroy | [DocOperations](./doc-operations.md)`.destroyFixed(this, ...)` |
| .head | [DocOperations](./doc-operations.md)`.headFixed(this, ...)` |
| .read | [DocOperations](./doc-operations.md)`.readFixed(this, ...)` |
| .update | [DocOperations](./doc-operations.md)`.updateFixed(this, ...)` |
| .write | [DocOperations](./doc-operations.md)`.writeFixed(this, ...)` |
