import React, { PureComponent, PropTypes } from 'react';
import { Text, View, Animated } from 'react-native';
import Pager, { pagePropTypes } from '../src/pager';

const style = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: 'black',
  borderStyle: 'solid',
  margin: 20,
};

class PageView extends PureComponent {
  static propTypes = {
    ...pagePropTypes,
    page: PropTypes.string.isRequired,
  }

  constructor(...args) {
    super(...args);
    this.state = {
      active: 0,
    };

    this.positionListener = this.props.position.addListener(({ value }) => {
      if (this.state.position !== value) this.setState({ position: value });
    });

    this.active = new Animated.Value(0);
    Animated.timing(this.active, { toValue: this.props.active, duration: 0 }).start();
    this.active.addListener(({ value }) => this.setState({ active: value }));
  }

  componentWillUnmount() {
    this.props.position.removeListener(this.positionListener);
    this.active.removeAllListeners();
  }

  render() {
    return (
      <View style={style}>
        <Text>Page: {this.props.page}</Text>
        <Text>Current Position: {this.state.position}</Text>
        <Text>Active: {this.state.active}</Text>
      </View>
    );
  }
}

export default function Container(props) {
  return (
    <Pager
      {...props}
      keyExtractor={item => item}
      renderPage={pageProps => <PageView {...pageProps} />}
    />
  );
}
