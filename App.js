import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, Image, ScrollView, WebView, Dimensions, DeviceEventEmitter } from 'react-native';
import { ComicView } from './src/ComicView';
import { arrayOfComics, getInitialData, prefetchComics, getIndex, setIndex } from './src/dataStore';
import Carousel from 'react-native-snap-carousel';
import Store from './src/Store';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      data: []
    };
  }

  componentDidMount() {
    this.eventListener = DeviceEventEmitter.addListener('refresh', () => {
      this.forceUpdate();
    });

    getInitialData()
      .then(() => {
        this.setState({
          isLoading: false,
          data: arrayOfComics,
        });
      })
      .then(() => {
        prefetchComics();
      });
  }

  switchComics = (index) => {
    this.setState({
      isLoading: true,
    });

    setIndex(index).then(() => {
      this.setState({
        isLoading: false,
      });
    });
  }

  _renderItem({ item, index }) {
    // console.log(item);
    const { src, title, afterComic } = item;
    return (
      <ComicView src={src} title={title} afterComic={afterComic} />
    );
  }

  render() {
    const { isLoading, data } = this.state;
    const index = getIndex();

    return (
      <View style={styles.container}>
        {isLoading && <Text>Loading</Text>}
        {!isLoading &&
            <Carousel
              ref={(c) => { this._carousel = c; }}
              data={data}
              renderItem={this._renderItem}
              sliderWidth={Dimensions.get('window').width}
              itemWidth={Dimensions.get('window').width - 50}
              layout="default"
              onSnapToItem={setIndex}
            />
        }
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
