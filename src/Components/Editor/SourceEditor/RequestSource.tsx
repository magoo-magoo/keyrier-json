import { Component, ChangeEvent } from "react";
import * as React from "react";
import {
  Label,
  Input,
  Form,
  FormGroup,
  Button,
  Alert
} from "../../Deferred/DeferredReactstrap";
import { logError, logInfo } from "../../../helpers/logger";
import { connect } from "react-redux";
import { updateSource } from "../../../Actions/actions";
import { customToString } from "../../../helpers/string";

interface Header {
  key: string;
  value: string;
}
interface State {
  url: string;
  method: string;
  headers: Header[];
  error: TypeError | null;
}
interface Props {
  onRequestSucceed: () => void;
  updateSource: (src: string) => void;
}
export class HttpRequestSource extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      method: "GET",
      url: "https://rickandmortyapi.com/api/character/",
      headers: [{ key: "Accept", value: "application/json" }],
      error: null
    };
  }

  public render() {
    return (
      <React.Fragment>
        <FormGroup>
          <Label for="exampleSelect">Method</Label>
          <Input
            type="select"
            bsSize="lg"
            defaultValue="GET"
            name="requestMethod"
            id="exarequestMethodmpleSelect"
            onChange={this.requestMethodChange}
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>OPTIONS</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="requestUrl">Request URL</Label>
          <Input
            defaultValue={this.state.url}
            bsSize="lg"
            type="url"
            name="requestUrl"
            id="requestUrl"
            placeholder="enter an URL"
            onChange={this.requestUrlChange}
          />
        </FormGroup>
        {this.state.headers.map(this.renderHeaderInput)}
        <Button outline={true} color="primary" onClick={this.addHeader}>
          Add header
        </Button>
        <Button block={true} color="primary" onClick={this.submit}>
          Submit
        </Button>

        {this.displayError(this.state.error)}
      </React.Fragment>
    );
  }

  private displayError = (error: TypeError | null) => {
    if (!error) {
      return <React.Fragment />;
    }
    return (
      <Alert color="danger">
        Error: {error.message ? error.message : ''}
        {error.stack ? error.stack : ''}
      </Alert>
    );
  };

  private renderHeaderInput = (header: Header, index: number) => {
    const remove = () => this.removeHeader(index);
    const updateName = (e: any) => this.updateHeaderName(e, index);
    const updateValue = (e: any) => this.updateHeaderValue(e, index);
    return (
      <Form inline={true} key={index}>
        <FormGroup>
          <Label for={`headerName${index}`}>name {index + 1}</Label>
          <Input
            defaultValue={header.key}
            id={`headerName${index}`}
            type="text"
            name={`headerName${index}`}
            placeholder="enter an name"
            onChange={updateName}
          />
        </FormGroup>
        <FormGroup>
          <Label for={`headerValue${index}`}>value {index + 1}</Label>
          <Input
            defaultValue={header.value}
            type="text"
            name={`headerValue${index}`}
            id={`headerValue${index}`}
            placeholder="enter an value"
            onChange={updateValue}
          />
        </FormGroup>

        <Button
          className="float-right"
          outline={true}
          color="danger"
          onClick={remove}
        >
          remove
        </Button>
      </Form>
    );
  };

  private addHeader = () =>
    this.setState({
      headers: [
        ...this.state.headers,
        { key: `name-${this.state.headers.length + 1}`, value: "value" }
      ]
    });

  private removeHeader = (index: number) =>
    this.setState({
      headers: this.state.headers.filter((_, i) => i !== index)
    });

  private submit = async () => {
    this.setState({ error: null });
    const headers: Headers = new Headers();
    this.state.headers.forEach(header =>
      headers.append(header.key, header.value)
    );

    const requestInit: RequestInit = {
      method: this.state.method,
      headers,
      cache: "no-cache"
    };
    const request = new Request(this.state.url, requestInit);
    logInfo("request", {
      url: request.url,
      method: request.method,
      mode: request.mode,
      headers: request.headers.forEach,
      cache: request.cache,
      credentials: request.credentials,
      redirect: request.redirect,
      referrer: request.referrer
    });

    let json: string;
    try {
      const result = await fetch(request);
      json = await result.json();
    } catch (error) {
      logError("HttpRequestSource.submit", error);
      this.setState({ error });
      return;
    }
    this.props.updateSource(customToString(json));
    this.props.onRequestSucceed();
  };
  private requestUrlChange = (event: ChangeEvent<HTMLInputElement>) =>
    this.setState({ url: event.target.value });
  private requestMethodChange = (event: ChangeEvent<HTMLInputElement>) =>
    this.setState({ method: event.target.value });

  private updateHeaderName = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newHeadersArray = [...this.state.headers];
    newHeadersArray[index] = {
      ...newHeadersArray[index],
      key: event.target.value
    };
    this.setState({ headers: newHeadersArray });
  };
  private updateHeaderValue = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newHeadersArray = [...this.state.headers];
    newHeadersArray[index] = {
      ...newHeadersArray[index],
      value: event.target.value
    };
    this.setState({ headers: newHeadersArray });
  };
}

export default connect(
  _ => ({}),
  { updateSource }
)(HttpRequestSource);
