import { NowRequest, NowResponse } from '@now/node'
import * as fs from 'fs'
export default async (_request: NowRequest, response: NowResponse) => {
    const promise = new Promise<string[]>((resolve, reject) => {
        fs.readdir('.', (err, files) => {
            if (err) {
                reject(err)
            }
            resolve(files)
        })
    })
    const value = await promise

    response.status(200).send(value)
}
