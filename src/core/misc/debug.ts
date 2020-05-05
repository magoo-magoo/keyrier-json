import persistence from 'store/persistence'

export const isDebugMode = () => (window as any).__DEBUG__ || !!persistence.getUserSettings().debugMode
