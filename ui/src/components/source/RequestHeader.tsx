import { withErrorBoundary } from 'components/common/ErrorBoundary'
import * as React from 'react'
import { ChangeEvent, FC, memo } from 'react'
import { Button } from 'reactstrap'

interface Props {
    header: [string, string]
    id: number
    onChange: (h: [string, string]) => void
    onRemove: (h: [string, string]) => void
}

export const RenderHeaderInput: FC<Props> = memo(
    withErrorBoundary(({ header, onRemove, onChange, id }) => {
        const [key, value] = header

        const onKeyChange = (e: ChangeEvent<HTMLInputElement>) => onChange([e.target.value, value])
        const onValueChange = (e: ChangeEvent<HTMLInputElement>) => onChange([key, e.target.value])
        const onRemoveCallback = () => onRemove(header)

        return (
            <div className="row align-items-center">
                <div className="col-sm-5">
                    <input
                        className="form-control-lg form-control"
                        value={key}
                        id={`headerName${id}`}
                        type="text"
                        name={`headerName${id}`}
                        placeholder="enter an name"
                        onChange={onKeyChange}
                    />
                </div>
                <div className="col-sm-5">
                    <input
                        className="form-control-lg form-control"
                        value={value}
                        type="text"
                        name={`headerValue${id}`}
                        id={`headerValue${id}`}
                        placeholder="enter an value"
                        onChange={onValueChange}
                    />
                </div>
                <div className="col-sm-2">
                    <Button outline={true} color="danger" onClick={onRemoveCallback}>
                        remove
                    </Button>
                </div>
            </div>
        )
    }),
)
