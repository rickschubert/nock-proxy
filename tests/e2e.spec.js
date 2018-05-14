const axios = require("axios")
const nockProxy = require("./../index")
const nock = require("nock")

describe("nockProxy() without any setup", () => {
    it("Requests are being passed through unmodified", async () => {
        const srcResp = await axios.get("http://www.example.de/")
        const proxy = nockProxy(8095)
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

    it("Errors are also being passed through unmodified", async () => {
        let srcResp
        try {
            srcResp = await axios.get("http://httpstat.us/404")
        } catch (e) {
            srcResp = e.response
        }

        const proxy = nockProxy(8095)

        let proxyResp
        try {
            proxyResp = await axios.get("http://httpstat.us/404", {
                proxy: {
                    host: "127.0.0.1",
                    port: 8095,
                },
            })
        } catch (e) {
            proxyResp = e.response
        }
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

describe("nockProxy() with nocks", () => {
    it("1 nock() setup: First request to that URL is mocked, following ones are real", async () => {
        const proxy = nockProxy(8095)
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

    it("1 nock() setup with JSON reply: adds Content-Type header application/json", async () => {
        const proxy = nockProxy(8095)
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
        expect(proxyResp.headers["content-type"]).toBe("application/json")
        proxy.close()
        nock.cleanAll()
    })

    it("1 nock() setup with text reply: Does not add Content-Type header", async () => {
        const proxy = nockProxy(8095)
        if (!nock.isActive()) nock.activate()
        nock("http://www.example.de", { allowUnmocked: true })
            .get(/.*/)
            .reply(219, "totally not JSON!")
        const proxyResp = await axios.get("http://www.example.de/", {
            proxy: {
                host: "127.0.0.1",
                port: 8095,
            },
        })
        expect(proxyResp.headers["content-type"]).toBeUndefined()
        proxy.close()
        nock.cleanAll()
    })

    it("1 nock() setup: Requests not going to the nock URL serve real responses", async () => {
        const srcResp = await axios.get("http://www.example.de/")
        const proxy = nockProxy(8095)
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

    it("1 nock() setup with persist: Requests to that URL are always mocked", async () => {
        const proxy = nockProxy(8095)
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
        const proxy = nockProxy(8095)
        if (!nock.isActive()) nock.activate()
        nock("http://www.example.de", { allowUnmocked: true })
            .get(/.*/)
            .reply(219, {
                hello: "world",
            })

        nock("http://www.hallopizza.de", { allowUnmocked: true })
            .get(/.*/)
            .reply(219, {
                nockProxy: "hallopizza.de",
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
