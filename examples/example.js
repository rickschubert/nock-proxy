const nock = require("nock")
const nockProxy = require("./../index")

nockProxy(8081)

nock("http://www.example.de", { allowUnmocked: true })
    .get(/.*/)
    .reply(219, {
        hello: "world",
    })

nock("http://www.example.de", { allowUnmocked: true })
    .get(/.*/)
    .reply(312, {
        YouAgain: "Yep, it's me again.",
    })

nock("http://httpstat.us/404", { allowUnmocked: true })
    .get(/.*/)
    .reply(219, {
        error: "hidden",
    })
