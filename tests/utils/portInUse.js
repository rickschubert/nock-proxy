const http = require("http")

module.exports = (port) => {
    return new Promise((resolve, reject) => {
        const server = http.createServer().listen(port)

        server.on("error", (e) => {
            if (e) resolve(true)
        })

        server.on("listening", (e) => {
            if (e) reject(e)
            server.close()
            resolve(false)
        })

        setTimeout(() => {
            reject(Error("Server hasn't been called after 5000 msec"))
        }, 5000)
    })
}
