# Mongoose Live

### A simple REPL integration for Mongoose (published via `npm` as `mongoose-live`)

## Why?

Many developers are accustomed to using the Django shell or Rails console to test or demonstrate database interactions via ORM models. Mongoose does not have a native REPL; this module provides an easy-to-implement option for interacting with Mongoose ODM models.

## Usage

1. Install the package in your project: `npm i mongoose-live`
2. In a file (`repl.js`, perhaps), `require` the package... 
3. Then invoke the returned function, providing [a `mongoose.connection` object](https://mongoosejs.com/docs/api/mongoose.html#mongoose_Mongoose-connection) and a `models` object (optional, see below for details) as arguments:
```js
// example repl.js
const live = require('mongoose-live') // requires the package
const db = require('./db') // a mongoose.connection object
const models = require('./models') // must be an object; keys available in REPL context
live(db, models) // starts the REPL with specified arguments
```
4. Execute the file using the `--experimental-repl-await` flag either A) from the command line:
```bash
node --experimental-repl-await repl.js
```
or B) via an `npm` script (in `package.json.scripts`)
```json
"repl": "node --experimental-repl-await repl.js",
```
... (after which, execute `npm run repl`).

5. Interact with your Mongoose models using any methods you would use in an API controller or any other Node.js environment. (If you've applied Step 4 above, `await` will be available at the prompt.) Simple examples:
```js
await User.find({}) // returns all Users and logs the result in REPL
const firstUser = await User.findOne() // stores one User as "user"
firstUser.execPopulate('posts') // populates firstUser's .posts array in place (from ObjectIds)
firstUser.posts // shows populated array of Post instances
// etc.
```

## The Models Object

The `models` object (provided as an argument to the module function) should be an object with keys matching the names of the desired Mongoose model, and values matching the models themselves. These keys will be available as variables in the REPL context. Example:

```js
const User = require('./models/user.js') // imports the User model
const Task = require('./models/task.js') // imports the Task model
const models = { User, Task } // provided as argument, enables User and Task in REPL
```

If your project already includes a "models" directory whose `index.js` exports an object that includes all models, you may `require` that directory directly and provide it as `models`.

## Options

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

## Known Issues

### `.then()`

Operations that return a `Promise` chained with `.then()` may see any resulting logs output immediately _after_ the following prompt. A blinking cursor will be shown with no visible prompt. Hit the `RETURN` key, and the REPL should behave as normal.

If the provided `mongoose.connection` object is chained before a `.then()` method, any logs from the `.then` may appear immediately after the initial prompt, with no significant operational consequences.
