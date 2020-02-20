import { getUserSettings } from 'store/persistence'

export const isDebugMode = () => (window as any).__DEBUG__ || !!getUserSettings().debugMode
