// tslint:disable:no-console

export const logError = (error: string | Error, payload: any = undefined) => {
  console.error('Keyrier error', error)
  console.error(payload)
}

export const logWarning = (warnMessage: string, payload: any = undefined) => {
  console.warn(warnMessage, payload)
}

export const logInfo = (warnMessage: string, payload: any = undefined) => {
  console.warn(warnMessage, payload)
}
