AttachmentOperations
===

It is possible to make changes to attachments directly without caring very much about the document at all by using the `AttachmentOperations` module.

These tools depend on the existence of a document.

### write

This will overwrite an exisiting attachment with the same name, or create it if it doesn't exist. You are passing in the [Model](./model.md) being changed, the document id, the attachment name, and an [Attachment](./attachment.md).

```javascript
const { AttachmentOperations } = require('couch-recliner');

const vet = {
    contentType: 'text/html',
    body: fs.readFileSync(path.join(__dirname, './Documents/vet-bill-03-05-2017.htm'))
};

AttachmentOperations.write(Cat, 'jacob', 'vet-bill-03-05-2017.htm', vet, (err) => {
    if (!err) console.log('success!');
});
```
```
success!
```

```javascript
AttachmentOperations.writeFixed(doc, 'vet-bill-03-05-2017.htm', vet, (err) => {
    if (!err) console.log(doc.body._attachments);
});
```
```
{
    'vet-bill-01-20-2017.htm': {
        stub: true,
        content_type: 'text/html',
        length: 521
    },
    'vet-bill-03-05-2017.htm': {
        stub: true,
        content_type: 'text/html',
        length: 470
    }
}
```

### read

Reading an attachment returns data in the form of a Buffer.

```javascript
AttachmentOperations.read(Cat, 'jacob', 'vet-bill-03-05-2017.htm', (err, buffer) => {
    if (!err) console.log(buffer.length);
});
```
```
470
```

```javascript
AttachmentOperations.readFixed(doc, 'vet-bill-03-05-2017.htm', (err, buffer) => {
    if (!err) console.log(buffer.length);
});
```
```
470
```

### destroy

```javascript
AttachmentOperations.destroy(Cat, 'jacob', 'vet-bill-03-05-2017.htm', (err) => {
    if (!err) console.log('success!');
});
```
```
success!
```

```javascript
AttachmentOperations.destroyFixed(doc, 'vet-bill-03-05-2017.htm', (err) => {
    if (!err) console.log(doc.body._attachments);
});
```
```
{
    'vet-bill-01-20-2017.htm': {
        stub: true,
        content_type: 'text/html',
        length: 521
    }
}
```
