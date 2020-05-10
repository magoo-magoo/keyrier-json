const localStorageMock = {
    clear: jest.fn(),
    getItem: jest.fn(),
    setItem: jest.fn(),
}
;(global as any).localStorage = localStorageMock
;(URL as any).createObjectURL = () => {
    //
}
;(global as any).Worker = {}
