import React, { PureComponent, PropTypes } from 'react';
import { FlatList, Animated, Dimensions } from 'react-native';

const window = Dimensions.get('window');

export const pagePropTypes = {
  page: PropTypes.any, // this is "any" as it just passes the value given in data
  position: PropTypes.instanceOf(Animated.Value),
  active: PropTypes.instanceOf(Animated.Interpolation),
  layout: PropTypes.shape({
    width: PropTypes.instanceOf(Animated.Value),
    height: PropTypes.instanceOf(Animated.Value),
  }),
};

class Pager extends PureComponent {
  static propTypes = {
    renderPage: PropTypes.func.isRequired,
    renderPageContainer: PropTypes.func.isRequired,
    onNavigateBack: PropTypes.func,
    onNavigateForward: PropTypes.func,
    onPageScroll: PropTypes.func,
    ...FlatList.propTypes,
  };

  static defaultProps = {
    style: { flex: 1 },
    pagingEnabled: true,
    horizontal: false,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    onNavigateBack: undefined,
    onNavigateForward: undefined,
    onPageScroll: undefined,
    renderPageContainer: ({ renderPage, layout }) => (
      <Animated.View style={{ height: layout.height, width: layout.width }}>
        {renderPage()}
      </Animated.View>
    ),
  }

  constructor(...args) {
    super(...args);
    this.setupPositionTracking(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.setupPositionTracking(newProps);
  }

  /**
   * Sets this.position to auto-track the current page index of the list view
   * Only needs to be ran when this.data or this.horizontal changes
   */
  setupPositionTracking({ data, horizontal }) {
    const numPages = (data && data.length) || 0;

    const pageSize = (horizontal) ? this.layoutWidth : this.layoutHeight;
    const totalSize = Animated.multiply(pageSize, numPages);
    const percentage = Animated.divide(this.scrollAmount, totalSize);
    const position = Animated.multiply(percentage, numPages);

    // Todo: is this best way to set up tracking?
    // Should we just set this.position to an AnimatedMultiplcation instead?
    // Essentially, using this timing functions allows for
    // this.position to be an instanceOf Animated.Value. But do we need that?
    // This also makes this.position immutable / pure (always referentially equal)
    Animated.timing(this.position, {
      toValue: position,
      duration: 0,
    }).start();
  }

  layoutWidth = new Animated.Value(window.width);
  layoutHeight = new Animated.Value(window.height);
  position = new Animated.Value(0);
  scrollAmount = new Animated.Value(0);
  activeAnimators = [];

  handleScroll = ({ nativeEvent: { contentOffset: { y, x } } }) => {
    const scrollAmount = (this.props.horizontal) ? x : y;
    this.scrollAmount.setValue(scrollAmount);
  }

  handleLayout = Animated.event([{
    nativeEvent: {
      layout: { height: this.layoutHeight, width: this.layoutWidth },
    },
  }]);

  renderItem = ({ item, index }) => {
    const active = this.activeAnimators[index] || (
      this.activeAnimators[index] = this.position.interpolate({
        // since this calculation is only based on this.position, which is guaranteed static, we can
        // store this in an array for cheap lookup on re-renders (and keeps the passed props pure)
        inputRange: [index - 1, index, index + 1],
        outputRange: [0, 1, 0],
        extrapolate: 'clamp',
      })
    );

    const pageProps = {
      page: item,
      position: this.position,
      active,
      layout: { width: this.layoutWidth, height: this.layoutHeight },
    };

    return this.props.renderPageContainer({
      renderPage: this.props.renderPage.bind(this, pageProps),
      ...pageProps,
    });
  }

  render() {
    return (
      <FlatList
        {...this.props}
        renderItem={this.renderItem}
        onLayout={this.handleLayout}
        onScroll={this.handleScroll}
        scrollEventThrottle={16}
      />
    );
  }
}

export default Pager;
