nock-proxy
==========
[![code style:
prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.org/rickschubert/nock-proxy.png)](https://travis-ci.org/rickschubert/nock-proxy)

**Mock network requests with [nock](https://github.com/node-nock/nock) through a
proxy - perfect for real-life environments like end-to-end tests on a real
browser.**

# Install
```
npm install nock-proxy
```

# How does it work
Nock overrides the `http.request` function of the node process it is running in.
This means that we can spawn a simple pass-through proxy server which will reply
with a mock if said mock is being expected via nock.

# Example
```javascript
const nock = require("nock")
const nockProxy = require("nock-proxy")

// Launch the proxy server on your desired port on localhost.
// Don't forget to setup your browser to use this proxy.
nockProxy(8081)

// Setup your mocks via nock, as usual. Use the option allowUnmocked
// to avoid errors from unexpected requests.
nock("http://www.example.de", { allowUnmocked: true })
    .get(/.*/)
    .reply(219, {
        hello: "world",
    })
```

# One test for end-to-end and integration
nock-proxy turns end-to-end tests into integration tests: Simply set up the
browser to pass through nock-proxy for having mocks like in an integration test
environment. Don't pass through the proxy for using real-world network requests.
