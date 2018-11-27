import * as React from 'react';
import { TableAdvancedOptions } from './TableAdvancedOptions';

describe('TableAdvancedOptions', () => {
  it('renders without crashing', () => {
    const r = (
      <TableAdvancedOptions
        data={[{ col1: 42 }]}
        displayedColumns={[]}
        groupBy={[]}
        columns={['col1']}
        onColumnsChange={(a: any) => null as any}
        setTableGroupBy={(a: any) => null as any}
      />
    );

    expect(r).toBeDefined();
  });
});
