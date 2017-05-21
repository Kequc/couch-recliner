Body
===

```javascript
const { Body } = require('couch-recliner');

const body = new Body({
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
```
```
{
    name: 'Cat name',
    eyes: 'purple',
    _attachments: {
        'photo.png': {
            contentType: 'image/png',
            body: myBuffer
        }
    }
}
```

### .extends =

```javascript
body.extends = {
    name: 'Old cat name',
    isEvil: true,
    _attachments: {
        'cat-facts.txt': {
            stub: true,
            contentType: 'text/html',
            length: 101
        }
    }
};
```

When the body is rendered it will extend this data. This is a deep operation performed internally by the [json-artisan](https://github.com/Kequc/json-artisan) library.

### .isValid()

```javascript
console.log(body.isValid());
```
```
true
```

Returns whether the library thinks it's a valid body. If this test fails any request containing the body will not be sent.

### .parsed()

```javascript
console.log(body.parsed());
```
```
{
    name: 'Cat name',
    eyes: 'purple',
    isEvil: true,
    _attachments: {
        'cat-facts.txt': {
            stub: true,
            contentType: 'text/html',
            length: 101
        },
        'photo.png': {
            contentType: 'image/png',
            body: myBuffer
        }
    }
}
```

Combines and parses your body, outputting a basic structure safe for further processing.

### .forDoc()

```javascript
console.log(body.forDoc());
```
```
{
    name: 'Cat name',
    eyes: 'purple',
    isEvil: true,
    _attachments: {
        'cat-facts.txt': {
            stub: true,
            content_type: 'text/html',
            length: 101
        },
        'photo.png': {
            stub: true,
            content_type: 'image/png',
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
            body: '{"_rev":"3-efa0539cc8d54024b95851082c074942","name":"Cat name","eyes":"purple","isEvil":true,"_attachments":{"cat-facts.txt":{"stub":true,"content_type":"text/html","length":101},"photo.png":{"follows":true,"content_type":"image/png","length":422}}}'
        },
        {
            'content-type': 'image/png',
            body: Buffer
        }
    ]
}
```

Returns your body formatted for transport over http. If there are new attachments you will receive a `multipart` parameter, otherwise a `body`.
