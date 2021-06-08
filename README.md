# Mongoose Live

### A simple REPL integration for Mongoose

## Why?

Many developers are accustomed to using the Django shell or Rails console to test database interactions via data models. Mongoose does not have a native REPL -- this module provides an easy-to-implement option.

>An automated installation script for this package is also available: [`npx create-mongoose-live`](https://www.npmjs.com/package/create-mongoose-live)

## Syntax

```javascript
live(dbConnection, models, context, options)
```
`live` is the function exported from the `mongoose-live` NPM package.

### Parameters
* `dbConnection` : A `Mongoose.connection` object. (Required.)
* `models` : A JS object whose keys will be available as variables within the REPL context, and whose values are expected to be Mongoose models. (Default: `{}`)
* `context` : Additional variables to be made available following the key/value pattern above. (Default: `{}`)
* `options` : A JS object containing additional configuration options. For valid keys and arguments, see below. (Default: `{}`)



## Typical Usage

1. Install the package: `npm i mongoose-live`
2. In a file (`repl.js`, perhaps), `require` the package... 
3. Then invoke the package, providing [a `Mongoose.connection` object](https://mongoosejs.com/docs/api/mongoose.html#mongoose_Mongoose-connection) and a `models` object (optional, see below for details) as arguments:
```js
const live = require('mongoose-live') // requires the package
const db = require('./db') // a mongoose.connection object
const models = require('./models') // must be an object; keys available in REPL context
live(db, models)
```
4. Execute the file using the `--experimental-repl-await` flag either from the command line or from an `npm` script:
```bash
node --experimental-repl-await repl.js
```
or (in `package.json.scripts`)
```json
"repl": "node --experimental-repl-await repl.js"
```
... and then execute `npm run repl`.

5. Interact with your Mongoose models using any methods you would use in an API controller or any other Node.js environment.

## The Models Object

The `models` object provided as an argument should be an object with keys matching the names of each Mongoose model. These keys will be available as variables in the REPL context. Example:

```js
const User = require('./models/user.js') // imports the User model
const Task = require('./models/task.js') // imports the Task model
const models = { User, Task } // provided as argument, enables User and Task in REPL
```

If your project already includes a "models" directory whose `index.js` exports an object that includes all models, you may `require` that directory directly.

## Context

Additional variables may optionally be added to the REPL context as keys in an object:

```js
const db = require('./db')
const models = require('./models')
const context = {
    searchUsersByName: async function (name) {
        return await models.User.find({name: {$regex: name, $options: "i"}})
    }
}
live(db, models, context) // in addition to models, searchUsersByName will be available
```

## Options

An `options` object may also be provided. Available options may be expanded, but currently include:

* `prompt`: Define a custom prompt to use in place of `MongooseLive> `.

## Known Issues

### `.then()`

Operations that return a `Promise` chained with `.then()` may see any resulting logs output immediately _after_ the following prompt. A blinking cursor will be shown with no visible prompt. Hit the `RETURN` key, and the REPL should behave as normal.

If the provided `mongoose.connection` object is chained before a `.then()` method, any logs from the `.then` _may_ appear immediately after the initial prompt, with no significant operational consequences.
