# Mongoose Live

### A simple REPL integration for Mongoose

## Usage

1. Install the package: `npm i mongoose-live`
2. In a file (`repl.js` suggested), `require` the package: 
```js
const live = require('mongoose-live')
```
3. Invoke the package, providing a `mongoose.connection` object, a `models` object (optional), and an object with any desired context variables (optional) as arguments:
```js
const db = require('../db')
const models = require('../models)
const context = {
    searchUsersByName: async function (name) {
        return await User.find({name: {$regex: name, $options: "i"}})
    }
}
live(db, models, context)
```
4. Execute the file using the `--experimental-repl-await` flag either from the command line or from an `npm` script:
```bash
node --experimental-repl-await repl.js
```
or (in `package.json.scripts`)
```json
"shell": "node --experimental-repl-await repl.js"
```
... and then execute `npm run shell`.

5. Interact with your Mongoose project!
