import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, DeviceEventEmitter } from 'react-native';
import { ComicView } from './src/ComicView';
import { setIndex, prefetchComics } from './src/dataStore';
import Carousel from 'react-native-snap-carousel';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.eventListener = DeviceEventEmitter.addListener('refresh', (data) => {
      console.log('refresh');

      this.setState({
        data
      });
    });
  }

  _renderItem({ item, index }) {
    return (
      <ComicView {...item} />
    );
  }

  render() {
    const { data } = this.state;

    return (
      <View style={styles.container}>
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={data}
          renderItem={this._renderItem}
          sliderWidth={Dimensions.get('window').width}
          itemWidth={Dimensions.get('window').width - 75}
          layout="default"
          onSnapToItem={setIndex}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    borderStyle: 'solid',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d6d7da',
    flex: 1,
  },
});
