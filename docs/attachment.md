Attachment
===

```javascript
const { Attachment } = require('couch-recliner');

const attachment = new Attachment({
    contentType: 'application/pdf',
    body: myBuffer
});
```

The body parameter is always a string or a Buffer.

### .isValid()

```javascript
console.log(attachment.isValid());
```
```
true
```

Returns whether the library thinks it's a valid attachment. If this test fails any request containing the attachment will not be sent.

### .getLength()

```javascript
console.log(attachment.getLength());
```
```
107
```

Returns the size of your attachment in bytes.

### .forHttp()

Returns your attachment formatted for delivery over http using either `toStub` or `toFollows` depedning on the status of the attachment.

### .toStub()

```javascript
console.log(attachment.toStub());
```
```
{
    stub: true,
    content_type: 'application/pdf',
    length: 107
}
```

Returns your attachment formatted for insertion into a model instance.

### .toFollows()

```javascript
console.log(attachment.toFollows());
```
```
{
    follows: true,
    content_type: 'application/pdf',
    length: 107
}
```

Returns your attachment formatted for use in conjunction with multipart requests.

### .forMultipart()

```javascript
console.log(attachment.forMultipart());
```
```
{
    'content-type': 'application/pdf',
    body: <Buffer ...>
}
```

Returns your attachment formatted for multipart.
