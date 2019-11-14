import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

// this file is only used for testing code parsing/analysis
import DateRangePickerWrapper from '../dumm-path';

storiesOf('DRP - Calendar Props', module).add('default', withInfo()(() => <DateRangePickerWrapper autoFocus />), {
  'in-dsm': { id: '5c4eb8659b3358003a8b60ff' }
});
