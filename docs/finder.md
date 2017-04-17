Finder
===

```javascript
const { Finder } = require('couch-recliner');

const finder = new Finder({
    selector: { age: { '$gt': 10 } },
    fields: ['name', 'age']
});
```

More information can be found on the structure of this object on the [CouchDB](http://docs.couchdb.org/en/2.0.0/api/database/find.html) website.

### .isValid()

```javascript
console.log(finder.isValid());
```
```
true
```

Returns whether the library thinks it's a valid finder. If this test fails any request containing the finder will not be sent.

### .getFields()

```javascript
console.log(finder.getFields());
```
```
['name', 'age', '_id', '_rev']
```

Returns an array of fields which should be collected in the search results.

### .forHttp()

```javascript
console.log(finder.forHttp());
```
```
{
    selector: { age: { '$gt': 10 } },
    fields: ['name', 'age', '_id', '_rev'],
    sort: undefined,
    limit: undefined,
    skip: undefined
}
```

Returns your finder formatted for transport over http.
