let realstdin: NodeJS.ReadStream

type callback = (payload?: any) => void

let readableListeners: callback[] = []
let endListeners: callback[] = []
let messages: string[] = []
const mockstdin = {
    isTTY: false,
    setEncoding: () => null,
    on: (event: string, cb: callback) => {
        if (event === 'readable') {
            readableListeners.push(cb)
        }
        if (event === 'end') {
            endListeners.push(cb)
        }
    },
    send: (msg: string) => {
        messages.push(msg)
        let cb: callback | undefined
        while ((cb = readableListeners.shift())) {
            cb()
        }
    },
    read: () => {
        return messages.shift()
    },
    end: () => {
        let cb: callback | undefined
        while ((cb = endListeners.shift())) {
            cb()
        }
    },
}

const mock = () => {
    realstdin = process.stdin
    Object.defineProperty(process, 'stdin', {
        writable: true,
        value: mockstdin,
    })
    // process.stdin = mockstdin as any
    return mockstdin
}

const restore = () => {
    readableListeners = []
    endListeners = []
    messages = []
    process.stdin = realstdin
}

export type MockStdin = typeof mockstdin

export default {
    mock,
    restore,
}
