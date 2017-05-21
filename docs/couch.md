Couch
===

```javascript
const { Couch } = require('couch-recliner');

const couch = new Couch('http://localhost:1000');
```

Any valid url will override the default `http://localhost:5984`. Accepts an object with `url` attribute or a string.

### .baseUrl

```javascript
console.log(couch.baseUrl);
```
```
http://localhost:1000
```

### .CACHE\_IDS\_COUNT =

```javascript
couch.CACHE_IDS_COUNT = 50;
```

Your instance caches `10` ids at a time by default.

### .envs =

```javascript
couch.envs = {
    url: 'http://localhost:1001'
};

console.log(couch.baseUrl);
```
```
http://localhost:1001
```

Envs are set when you create an instance but you can change them.

### .urlTo(...path)

| parameter | description |
| - | - |
| ...path | Desired path. |

```javascript
const url = couch.urlTo('hello', 50, 'there');

console.log(url);
```
```
http://localhost:1001/hello/50/there
```
