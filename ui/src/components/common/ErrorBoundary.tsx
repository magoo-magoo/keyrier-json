import { logError } from 'core/logging/logger'
import * as React from 'react'
import { Component, ComponentType } from 'react'
import { toast } from 'react-toastify'

const MISSING_ERROR = 'Error was swallowed during propagation.'

type State = {
    error?: Error
}

class ErrorBoundary extends Component<unknown, State> {
    public readonly state: State = {
        error: undefined,
    }

    public componentDidCatch(error: Error | null, info: unknown) {
        this.setState({ error: error || new Error(MISSING_ERROR) }, () => this.notify(info))
    }

    public render() {
        const { children } = this.props
        const { error } = this.state

        if (error) {
            return <>An error occured</>
        }

        return children
    }

    private notify(info: unknown) {
        logError('An error occured', this.state.error)
        logError('error info:', info)
        toast.error(JSON.stringify(info), { position: 'bottom-right', hideProgressBar: true, autoClose: false })
    }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const withErrorBoundary = <T extends {}>(Wrapped: ComponentType<T>) => {
    const WithErrorBoundary = (props: T) => (
        <ErrorBoundary>
            <Wrapped {...props} />
        </ErrorBoundary>
    )
    return WithErrorBoundary
}
