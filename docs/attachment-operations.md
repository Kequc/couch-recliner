AttachmentOperations
===

```javascript
const { AttachmentOperations } = require('couch-recliner');
```

Uses `Attachment` instances or objects.

### write(Model, id, attname, Attachment, callback)

| parameter | description |
| - | - |
| Model | [Model](./model.md) |
| id | Id of your document. |
| attname | Name of your attachment. |
| Attachment | [Attachment](./attachment.md) |
| callback(err) | Returns an error if there was a problem. |

```javascript
const attachment = {
    contentType: 'image/png',
    body: myBuffer
};

AttachmentOperations.write(Account, myId, 'avatar.png', attachment, (err) => {
    if (!err)
        console.log('saved!');
});
```
```
saved!
```

### writeFixed(doc, attname, Attachment, callback)

| parameter | description |
| - | - |
| doc | [Model](./model.md) |
| attname | Name of your attachment. |
| Attachment | [Attachment](./attachment.md) |
| callback(err) | Returns an error if there was a problem. |

```javascript
const attachment = {
    contentType: 'image/png',
    body: myBuffer
};

AttachmentOperations.writeFixed(myDoc, 'avatar.png', attachment, (err) => {
    if (!err)
        console.log(myDoc.body._attachments);
});
```
```
{
    'avatar.png': {
        stub: true,
        content_type: 'image/png',
        length: 511
    }
}
```

### read(Model, id, attname, callback)

| parameter | description |
| - | - |
| Model | [Model](./model.md) |
| id | Id of your document. |
| attname | Name of your attachment. |
| Attachment | [Attachment](./attachment.md) |
| callback(err, buffer) | Returns a Buffer object representing your attachment. |

```javascript
AttachmentOperations.read(Account, myId, 'avatar.png', (err, buffer) => {
    if (!err)
        console.log(buffer.length);
});
```
```
511
```

### readFixed(doc, attname, callback)

| parameter | description |
| - | - |
| doc | [Model](./model.md) |
| attname | Name of your attachment. |
| callback(err, buffer) | Returns a Buffer object representing your attachment. |

```javascript
AttachmentOperations.readFixed(myDoc, 'avatar.png', (err, buffer) => {
    if (!err)
        console.log(buffer.length);
});
```
```
511
```

### destroy(Model, id, attname, callback)

| parameter | description |
| - | - |
| Model | [Model](./model.md) |
| id | Id of your document. |
| attname | Name of your attachment. |
| callback(err) | Returns an error if there was a problem. |

```javascript
AttachmentOperations.destroy(Account, myId, 'avatar.png', (err) => {
    if (!err)
        console.log('deleted!');
});
```
```
deleted!
```

### destroyFixed(doc, attname, callback)

| parameter | description |
| - | - |
| doc | [Model](./model.md) |
| attname | Name of your attachment. |
| callback(err) | Returns an error if there was a problem. |

```javascript
AttachmentOperations.destroyFixed(myDoc, 'avatar.png', (err) => {
    if (!err)
        console.log(myDoc.body._attachments);
});
```
```
{}
```
