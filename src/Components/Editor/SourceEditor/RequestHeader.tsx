import * as React from "react";
import { Button } from "../../Deferred/DeferredReactstrap";

interface Header {
  key: string;
  value: string;
}

interface Props {
  header: Header;
  key: number;
  onChange: (h: Header) => void;
  onRemove: () => void;
}

export const RenderHeaderInput: React.SFC<Props> = ({
  header,
  onRemove,
  onChange,
  key,
}) => {
  return (
    <div className="row align-items-center" key={key}>
      <div className="col-sm-5">
        <input
          className="form-control-lg form-control"
          value={header.key}
          id={`headerName${key}`}
          type="text"
          name={`headerName${key}`}
          placeholder="enter an name"
          onChange={e => onChange({ ...header, key: e.target.value })}
        />
      </div>
      <div className="col-sm-5">
        <input
          className="form-control-lg form-control"
          value={header.value}
          type="text"
          name={`headerValue${key}`}
          id={`headerValue${key}`}
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
  );
};
