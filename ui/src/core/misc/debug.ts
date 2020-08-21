export const isDebugMode = () => window.__DEBUG__

declare global {
    interface Window {
        __DEBUG__: boolean
    }
}
