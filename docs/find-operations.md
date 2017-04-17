FindOperations
===

```javascript
const { FindOperations } = require('couch-recliner');
```

Uses `Finder` instances or objects.

### find(Model, Finder, callback)

| parameter | description |
| - | - |
| Model | [Model](./model.md) |
| Finder | [Finder](./finder.md) |
| callback(err, docs) | Returns an array of model instances from the result of your search. |

```javascript
const finder = {
    selector: { age: { '$gt': 10 } }
};

FindOperations.find(Account, finder, (err, docs) => {
    if (!err)
        console.log(docs.length);
});
```
```
2
```

### findOne(Model, Finder, callback)

| parameter | description |
| - | - |
| Model | [Model](./model.md) |
| Finder | [Finder](./finder.md) |
| callback(err, doc) | Returns the first model instance from the result of your search. |

```javascript
const finder = {
    selector: { age: { '$gt': 10 } }
};

FindOperations.findOne(Account, finder, (err, doc) => {
    if (!err)
        console.log(doc.body.age);
});
```
```
11
```
