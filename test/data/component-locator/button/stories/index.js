import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from '../src';

storiesOf('Button', module).add('Primary', () => <Button primary />, { 'in-dsm': { id: '1234' } });
