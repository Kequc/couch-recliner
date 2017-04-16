DbOperations
===

Performs operations on your database directly, for administrative tasks such as database `create` and `destroy`.

### head

Check the existence of a database.

```javascript
const { DbOperations } = require('couch-recliner');

DbOperations.head(Cat, (err) => {
    if (!err)
        console.log('exists!');
});
```
```
exists!
```

### reset

Creates database after destroying it. Accepts a validation parameter which must always equal `_RESET_`.

```javascript
DbOperations.reset(Cat, '_RESET_', (err) => {
    if (!err)
        console.log('reset!');
});
```
```
reset!
```

### destroy

Destroys a database. Accepts a validation parameter which must always equal `_DESTROY_`.

```javascript
DbOperations.destroy(Cat, '_DESTROY_', (err) => {
    if (!err)
        console.log('success!');
});
```
```
success!
```

### create

Creates a database.

```javascript
DbOperations.create(Cat, (err) => {
    if (!err)
        console.log('success!');
});
```
```
success!
```
