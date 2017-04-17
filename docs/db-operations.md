DbOperations
===

```javascript
const { DbOperations } = require('couch-recliner');
```

### head(Model, callback)

| parameter | description |
| - | - |
| Model | [Model](./model.md) |
| callback(err) | Returns an error if the database does not exist. |

```javascript
DbOperations.head(Account, (err) => {
    if (!err)
        console.log('exists!');
});
```
```
exists!
```

### reset(Model, callback)

| parameter | description |
| - | - |
| Model | [Model](./model.md) |
| callback(err) | Returns an error if there was a problem. |

Accepts a validation parameter which must always equal `_RESET_`, destroys then creates the database.

```javascript
DbOperations.reset(Account, '_RESET_', (err) => {
    if (!err)
        console.log('fresh start!');
});
```
```
fresh start!
```

### destroy(Model, callback)

| parameter | description |
| - | - |
| Model | [Model](./model.md) |
| callback(err) | Returns an error if there was a problem. |

Accepts a validation parameter which must always equal `_DESTROY_`.

```javascript
DbOperations.destroy(Account, '_DESTROY_', (err) => {
    if (!err)
        console.log('success!');
});
```
```
success!
```

### create(Model, callback)

| parameter | description |
| - | - |
| Model | [Model](./model.md) |
| callback(err) | Returns an error if there was a problem. |

```javascript
DbOperations.create(Cat, (err) => {
    if (!err)
        console.log('success!');
});
```
```
success!
```