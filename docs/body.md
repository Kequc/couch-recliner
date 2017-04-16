Body
===

Used internally to format and validate your document body. It also parses and validates any number of [Attachment](./attachment.md) instances which have been included.

### create

Builds and returns a `Body` instance based on provided data.

```javascript
const { Body } = require('couch-recliner');

const body = Body.create({
    name: 'Cat name',
    eyes: 'purple',
    _attachments: {
        'photo.png': {
            contentType: 'image/png',
            body: Buffer
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

### extend

The instance acts as a source, overwriting any data contained in the target. This is a deep operation performed by the [json-artisan](https://github.com/Kequc/json-artisan) library. Attachments are extended as well, however separately.

Operation is non-destructive and returns a new instance.

```javascript
const extended = body.extend({
    name: 'Old cat name',
    isEvil: true,
    _attachments: {
        'cat-facts.txt': {
            contentType: 'text/html',
            body: Buffer
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

### isValid

Performs some rudimentary validation of your data, if this step fails your request making use of this instance will not be sent.

```javascript
console.log(body.isValid());
console.log(extended.isValid());
```
```
true
true
```

### forDoc

Formats the body for use in a model instance.

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

### forHttp

Formats your body for transport over http. If there are new attachments you will receive a `multipart` parameter, otherwise simply a `body`. A rev is expected to be provided, as that information is generally outside the scope of this class.

```javascript
const rev = '3-efa0539cc8d54024b95851082c074942';
console.log(body.forHttp(rev));
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
