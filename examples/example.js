const nock = require("nock")
const nockProxy = require("./../index")

nockProxy(8081)

nock("http://www.example.de", { allowUnmocked: true })
    .get(/.*/)
    .reply(219, {
        hello: "world",
    })

nock("http://www.hallopizza.de", { allowUnmocked: true })
    .get(/.*/)
    .reply(219, {
        pizza: "party",
    })
