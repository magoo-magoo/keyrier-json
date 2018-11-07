import * as React from 'react';
import {
  getOutputObject,
  getOutputSearchTerm,
  getOutputText,
  getOutputSearchMatch,
} from '../../../Store/selectors';
import { RootState } from '../../../State/State';
import { connect } from 'react-redux';
import { DebounceInput } from 'react-debounce-input';
import { updateSearchTerm, UpdateSearchTerm } from '../../../Actions/actions';
import { AceEditor } from '../../Deferred/DeferredAceEditor';

interface Props {
  src: object | null;
  searchTerm: string | undefined;
  text: string;
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
      />
      <AceEditor
        mode="json"
        theme="github"
        name="outputAceEditor"
        fontSize={18}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={JSON.stringify(src, null, 4)}
        minLines={10}
        maxLines={100}
        wrapEnabled={false}
        readOnly={true}
        editorProps={{ $blockScrolling: Infinity }}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
        }}
        width={'100%'}
      />
      {/* <ReactJson
        name="data"
        src={src || {}}
        theme="monokai"
        iconStyle="square"
        collapseStringsAfterLength={15}
        onEdit={event => console.log(event.updated_src)}
      /> */}
    </>
  );
};

const mapStateToProps = (state: Readonly<RootState>) => {
  return {
    src: getOutputObject(state),
    text: getOutputText(state),
    searchTerm: getOutputSearchTerm(state),
    match: getOutputSearchMatch(state),
  };
};

export default connect(
  mapStateToProps,
  { onSearchChange: updateSearchTerm }
)(JsonView);
