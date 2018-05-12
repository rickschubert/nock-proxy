nocke2e: Mocking for End-To-End Tests and Browser Automation
=============================================================
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Mock network requests with [nock](https://github.com/node-nock/nock) - in
end-to-end tests on a real browser.

# How does it work
Nock overrides the `http.request` function of the node request it is running in.
This means that we can spawn a simple pass-through proxy server in the same
process nock runs in to mock browser responses.

# Example

```javascript
const nock = require("nock")
const nocke2e = require("nocke2e")

// Launch the pass-through proxy server on your desired port.
// Don't forget to redirect your browser through that proxy.
nocke2e(8081)

// Use the option allowUnmocked to avoid errors from unexpected requests.
nock("http://www.example.de", { allowUnmocked: true })
    .get(/.*/)
    .reply(219, {
        hello: "world",
    })
```

# One test for both end-to-end and integration tests
nocke2e turns end-to-end into integration tests: Simply set up the browser to go
through nocke2e proxy for having mocks like in an integration test environment.
Don't go through the proxy to keep using real-world network requests.
