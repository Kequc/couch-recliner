FindOperations
===

Find operations will search your documents, these methods accept a [Finder](./finder.md) instance.

### find

Returns an array of model instances for the results of your search.

```javascript
const { FindOperations } = require('couch-recliner');

const finder = {
    selector: { age: { '$gt': 10 } }
};

FindOperations.find(Cat, finder, (err, docs) => {
    if (!err)
        console.log(docs.length);
});
```
```
2
```

### findOne

Finds and returns only the first result, behaves the same way as `DocOperations.read` generally.

```javascript
FindOperations.findOne(Cat, finder, (err, doc) => {
    if (!err)
        console.log(doc.body.age);
});
```
```
11
```
