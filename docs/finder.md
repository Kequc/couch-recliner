Finder
===

Used internally to validate and format your search operation, for use in [FindOperations](./find-operations.md).

### isValid

Determines whether the request parameters are valid to be sent. If this rudimentary check failes the request is not sent.

```javascript
const { Finder } = require('couch-recliner');

const finder = new Finder({
    selector: { age: { '$gt': 10 } },
    fields: ['name', 'eyes']
});

console.log(finder.isValid());
```
```
true
```

### getFields

Returns an array of fields which should be collected in the search results. A few fields are added automatically for proper functionality in the library.

```javascript
console.log(finder.getFields());
```
```
['name', 'eyes', '_id', '_rev']
```

### forHttp

Returns your finder formatted for http transport.

```javascript
console.log(finder.forHttp());
```
```
{
    selector: { age: { '$gt': 10 } },
    fields: ['name', 'eyes', '_id', '_rev'],
    sort: undefined,
    limit: undefined,
    skip: undefined
}
```
