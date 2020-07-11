const readStdin = () => {
    const { stdin } = process
    let result = ''

    return new Promise<string>((resolve) => {
        if (stdin.isTTY) {
            resolve(result)
            return
        }

        stdin.setEncoding('utf8')

        stdin.on('readable', () => {
            let chunk: string

            while ((chunk = stdin.read())) {
                result += chunk
            }
        })

        stdin.on('end', () => {
            resolve(result)
        })
    })
}

export { readStdin }
