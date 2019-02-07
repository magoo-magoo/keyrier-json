import * as React from 'react';
import { connect } from 'react-redux';

import { UpdateSource, updateSource } from '../../../Actions/actions';
import { jsonBeautify } from '../../../helpers/json';
import { RootState } from '../../../State/State';
import ImportMenu from './ImportMenu';
import { AceEditor } from '../../Deferred/DeferredAceEditor';
import { getSourceText } from '../../../Store/selectors';

interface Props {
  onChange: (val: string) => UpdateSource;
  sourceText: string;
}

export const SourceEditor: React.FC<Props> = ({ onChange, sourceText }) => (
  <>
    <div className="row">
      <div className="col-sm-10 offset-sm-2">
        <h3>paste your JSON:</h3>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-2">
        <ImportMenu />
      </div>
      <div className="col-sm-10">
        <AceEditor
          mode="json"
          theme="monokai"
          name="sourceAceEditor"
          onChange={onChange}
          fontSize={18}
          cursorStart={1}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={jsonBeautify(sourceText)}
          debounceChangePeriod={500}
          minLines={10}
          maxLines={20}
          wrapEnabled={true}
          // debounceChangePeriod={2000}
          setOptions={{
            showLineNumbers: true,
          }}
          editorProps={{ $blockScrolling: Infinity }}
          width={'100%'}
          annotations={[]}
        />
      </div>
    </div>
  </>
);

const mapStateToProps = (state: Readonly<RootState>) => ({
  sourceText: getSourceText(state),
});

export default connect(
  mapStateToProps,
  { onChange: updateSource }
)(SourceEditor);
