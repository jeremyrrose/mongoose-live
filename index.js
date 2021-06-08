const main = async (dbConnection, models={}, context={}, options={}) => {

    // detect whether await is enabled
    const experimental = process.execArgv.includes('--experimental-repl-await')

    // welcome messaging
    const welcome = 
`
\u001b[34mWelcome to the Mongoose Live REPL!\u001b[0m
Documentation: https://www.npmjs.com/package/mongoose-live
${module.parent.filename ? `Edit \u001b[32m${module.parent.filename}\u001b[0m to configure.` : "" }

\u001b[34mStatus:\u001b[0m
\u001b[32mawait\u001b[0m is${experimental ? "" : " \u001b[31mNOT\u001b[0m"} enabled at the top level.`

    console.log(welcome, experimental ? "" : "For best results, please add \u001b[32m--experimental-repl-await\u001b[0m to your script or command line.")
    
    console.log(dbConnection._hasOpened ? `DB connected at: \u001b[32m${dbConnection._connectionString}\u001b[0m` : "\u001b[31mAlert\u001b[0m: No DB connection detected.")

    console.log("Available DB Models:", Object.keys(models))

    if (Object.keys(context).length) {
        console.log("Additional context variables:", Object.keys(context))
    }

    console.log("\n")

    // repl start
    const prompt = options.prompt || "MongooseLive > "

    const repl = require('repl')
    const replServer = repl.start({
        prompt: prompt
    })

    // fill base context; preserves base context on .clear
    const populateContext = () => {
        for (const [k,v] of Object.entries(models)) {
            replServer.context[k] = v
        }

        for (const [k,v] of Object.entries(context)) {
            replServer.context[k] = v
        }

        replServer.context.db = dbConnection
    }
    populateContext()
    replServer.on('reset', populateContext)

    // closes DB on .exit
    replServer.on('exit', async () => {
        await replServer.context.db.close()
        console.log("DB closed.\nGoodbye!")
    })
}

module.exports = main;