Err
===

```javascript
const { Err } = require('couch-recliner');
```

Used internally to sanitise messages returned from the database.

### #make(scope, error, response)

| parameter | description |
| - | - |
| scope | String repesentation of the source of the error. |
| error | Error object returned from request. |
| response | Response object received from request. |

```javascript
const response = {
    statusCode: 500,
    body: {
        error: 'internal_server_error'
    }
};

const err = Err.make('doc', undefined, response);
console.log(err.scope);
console.log(err.name);
console.log(err.message);
console.log(err.raw);
```
```
doc
internal_server_error
No additional information available.
{
    error: 'internal_server_error'
}
```

### #checkOpsFixed(doc, params)

| parameter | description |
| - | - |
| doc | [Model](./model.md) |
| params | Key value map of expected params. |

```javascript
const err = Err.checkOpsFixed(myDoc, { body: undefined });
console.log(err.scope);
console.log(err.name);
console.log(err.description);
```
```
ops
missing_param
Body parameter required.
```

### #checkOps(Model, params)

| parameter | description |
| - | - |
| Model | [Model](./model.md) |
| params | Key value map of expected params. |

```javascript
const err = Err.checkOps(Model, { body: undefined });
console.log(err.scope);
console.log(err.name);
console.log(err.description);
```
```
ops
missing_param
Body parameter required.
```

### #checkParams(params)

| parameter | description |
| - | - |
| params | Key value map of expected params. |

```javascript
const err = Err.checkParams({ body: undefined });
console.log(err.scope);
console.log(err.name);
console.log(err.description);
```
```
ops
missing_param
Body parameter required.
```

### #missing(scope)

| parameter | description |
| - | - |
| scope | String repesentation of the source of the error. |

```javascript
console.log(Err.missing('doc').message);
```
```
Not found.
```

### #invalidParam(name)

| parameter | description |
| - | - |
| name | String repesentation of invalid parameter. |

```javascript
console.log(Err.invalidParam('id').message);
```
```
Id parameter required.
```

### #missingParam(name)

| parameter | description |
| - | - |
| name | String repesentation of invalid parameter. |

```javascript
console.log(Err.missingParam('id').message);
```
```
Invalid id parameter supplied.
```

### #conflict(scope)

| parameter | description |
| - | - |
| scope | String repesentation of the source of the error. |

```javascript
console.log(Err.conflict('doc').message);
```
```
There was a conflict.
```
