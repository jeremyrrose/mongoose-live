const main = (dbConnection, models={}, context={}) => {
    const experimental = process.execArgv.includes('--experimental-repl-await')
    const welcome = 
`\nWelcome to the Mongoose REPL! 
await is${experimental ? "": " NOT"} enabled at the top level.`

    console.log(welcome, experimental ? "" : "\nFor best results, please add --experimental-repl-await to your script or command line.")
    if (Object.keys(models).length) {
        console.log("Available DB Models:", Object.keys(models))
    }
    if (Object.keys(context).length) {
        console.log("Additional context variables:", Object.keys(context))
    }

    const repl = require('repl')
    const replServer = repl.start({
        prompt: "MongooseLive > "
    })

    for (const [k,v] of Object.entries(models)) {
        replServer.context[k] = v
    }

    for (const [k,v] of Object.entries(context)) {
        replServer.context[k] = v
    }

    replServer.context.db = dbConnection
    replServer.on('exit', async () => {
        await replServer.context.db.close()
        console.log("DB closed.\nGoodbye!")
    })
}

module.exports = main;