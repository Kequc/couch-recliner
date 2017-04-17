DocOperations
===

```javascript
const { DocOperations } = require('couch-recliner');
```

Uses `Body` instances or objects.

### create(Model, Body, callback)

| parameter | description |
| - | - |
| Model | [Model](./model.md) |
| Body | [Body](./body.md) |
| callback(err, doc) | Returns a model instance representing your document. |

```javascript
const body = {
    name: 'Peter'
};

DocOperations.create(Account, body, (err, doc) => {
    if (!err)
        console.log(doc.body.name);
});
```
```
Peter
```

### read(Model, id, callback)

| parameter | description |
| - | - |
| Model | [Model](./model.md) |
| id | Id of your document. |
| callback(err, doc) | Returns a model instance representing your document. |

```javascript
DocOperations.read(Account, myId, (err, doc) => {
    if (!err)
        console.log(doc.body.name);
});
```
```
Peter
```

### readFixed(doc, callback)

| parameter | description |
| - | - |
| doc | [Model](./model.md) |
| callback(err) | Returns an error if there was a problem. |

```javascript
DocOperations.readFixed(myDoc, (err) => {
    if (!err)
        console.log(myDoc.body.name);
});
```
```
Peter
```

### write(Model, id, Body, callback)

| parameter | description |
| - | - |
| Model | [Model](./model.md) |
| id | Id of your document. |
| Body | [Body](./body.md) |
| callback(err, doc) | Returns a model instance representing your document. |

```javascript
const body = {
    name: 'Steve'
};

DocOperations.write(Account, myId, body, (err, doc) => {
    if (!err)
        console.log(doc.body);
});
```
```
{
    name: 'Steve'
}
```

### writeFixed(doc, Body, callback)

| parameter | description |
| - | - |
| doc | [Model](./model.md) |
| Body | [Body](./body.md) |
| callback(err) | Returns an error if there was a problem. |

```javascript
const body = {
    name: 'Steve'
};

DocOperations.writeFixed(myDoc, body, (err) => {
    if (!err)
        console.log(myDoc.body);
});
```
```
{
    name: 'Steve'
}
```

### update(Model, id, Body, callback)

| parameter | description |
| - | - |
| Model | [Model](./model.md) |
| id | Id of your document. |
| Body | [Body](./body.md) |
| callback(err, doc) | Returns a model instance representing your document. |

```javascript
const body = {
    age: 22
};

DocOperations.update(Account, myId, body, (err, doc) => {
    if (!err)
        console.log(doc.body);
});
```
```
{
    name: 'Steve',
    age: 22
}
```

### updateFixed(doc, Body, callback)

| parameter | description |
| - | - |
| doc | [Model](./model.md) |
| Body | [Body](./body.md) |
| callback(err) | Returns an error if there was a problem. |

```javascript
const body = {
    age: 22
};

DocOperations.updateFixed(myDoc, body, (err) => {
    if (!err)
        console.log(myDoc.body);
});
```
```
{
    name: 'Steve',
    age: 22
}
```

### updateOrWrite(Model, id, Body, callback)

| parameter | description |
| - | - |
| Model | [Model](./model.md) |
| id | Id of your document. |
| Body | [Body](./body.md) |
| callback(err, doc) | Returns a model instance representing your document. |

```javascript
const body = {
    name: 'Ruddiger',
    age: 22
};

DocOperations.updateOrWrite(Account, myId, body, (err, doc) => {
    if (!err)
        console.log(doc.body);
});
```
```
{
    name: 'Ruddiger',
    age: 22
}
```

### head(Model, id, callback)

| parameter | description |
| - | - |
| Model | [Model](./model.md) |
| id | Id of your document. |
| callback(err, rev) | Returns the most up to date revision id of your document. |

```javascript
DocOperations.head(Account, myId, (err, rev) => {
    if (!err)
        console.log(rev);
});
```
```
3-efa0539cc8d54024b95851082c074942
```

### headFixed(doc, callback)

| parameter | description |
| - | - |
| doc | [Model](./model.md) |
| callback(err, rev) | Returns the most up to date revision id of your document. |

```javascript
DocOperations.headFixed(myDoc, (err, rev) => {
    if (!err)
        console.log(rev);
});
```
```
3-efa0539cc8d54024b95851082c074942
```

### destroy(Model, id, callback)

| parameter | description |
| - | - |
| Model | [Model](./model.md) |
| id | Id of your document. |
| callback(err) | Returns an error if there was a problem. |

```javascript
DocOperations.destroy(Account, myId, (err) => {
    if (!err)
        console.log('deleted!');
});
```
```
deleted!
```

### destroyFixed(doc, callback)

| parameter | description |
| - | - |
| doc | [Model](./model.md) |
| callback(err) | Returns an error if there was a problem. |

```javascript
DocOperations.destroyFixed(myDoc, (err) => {
    if (!err)
        console.log(myDoc.body);
});
```
```
{}
```
