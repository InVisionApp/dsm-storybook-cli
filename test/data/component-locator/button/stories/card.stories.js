import React from 'react';
import { storiesOf } from '@storybook/react';
import Card from '../src/Card';

storiesOf('Card', module).add('elevated', () => <Card elevated />, { 'in-dsm': { id: '1234' } });
