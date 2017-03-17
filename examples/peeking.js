import React, { PureComponent, PropTypes } from 'react';
import { Text, View, Animated, TouchableOpacity } from 'react-native';
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

  isPeeking = false;
  peekAnimation = new Animated.Value(0);
  togglePeeking = () => {
    const toValue = (this.isPeeking) ? 0 : 1;
    Animated.spring(this.peekAnimation, { toValue }).start();
    this.isPeeking = !this.isPeeking;
  }

  advance = () => {
    this.props.onScrollToIndex({ index: this.props.index + 1 });
  }

  previous = () => {
    this.props.onScrollToIndex({ index: this.props.index - 1 });
  }

  render() {
    const { layout, active } = this.props;

    // should == layout.height when inactive, 0 when active
    const heightByActive = Animated.multiply(
      layout.height,
      Animated.multiply(Animated.add(active, -1), -1),
    );

    const peekHeightMultiplier = Animated.add(
      Animated.multiply(-0.1, this.peekAnimation),
      1,
    );
    const heightByPeeking = Animated.multiply(layout.height, peekHeightMultiplier);
    this.heightByActive = heightByActive;

    return (
      <Animated.View style={{ ...layout, minHeight: heightByActive, height: heightByPeeking }}>
        <View style={style}>
          {this.props.renderPage()}
          <TouchableOpacity onPress={this.togglePeeking}>
            <Text>Toggle Peeking</Text>
          </TouchableOpacity>

          <Animated.View
            style={{
              position: 'absolute',
              opacity: this.peekAnimation,
              bottom: 10,
              left: 10,
              right: 10,
              alignItems: 'center',
            }}
          >
            <TouchableOpacity onPress={this.advance}><Text>Next</Text></TouchableOpacity>
          </Animated.View>

          {(this.props.index > 0) ? (
            <Animated.View
              style={{
                position: 'absolute',
                opacity: active,
                top: 10,
                left: 10,
                right: 10,
                alignItems: 'center',
              }}
            >
              <TouchableOpacity onPress={this.previous}><Text>Previous</Text></TouchableOpacity>
            </Animated.View>
          ) : null }
        </View>
      </Animated.View>
    );
  }
}

export default class Container extends PureComponent {
  onScrollToIndex = ({ index }) => {
    this.pager.scrollToIndex({ index, animated: true });
  }

  render() {
    return (
      <Pager
        {...this.props}
        ref={(ref) => { this.pager = ref; }}
        keyExtractor={item => item}
        renderPage={({ page }) => <Text>{page}</Text>}
        renderPageContainer={pageProps => (
          <PageView {...pageProps} onScrollToIndex={this.onScrollToIndex} />
        )}
        scrollEnabled={false}
      />
    );
  }
}
