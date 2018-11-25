import * as React from 'react';
import {
  getOutputObject,
  getOutputSearchTerm,
  getOutputSearchMatch,
} from '../../../Store/selectors';
import { RootState } from '../../../State/State';
import { connect } from 'react-redux';
import { DebounceInput } from 'react-debounce-input';
import { updateSearchTerm, UpdateSearchTerm } from '../../../Actions/actions';
import { Suspense, lazy } from 'react';
const ReactJson = lazy(() => import('react-json-view'));

interface Props {
  src: object | null;
  searchTerm: string | undefined;
  match: boolean;
  onSearchChange: (value: string) => UpdateSearchTerm;
}

const errorStyles = { border: '3px solid red' };

const JsonView: React.SFC<Props> = ({
  src,
  searchTerm,
  onSearchChange,
  match,
}) => {
  return (
    <>
      <DebounceInput
        style={searchTerm && searchTerm !== '' && !match ? errorStyles : {}}
        value={searchTerm}
        className="form-control"
        onChange={e => onSearchChange(e.target.value)}
        debounceTimeout={500}
        placeholder="Type your search term..."
      />
      <Suspense fallback={<div>Loading...</div>}>
        <ReactJson
          src={src ? src : {}}
          name="data"
          iconStyle="triangle"
          indentWidth={8}
          onAdd={() => {}}
          onDelete={() => {}}
          onEdit={() => {}}
          onSelect={() => {}}
        />
      </Suspense>
    </>
  );
};

const mapStateToProps = (state: Readonly<RootState>) => {
  return {
    src: getOutputObject(state),
    searchTerm: getOutputSearchTerm(state),
    match: getOutputSearchMatch(state),
  };
};

export default connect(
  mapStateToProps,
  { onSearchChange: updateSearchTerm }
)(JsonView);
