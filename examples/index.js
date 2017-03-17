/* eslint-disable react/prop-types */
import React from 'react';
import { storiesOf } from '@kadira/react-native-storybook';
import { View, Text } from 'react-native';

import Pager from '../src/pager';
import AnimatedValues from './animated-values';
import Peeking from './peeking';

const style = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: 'black',
  borderStyle: 'solid',
  margin: 20,
};

const Card = props => (
  <View style={style}>
    {props.children}
  </View>
);

const shortList = ['1', '2', '3'];
const longList = (new Array(100)).fill('').map((v, i) => `${i}`);

storiesOf('Vertical Paging')
  .add('Simple', () => (
    <Pager
      data={shortList}
      keyExtractor={item => item}
      renderPage={({ page }) => (
        <Card><Text>{page}</Text></Card>
      )}
    />
  )).add('100 Pages', () => (
    <Pager
      data={longList}
      keyExtractor={item => item}
      renderPage={({ page }) => (
        <Card><Text>{page}</Text></Card>
      )}
    />
  ))
  .add('Animated Values', () => (
    <AnimatedValues data={longList} />
  ))
  .add('Peeking', () => (
    <Peeking data={shortList} />
  ));

storiesOf('Horizontal Paging')
  .add('Simple', () => (
    <Pager
      data={shortList}
      horizontal
      keyExtractor={item => item}
      renderPage={({ page }) => (
        <Card><Text>{page}</Text></Card>
      )}
    />
  )).add('100 Pages', () => (
    <Pager
      data={longList}
      horizontal
      keyExtractor={item => item}
      renderPage={({ page }) => (
        <Card><Text>{page}</Text></Card>
      )}
    />
  ))
  .add('Animated Values', () => (
    <AnimatedValues horizontal data={longList} />
  ));
