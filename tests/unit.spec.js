const nocke2e = require("./../index")
const portInUse = require("./utils/portInUse")

describe("nocke2e() unit", () => {
    test("Calling nocke2e() launches the proxy server on the specified port", async () => {
        const port = 8093
        expect(await portInUse(port)).toBe(false)
        const proxy = nocke2e(port)
        expect(await portInUse(port)).toBe(true)
        proxy.close()
    })

    test("Calling nocke2e() without a port throws an error", async () => {
        let errThrown = "No error was thrown."
        try {
            nocke2e()
        } catch (error) {
            errThrown = error
        }
        expect(errThrown).toEqual(new Error("No port specified."))
    })

    test("Calling nocke2e() with non-number port throws an error", async () => {
        let errThrown = "No error was thrown."
        try {
            const proxy = nocke2e("String")
            proxy.close()
        } catch (error) {
            errThrown = error
        }
        expect(errThrown).toEqual(new Error("No port specified."))

        errThrown = "No error was thrown."
        try {
            const proxy = nocke2e({})
            proxy.close()
        } catch (error) {
            errThrown = error
        }
        expect(errThrown).toEqual(new Error("No port specified."))

        errThrown = "No error was thrown."
        try {
            const proxy = nocke2e([])
            proxy.close()
        } catch (error) {
            errThrown = error
        }
        expect(errThrown).toEqual(new Error("No port specified."))

        errThrown = "No error was thrown."
        try {
            const proxy = nocke2e(() => {})
            proxy.close()
        } catch (error) {
            errThrown = error
        }
        expect(errThrown).toEqual(new Error("No port specified."))
    })
})
