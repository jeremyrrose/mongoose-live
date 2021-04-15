const main = (dbConnection, models={}) => {
    const experimental = process.execArgv.includes('--experimental-repl-await')
    const welcome = 
`\nWelcome to the Mongoose REPL! 
await is${experimental ? "": " NOT"} enabled at the top level.`

    console.log(welcome, experimental ? "" : "\nFor best results, please add --experimental-repl-await to your script or command line.")
    console.log("Available DB Models:", Object.keys(models))

    const repl = require('repl')
    const replServer = repl.start({
        prompt: "MongooseLive > "
    })

    for (const [k,v] of Object.entries(models)) {
        replServer.context[k] = v
    }

    replServer.context.db = dbConnection
    replServer.on('exit', async () => {
        await replServer.context.db.close()
        console.log("DB closed.\nGoodbye!")
    })
}

export default main;