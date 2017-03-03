import React, { PureComponent, PropTypes } from 'react';
import { FlatList, Animated } from 'react-native';

class Pager extends PureComponent {
  static propTypes = {
    renderPage: PropTypes.func.isRequired,
    onNavigateBack: PropTypes.func,
    onNavigateForward: PropTypes.func,
    onPageScroll: PropTypes.func,
    ...FlatList.propTypes,
  };

  static defaultProps = {
    style: { flex: 1 },
    pagingEnabled: true,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    onNavigateBack: undefined,
    onNavigateForward: undefined,
    onPageScroll: undefined,
  }

  constructor(...args) {
    super(...args);
    this.state = {
      layoutWidth: new Animated.Value(0),
      layoutHeight: new Animated.Value(0),
    };
  }

  renderItem = ({ item }) => (
    <Animated.View style={{ width: this.state.layoutWidth, height: this.state.layoutHeight }}>
      {this.props.renderPage({ page: item })}
    </Animated.View>
  );

  render() {
    return (
      <FlatList
        onLayout={Animated.event([{
          nativeEvent: {
            layout: { height: this.state.layoutHeight, width: this.state.layoutWidth },
          },
        }])}
        renderItem={this.renderItem}
        {...this.props}
      />
    );
  }
}

export default Pager;
