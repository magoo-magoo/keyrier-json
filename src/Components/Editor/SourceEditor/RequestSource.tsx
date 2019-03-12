import * as React from 'react'
import { logError, logInfo } from '../../../helpers/logger'
import { connect } from 'react-redux'
import { updateSource } from '../../../Actions/actions'
import { customToString } from '../../../helpers/string'
import { RenderHeaderInput } from './RequestHeader'
import { useState, memo } from 'react'
import { Alert, FormGroup, Form, Button } from '../../Deferred/DeferredReactstrap'
import { useToggleState, useChangeEventState } from '../../../Hooks/hooks'
import { withErrorBoundary } from '../../Common/ErrorBoundary'

interface Props {
  onRequestSucceed: () => void
  setSource: (src: string) => void
}

const displayError = (error: TypeError | null) => {
  if (!error) {
    return <></>
  }
  return (
    <Alert color="danger">
      Error: {error.message ? error.message : ''}
      {error.stack ? error.stack : ''}
    </Alert>
  )
}

const HttpRequestSource: React.FC<Props> = ({ onRequestSucceed, setSource }) => {
  const [method, setMethod] = useChangeEventState('GET')
  const [url, setUrl] = useChangeEventState('https://rickandmortyapi.com/api/character/')
  const [body, setBody] = useChangeEventState('')
  const [headers, setHeaders] = useState([{ key: 'Accept', value: 'application/json' }])
  const [error, setError] = useState(null as TypeError | null)
  const [hasBody, setHasBody] = useToggleState()

  const submit = buildSubmit(setError, method, headers, hasBody, body, url, setSource, onRequestSucceed)

  return (
    <>
      <FormGroup>
        <label htmlFor="requestMethod">Method</label>
        <select
          className="form-control-lg form-control"
          defaultValue={method}
          name="requestMethod"
          id="requestMethod"
          onChange={setMethod}
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>OPTIONS</option>
        </select>
      </FormGroup>
      <FormGroup>
        <label htmlFor="requestUrl">Request URL</label>
        <input
          defaultValue={url}
          className="form-control-lg form-control"
          type="url"
          name="requestUrl"
          id="requestUrl"
          placeholder="enter an URL"
          onChange={setUrl}
        />
      </FormGroup>
      <div className="position-relative form-check">
        <label className="form-check-label">
          <input type="checkbox" className="form-check-input" onChange={setHasBody} /> Add body
        </label>
      </div>
      <Form inline={true} hidden={!hasBody}>
        <FormGroup>
          <label>Body</label>
          <input className="form-control-lg form-control" type="textarea" value={body} onChange={setBody} />{' '}
        </FormGroup>
      </Form>
      <label htmlFor="headers">Request headers</label>{' '}
      <Button
        outline={true}
        color="primary"
        onClick={() => setHeaders([...headers, { key: `name-${headers.length + 1}`, value: 'value' }])}
      >
        Add header
      </Button>
      <br />
      <br />
      {headers.map((header, index) => (
        <RenderHeaderInput
          header={header}
          key={index}
          id={index}
          onChange={h => {
            headers[index] = { ...h }
            setHeaders([...headers])
          }}
          onRemove={() => setHeaders(headers.filter(h => h !== header))}
        />
      ))}
      <br />
      <Button block={true} color="primary" onClick={submit}>
        Submit
      </Button>
      {displayError(error)}
    </>
  )
}

export default connect(
  null,
  { setSource: updateSource }
)(withErrorBoundary(memo(HttpRequestSource)))

const buildSubmit = (
  setError: (e: TypeError | null) => void,
  method: string,
  headers: Array<{ key: string; value: string }>,
  hasBody: boolean,
  body: string,
  url: string,
  setSource: (src: string) => void,
  onRequestSucceed: () => void
) => {
  return async () => {
    setError(null)
    const requestInit: RequestInit = {
      method,
      headers: headers.map(h => [h.key, h.value]),
      body: hasBody ? body : null,
    }
    const request = new Request(url, requestInit)
    logInfo('request', {
      url: request.url,
      method: request.method,
      mode: request.mode,
      body: request.body,
      headers: Array.from((request.headers as any).entries()),
      cache: request.cache,
      credentials: request.credentials,
      redirect: request.redirect,
      referrer: request.referrer,
    })
    let json: string
    try {
      const result = await fetch(request)
      json = await result.json()
    } catch (error) {
      logError('HttpRequestSource.submit', error)
      setError(error)
      return
    }
    setSource(customToString(json))
    onRequestSucceed()
  }
}
