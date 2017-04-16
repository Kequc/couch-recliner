Couch
===

A couch instance is used internally to represent a set of database urls for different environments. You can choose to create one that is shared throughout all of your [Model](./model) declarations.

```javascript
// my-couch.js
const { Couch } = require('couch-recliner');

module.exports = new Couch({
    production: 'https://somelocation.com',
    any: 'http://localhost:5984'
});
```

```javascript
const { Model } = require('couch-recliner');
const myCouch = require('./my-couch');

class Dog extends Model {
    bark() {
        console.log(this.body.name + ' barks.');
    }
}

Dog.dbName = 'dogs';
Dog.couch = myCouch;
```

Your models come with a `Couch` instance automatically, but defining your own allows you to specify which database url to use for each environment.

### baseUrl

You can get the baseUrl for your couch instance by simply accessing the `baseUrl` attribute.

```javascript
console.log(myCouch.baseUrl);
```
```
http://localhost:5984
```

### getNextId

Your couch instance will cache ids collected from the database which are free to use. Calling `getNextId` pulls a valid CouchDB id off the top of your cache and returns it.

```javascript
myCouch.getNextId((err, id) => {
    if (!err)
        console.log(id);
});
```
```
b77509102b4dc0a1389ae3b6d248e619
```

### CACHE_IDS_COUNT =

By default your couch instance will cache 10 ids at a time. You can set this to any number you like. Internally this library just uses the built in `{db}/_uuids` utility.

Change this variable to request fewer or more ids when needed from the database.

```javascript
myCouch.CACHE_IDS_COUNT = 50;
```

### envs =

Envs are set when you create the couch instance but you can change it at any time, if you ever needed to.

```javascript
myCouch.envs = {
    production: 'https://a-different-url.com,
    any: 'http://localhost:5984'
};
console.log(myCouch.baseUrl);
```
```
http://localhost:5984
```

### urlTo

Function which will output any specified path to your database.

```javascript
const url = myCouch.urlTo('hello', 50, 'there');
console.log(url);
```
```
http://localhost:5984/hello/50/there
```
