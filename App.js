import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, Image, ScrollView, WebView, Dimensions } from 'react-native';
import { ComicView } from './src/ComicView';
import { arrayOfComics, getInitialData, prefetchComics, getIndex, setIndex } from './src/dataStore';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      data: []
    };
  }

  componentDidMount() {
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

  render() {
    const { isLoading, next, prev, data } = this.state;
    let src, title, afterComic;
    const index = getIndex();

    if (data[index]) {
       ({ src, title, afterComic } = data[index]);
    }

    return (
      <View style={styles.container}>
        {isLoading && <Text>Loading</Text>}
        {!isLoading &&
          <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>

            <ComicView src={src} title={title} afterComic={afterComic} />
          
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button
                  onPress={() => { this.switchComics(index + 1) }}
                  title="<"
                  color="orange"
                  accessibilityLabel="Back"
                />
              </View>
              
              {index > 0 && <View style={styles.button}>
                <Button
                  onPress={() => { this.switchComics(index - 1) }}
                  title=">"
                  color="orange"
                  accessibilityLabel="Forward"
                />
              </View>
              }
            </View>
          </View>
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
