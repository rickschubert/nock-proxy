const nockProxy = require("./../index")
const portInUse = require("./utils/portInUse")

describe("nockProxy() unit", () => {
    test("Calling nockProxy() launches the proxy server on the specified port", async () => {
        const port = 8095
        expect(await portInUse(port)).toBe(false)
        const proxy = nockProxy(port)
        expect(await portInUse(port)).toBe(true)
        proxy.close()
    })

    test("Calling nockProxy() without a port throws an error", async () => {
        let errThrown = "No error was thrown."
        try {
            nockProxy()
        } catch (error) {
            errThrown = error
        }
        expect(errThrown).toEqual(new Error("No port specified."))
    })

    test("Calling nockProxy() with non-number port throws an error", async () => {
        let errThrown = "No error was thrown."
        try {
            const proxy = nockProxy("String")
            proxy.close()
        } catch (error) {
            errThrown = error
        }
        expect(errThrown).toEqual(new Error("No port specified."))

        errThrown = "No error was thrown."
        try {
            const proxy = nockProxy({})
            proxy.close()
        } catch (error) {
            errThrown = error
        }
        expect(errThrown).toEqual(new Error("No port specified."))

        errThrown = "No error was thrown."
        try {
            const proxy = nockProxy([])
            proxy.close()
        } catch (error) {
            errThrown = error
        }
        expect(errThrown).toEqual(new Error("No port specified."))

        errThrown = "No error was thrown."
        try {
            const proxy = nockProxy(() => {})
            proxy.close()
        } catch (error) {
            errThrown = error
        }
        expect(errThrown).toEqual(new Error("No port specified."))
    })
})
