import * as React from 'react'
import { Button } from '../../Deferred/DeferredReactstrap'
import { memo } from 'react'
import { withErrorBoundary } from '../../Common/ErrorBoundary'

interface Header {
  key: string
  value: string
}

interface Props {
  header: Header
  id: number
  onChange: (h: Header) => void
  onRemove: () => void
}

export const RenderHeaderInput: React.FC<Props> = memo(
  withErrorBoundary(({ header, onRemove, onChange, id }) => {
    return (
      <div className="row align-items-center" key={id}>
        <div className="col-sm-5">
          <input
            className="form-control-lg form-control"
            value={header.key}
            id={`headerName${id}`}
            type="text"
            name={`headerName${id}`}
            placeholder="enter an name"
            onChange={e => onChange({ ...header, key: e.target.value })}
          />
        </div>
        <div className="col-sm-5">
          <input
            className="form-control-lg form-control"
            value={header.value}
            type="text"
            name={`headerValue${id}`}
            id={`headerValue${id}`}
            placeholder="enter an value"
            onChange={e => onChange({ ...header, value: e.target.value })}
          />
        </div>
        <div className="col-sm-2">
          <Button outline={true} color="danger" onClick={onRemove}>
            remove
          </Button>
        </div>
      </div>
    )
  })
)
