Body
===

```javascript
const { Body } = require('couch-recliner');
```

### #create(data)

| parameter | description |
| - | - |
| data | Object representing the content a document. |

```javascript
const body = Body.create({
    name: 'Cat name',
    eyes: 'purple',
    _attachments: {
        'photo.png': {
            contentType: 'image/png',
            body: myBuffer
        }
    }
});

console.log(body.data);
console.log(body.attachments);
```
```
{
    name: 'Cat name',
    eyes: 'purple'
}
{
    'photo.png': Attachment
}
```

### .extend(data)

| parameter | description |
| - | - |
| data | Object representing the content you want to overwrite. |

```javascript
const extended = body.extend({
    name: 'Old cat name',
    isEvil: true,
    _attachments: {
        'cat-facts.txt': {
            stub: true,
            contentType: 'text/html',
            length: 101
        }
    }
});

console.log(extended.data);
console.log(extended.attachments);
```
```
{
    name: 'Cat name',
    eyes: 'purple',
    isEvil: true
}
{
    'photo.png': Attachment,
    'cat-facts.txt': Attachment
}
```

Returns a new instance of `Body`. This is a deep operation performed internally by the [json-artisan](https://github.com/Kequc/json-artisan) library.

### .isValid()

```javascript
console.log(body.isValid());
console.log(extended.isValid());
```
```
true
true
```

Returns whether the library thinks it's a valid body. If this test fails any request containing the body will not be sent.

### .forDoc()

```javascript
console.log(body.forDoc());
```
```
{
    name: 'Cat name',
    eyes: 'purple',
    _attachments: {
        'photo.png': {
            stub: true,
            contentType: 'image/png',
            length: 422
        }
    }
}
```

Returns your body formatted for insertion into a model instance.

### .forHttp(rev)

| parameter | description |
| - | - |
| rev | Revision id you want sent with the request. |

```javascript
const payload = body.forHttp('3-efa0539cc8d54024b95851082c074942');

console.log(payload);
```
```
{
    multipart: [
        {
            'content-type': 'application/json',
            body: '{"_rev":"3-efa0539cc8d54024b95851082c074942","name":"Cat name","eyes":"purple","_attachments":{"photo.png":{"follows":true,"contentType":"image/png","length":422}}}'
        },
        {
            'content-type': 'image/png',
            body: Buffer
        }
    ]
}
```

Returns your body formatted for transport over http. If there are new attachments you will receive a `multipart` parameter, otherwise a `body`.
