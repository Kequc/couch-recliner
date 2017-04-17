Couch Recliner
===

Utility modules for interacting with CouchDB2.0/Cloudant using Nodejs. It retries requests and generally tries to keep things clean.

[npm](https://www.npmjs.com/package/couch-recliner)

### Download it

Install the library from npm.

```
npm i couch-recliner --save
```

### Usage

Build a model that describes your database. You must set a `dbName` on it.

```javascript
const { Model, DocOperations } = require('couch-recliner');

class Account extends Model {
}

Account.dbName = 'accounts';
```

Add a document.

```javascript
DocOperations.create(Account, { name: 'Smith' }, (err, doc) => {
    if (err) return;
    console.log(doc.id);
    console.log(doc.body.name);
});
```
```
b77509102b4dc0a1389ae3b6d248ef18
Smith
```

A new account has been created in the database, and an instance of `Account` returned. There are quite a few similar modules like this one.

**[AttachmentOperations](./docs/attachment-operations.md)**

| method | first param | additional params |
| - | - | - |
| destroy | Model | id, attname |
| read | Model | id, attname |
| write | Model | id, attname, Attachment |
| destroyFixed | doc | attname |
| readFixed | doc | attname |
| writeFixed | doc | attname, Attachment |

**[DbOperations](./docs/db-operations.md)**

| method | first param | additional params |
| - | - | - |
| create | Model | |
| destroy | Model | "\_DESTROY\_" |
| head | Model | |
| reset | Model | "\_RESET\_" |

**[DocOperations](./docs/doc-operations.md)**

| method | first param | additional params |
| - | - | - |
| create  | Model | Body |
| destroy | Model | id |
| head    | Model | id |
| read    | Model | id |
| update  | Model | id,  Body |
| updateOrWrite | Model | id, Body |
| write   | Model | id, Body |
| destroyFixed | doc | |
| headFixed | doc | |
| readFixed | doc | |
| updateFixed | doc | Body |
| writeFixed | doc | Body |

**[FindOperations](./docs/find-operations.md)**

| method | first param | additional params |
| - | - | - |
| find | Model | Finder |
| findOne | Model | Finder |

You can incorporate your own directly into your model, as an example this performs a lookup of `Message` instances.

```javascript
const { Model, FindOperations } = require('couch-recliner');

class Message extends Model {
    static findByAccountId(accountId, callback) {
        const finder = {
            selector: { accountId },
            limit: 50
        };
        FindOperations.find(this, finder, callback);
    }
}

Message.dbName = 'messages';

Message.findByAccountId(myAccountId, (err, docs) => {
    if (err) return;
    console.log(docs.length);
});
```
```
4
```

### Databases

It is likely you want to maintain a few databases, for testing, or development and keep them separate. Couch Recliner automatically postfixes your provided `dbName` with the current environment. If you ran through the examples on this page you will likely see databases named `accounts-development` and `messages-development` created for you. Possibly you'll see `accounts-test` and `messages-test` too.

But what about database location?

Set the `couch` attribute on your model. It should be a key value pair indicating where you want Couch Recliner to communicate with your database.

```javascript
const couch = {
    production: 'https://couch.my-database-location.com/api/',
    any: 'http://localhost:1000'
};

Account.couch = couch;
Message.couch = couch;
```

For more uniform reuse of shared database instance information, create a [Couch](./docs/couch.md) instance yourself and pass it as above instead. With a couch instance you can access more methods.

**[CouchOperations](./docs/couch-operations.md)**

| method | first param | additional params |
| - | - | - |
| uuids  | Couch | count |

### Shortcuts

Your `Model` comes with a set of static and instance methods included by default.

| method | additional params |
| - | - |
| #attachment | id, attname |
| #create  | Body |
| #destroy | id |
| #find | Finder |
| #findOne | Finder |
| #head    | id |
| #read    | id |
| #update  | id,  Body |
| #updateOrWrite | id, Body |
| #write   | id, Body |
| .attachment | attname |
| .destroy | |
| .head | |
| .read | |
| .update | Body |
| .write | Body |

You can use these or always choose the longer version.

### Attachments

Buffers and strings can be uploaded to your database individually by means of the specialised `AttachmentOperations` module, or it can be done in bulk within your document.

```javascript
const body = {
    age: 22,
    _attachments: {
        'avatar.png': {
            contentType: 'image/png',
            body: myBuffer
        }
    }
};
Account.update(myId, body, (err, doc) => {
    if (err) return;
    console.log(doc.body._attachments);
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

Manipulating the `_attachments` object in your document in this way will trigger a multipart request. You can add attachments, overwrite them, or remove them entirely by setting `undefined`. All attachments can be unilaterally deleted by setting `_attachments: undefined`.

### What this library doesn't do

The library is in it's early stages, it should be easily extendible. More help is welcomed warmly in the form of pull requests, questions, comments, feature requests, in the [contributions](https://github.com/Kequc/couch-recliner/issues) section on github.

### Coming soon

* Show operations
* View operations
* Bulk document operations
* Auth

### More documentation

Please see the **[./docs](./docs)** directory for more detailed information about available modules.

### Contribute

If you like what you see please feel encouraged to [get involved](https://github.com/Kequc/couch-recliner/issues) report problems and submit pull requests! As of the time of this writing the project has one maintainer.
