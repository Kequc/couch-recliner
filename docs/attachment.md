Attachment
===

Attachment objects are used internally to both validate and format your attachments. In all cases they will simply be created for you in the background. Attachments are used in both the [AttachmentOperations](./attachment-operations.md) and [DocOperations](./doc-operations.md) modules.

At a minimum to be valid must be given a `content_type` and a `body` property. Content type is a mime type describing the content of your attachment. You may use many variations on naming the `content_type` key, for example you may choose `Content-Type`, `contenttype`, or other variations therein.

The body parameter is always a string or a Buffer.

```javascript
const fs = require('fs');
const { Attachment } = require('couch-recliner');

const myAttachment = new Attachment({
    contentType: 'application/pdf',
    body: fs.readFileSync('./Documents/test.pdf'))
});
```

### isValid

Checks whether the library thinks it's a valid attachment. If this test fails the request containing the attachment will not be sent.

```javascript
console.log(myAttachment.isValid());
```
```
true
```

### getLength

Finds the size of your attachment in bytes.

```javascript
console.log(myAttachment.getLength());
```
```
107
```

### forHttp

Formats your attachment for delivery over http using either `toStub` or `toFollows` depedning on the status of the attachment.

### toStub

Used for insertion into document instances.

```javascript
console.log(myAttachment.toStub());
```
```
{
    stub: true,
    content_type: 'application/pdf',
    length: 107
}
```

### toFollows

Used in the json body of multipart requests.

```javascript
console.log(myAttachment.toFollows());
```
```
{
    follows: true,
    content_type: 'application/pdf',
    length: 107
}
```

### forMultipart

The actual multipart.

```javascript
console.log(myAttachment.forMultipart());
```
```
{
    'content-type': 'application/pdf',
    body: <Buffer ...>
}
```
