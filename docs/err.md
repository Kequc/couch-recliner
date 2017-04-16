Err
===

Used internally to sanitise messages returned from the database.

### make

Build an error if applicable from a response message. Takes a `scope` to be identifiable as to what type of operation was being performed at the time of the error. The second parameter is a transmission error if available.

```javascript
const { Err } = require('couch-recliner');

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

### checkOpsFixed

A helper for generating errors based on user input. Validates the provided Model and detects missing parameters.

```javascript
const err = Err.checkOpsFixed(doc, { body: undefined });
console.log(err.scope);
console.log(err.name);
console.log(err.description);
```
```
ops
missing_param
Body parameter required.
```

### checkOps

A helper similar to fixed.

```javascript
const err = Err.checkOps(Cat, { id: undefined });
console.log(err.scope);
console.log(err.name);
console.log(err.description);
```
```
ops
missing_param
Id parameter required.
```

### checkParams

Helper performed at the end of both `checkOpsFixed` and `checkOps` evaluations.

```javascript
const err = Err.checkParams({ canteen: undefined });
console.log(err.scope);
console.log(err.name);
console.log(err.description);
```
```
ops
missing_param
Canteen parameter required.
```

### Common errors

Some generators exist for shorthand error generation of common errors.

```javascript
console.log(Err.missing('doc').message);
console.log(Err.missingParam('id').message);
console.log(Err.invalidParam('id').message);
console.log(Err.conflict('doc').message);
```
```
Not found.
Id parameter required.
Invalid id parameter supplied.
There was a conflict.
```
