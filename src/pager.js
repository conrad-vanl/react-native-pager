import React, { PureComponent, PropTypes } from 'react';
import { FlatList, Animated } from 'react-native';

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
    this.layoutWidth = new Animated.Value(0);
    this.layoutHeight = new Animated.Value(0);
    this.scrollX = new Animated.Value(0);
    this.scrollY = new Animated.Value(0);

    this.state = {
      position: this.getAnimatedPosition(this.props),
    };
  }

  componentWillReceiveProps(newProps) {
    if ((newProps.data && newProps.data.length) !== (this.props.data && this.props.data.length)) {
      this.setState({ position: this.getAnimatedPosition(newProps) });
    }
  }

  // Position is the current page position
  getAnimatedPosition({ data, horizontal }) {
    const numPages = (data && data.length) || 0;
    const pageLength = (horizontal) ? this.layoutWidth : this.layoutHeight;
    const scrollPosition = (horizontal) ? this.scrollX : this.scrollY;

    const totalSize = Animated.multiply(pageLength, numPages);
    return Animated.divide(totalSize, scrollPosition);
  }

  renderItem = ({ item }) => {
    const pageProps = {
      page: item,
      position: this.state.position,
      layout: { width: this.layoutWidth, height: this.layoutHeight },
      scroll: { x: this.scrollX, y: this.scrollY },
    };
    return this.props.renderPageContainer({
      renderPage: this.props.renderPage.bind(this, pageProps),
      ...pageProps,
    });
  }

  render() {
    return (
      <FlatList
        renderItem={this.renderItem}
        {...this.props}
        onLayout={Animated.event([{
          nativeEvent: {
            layout: { height: this.layoutHeight, width: this.layoutWidth },
          },
        }])}
        onScroll={Animated.event([{
          nativeEvent: {
            contentOffset: { y: this.scrollY, x: this.scrollX },
          },
        }])}
      />
    );
  }
}

export default Pager;
