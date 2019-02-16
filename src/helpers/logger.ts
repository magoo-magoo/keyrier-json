// tslint:disable:no-console

export const logError = (error: string | Error, payload: any = undefined) => {
  console.error('Keyrier error', error)
  if (typeof payload !== 'undefined') {
    console.error(payload)
  }
}

export const logWarning = (message: string, payload: any = undefined) => {
  if (typeof payload === 'undefined') {
    console.warn(message)
  }
  console.warn(message, payload)
}

export const logInfo = (message: string, payload: any = undefined) => {
  if (typeof payload === 'undefined') {
    console.info(message)
  }
  console.info(message, payload)
}
