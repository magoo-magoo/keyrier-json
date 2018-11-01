import { Component, ChangeEvent } from "react";
import * as React from "react";
import {
  Label,
  Input,
  FormGroup,
  Button,
  Alert,
  Col,
  Form
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
  body: string;
  hasBody: boolean;
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
      error: null,
      body: "",
      hasBody: false
    };
  }

  public render() {
    return (
      <React.Fragment>
        <FormGroup>
          <Label for="requestMethod">Method</Label>
          <Input
            type="select"
            bsSize="lg"
            defaultValue="GET"
            name="requestMethod"
            id="requestMethod"
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
        <FormGroup check={true}>
          <Label check={true}>
            <Input checked={this.state.hasBody} type="checkbox" onChange={this.requesthasBodyChange} /> Add
            body
          </Label>
        </FormGroup>
        <Form inline={true} hidden={!this.state.hasBody}>
        <FormGroup>
          <Label>Body</Label>
          <Input
            type="textarea"
            value={this.state.body}
            onChange={this.requestBodyChange}
          />{" "}
        </FormGroup>
        </Form>
        <Label for="headers">Request headers</Label>{" "}
        <Button outline={true} color="primary" onClick={this.addHeader}>
          Add header
        </Button>
        <br />
        <br />
        {this.state.headers.map(this.renderHeaderInput)}
        <br />
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
        Error: {error.message ? error.message : ""}
        {error.stack ? error.stack : ""}
      </Alert>
    );
  };

  private renderHeaderInput = (header: Header, index: number) => {
    const remove = () => this.removeHeader(index);
    const updateName = (e: ChangeEvent<HTMLInputElement>) => this.updateHeaderName(e, index);
    const updateValue = (e: ChangeEvent<HTMLInputElement>) => this.updateHeaderValue(e, index);
    return (
      <div className="row align-items-center" key={index}>
        <Col sm={5}>
          <Input
            value={header.key}
            id={`headerName${index}`}
            type="text"
            name={`headerName${index}`}
            placeholder="enter an name"
            onChange={updateName}
          />
        </Col>
        <Col sm={5}>
          <Input
            value={header.value}
            type="text"
            name={`headerValue${index}`}
            id={`headerValue${index}`}
            placeholder="enter an value"
            onChange={updateValue}
          />
        </Col>
        <Col sm={2}>
          <Button outline={true} color="danger" onClick={remove}>
            remove
          </Button>
        </Col>
      </div>
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

    const requestInit: RequestInit = {
      method: this.state.method,
      headers: this.state.headers.map(h => [h.key, h.value]),
      body: this.state.hasBody ? this.state.body : null
    };

    const request = new Request(this.state.url, requestInit);

    logInfo("request", {
      url: request.url,
      method: request.method,
      mode: request.mode,
      body: request.body,
      headers: Array.from((request.headers as any).entries()),
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
    this.setState({ method: event.target.value, hasBody: false });
  private requesthasBodyChange = (_: ChangeEvent<HTMLInputElement>) => {
// tslint:disable-next-line:no-debugger
debugger;
    this.setState({ hasBody: !this.state.hasBody });
  };
  private requestBodyChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ body: event.target.value });
  };

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
