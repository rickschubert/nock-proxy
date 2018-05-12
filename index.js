let content = ""
const mockJson = require("./mock.json")

const qars = (newContent) => {
        content = newContent
        console.log({content, newContent})
    }

const axios = require("axios")
const http = require('http')

http.createServer(async function (req, res) {
    if (content === "") {
        const response = await axios(req)
        res.writeHead(response.status, response.statusText, response.headers)
        res.write(response.data)
        res.end()
    } else {
        res.writeHead(203, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify({
            content,
            headers: req.headers
        }, true, 2))
        res.end()
        content = ""
    }
}).listen(8081)


setTimeout(() => {
    qars(mockJson)
},6000)

