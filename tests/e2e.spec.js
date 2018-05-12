const axios = require("axios")
const nocke2e = require("./../index")
const nock = require("nock")

describe("nocke2e() without any setup", () => {
    test("Requests are being passed through unmodified", async () => {
        const srcResp = await axios.get("http://www.example.de/")
        const proxy = nocke2e(8095)
        const proxyResp = await axios.get("http://www.example.de/", {
            proxy: {
                host: "127.0.0.1",
                port: 8095,
            },
        })
        expect(srcResp.data).toEqual(proxyResp.data)
        expect(srcResp.status).toEqual(proxyResp.status)
        expect(srcResp.statusText).toEqual(proxyResp.statusText)
        /* eslint-disable no-undef */
        for (key in srcResp.headers) {
            expect(proxyResp.headers).toHaveProperty(key)
        }
        /* eslint-enable no-undef */
        proxy.close()
    })
})

describe("nocke2e() with nocks", () => {
    test("1 nock() setup: First request to that URL is mocked, following ones are real", async () => {
        const proxy = nocke2e(8095)
        if (!nock.isActive()) nock.activate()
        nock("http://www.example.de", { allowUnmocked: true })
            .get(/.*/)
            .reply(219, {
                hello: "world",
            })
        const proxyResp = await axios.get("http://www.example.de/", {
            proxy: {
                host: "127.0.0.1",
                port: 8095,
            },
        })
        const srcResp = await axios.get("http://www.example.de/", {
            proxy: {
                host: "127.0.0.1",
                port: 8095,
            },
        })

        expect(proxyResp.data).not.toEqual(srcResp.data)
        expect(proxyResp.status).not.toEqual(srcResp.status)
        expect(proxyResp.statusText).not.toEqual(srcResp.statusText)
        proxy.close()
        nock.cleanAll()
    })

    test("1 nock() setup: Requests not going to the nock URL serve real responses", async () => {
        const srcResp = await axios.get("http://www.example.de/")
        const proxy = nocke2e(8095)
        if (!nock.isActive()) nock.activate()
        nock("http://www.hallopizza.de", { allowUnmocked: true })
            .get(/.*/)
            .reply(404, {
                nono: "pizza",
            })
        const respAfterProxySetup = await axios.get("http://www.example.de/", {
            proxy: {
                host: "127.0.0.1",
                port: 8095,
            },
        })
        expect(srcResp.data).toEqual(respAfterProxySetup.data)
        expect(srcResp.status).toEqual(respAfterProxySetup.status)
        expect(srcResp.statusText).toEqual(respAfterProxySetup.statusText)
        /* eslint-disable no-undef */
        for (key in srcResp.headers) {
            expect(respAfterProxySetup.headers).toHaveProperty(key)
        }
        /* eslint-enable no-undef */
        proxy.close()
        nock.cleanAll()
    })

    test("1 nock() setup with persist: Requests to that URL are always mocked", async () => {
        const proxy = nocke2e(8095)
        if (!nock.isActive()) nock.activate()
        nock("http://www.example.de", { allowUnmocked: true })
            .get(/.*/)
            .reply(219, {
                hello: "world",
            })
            .persist()
        const respCallOne = await axios.get("http://www.example.de/", {
            proxy: {
                host: "127.0.0.1",
                port: 8095,
            },
        })
        const respCallTwo = await axios.get("http://www.example.de/", {
            proxy: {
                host: "127.0.0.1",
                port: 8095,
            },
        })

        expect(respCallOne.data).toEqual(respCallTwo.data)
        expect(respCallOne.status).toEqual(respCallTwo.status)
        expect(respCallOne.statusText).toEqual(respCallTwo.statusText)
        proxy.close()
        nock.cleanAll()
    })

    it("Multiple nock() setups: Requests to these URLs are mocked", async () => {
        const exampleSrcResp = await axios.get("http://www.example.de/")
        const pizzaSrcResp = await axios.get("http://www.hallopizza.de/")
        const proxy = nocke2e(8095)
        if (!nock.isActive()) nock.activate()
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
        const exampleMockResp = await axios.get("http://www.example.de/", {
            proxy: {
                host: "127.0.0.1",
                port: 8095,
            },
        })
        const pizzaMockResp = await axios.get("http://www.hallopizza.de/", {
            proxy: {
                host: "127.0.0.1",
                port: 8095,
            },
        })
        expect(exampleSrcResp.data).not.toEqual(exampleMockResp.data)
        expect(exampleSrcResp.status).not.toEqual(exampleMockResp.status)
        expect(exampleSrcResp.statusText).not.toEqual(
            exampleMockResp.statusText
        )
        expect(pizzaSrcResp.data).not.toEqual(pizzaMockResp.data)
        expect(pizzaSrcResp.status).not.toEqual(pizzaMockResp.status)
        expect(pizzaSrcResp.statusText).not.toEqual(pizzaMockResp.statusText)
        proxy.close()
        nock.cleanAll()
    })
})
