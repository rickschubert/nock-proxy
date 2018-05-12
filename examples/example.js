const nock = require("nock")
const nocke2e = require("./../index")

nocke2e(8081)

nock("http://www.example.de", { allowUnmocked: true })
    .get(/.*/)
    .reply(219, {
        hello: "world",
    })

nock("http://www.hallopizza.de", { allowUnmocked: true })
    .get(/.*/)
    .reply(219, {
        nocke2e: "hallopizza.de",
    })
