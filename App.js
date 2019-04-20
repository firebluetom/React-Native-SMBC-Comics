import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, Image, ScrollView, WebView, Dimensions } from 'react-native';
import { ComicView } from './src/ComicView';
import FullWidthImage from 'react-native-fullwidth-image'
// import { WebView } from 'react-native-webview';

const HTMLParser = require('fast-html-parser');

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      title: null,
      src: null,
      afterComic: null,
      prev: null,
      data: []
    };
    this.prefetch.bind(this);
  }

  getImageDetailsAtUrl(url) {
    return fetch(url, { cache: "force-cache" })
      .then((response) => response.text())
      .then((response) => {
        var root = HTMLParser.parse(response);

        let prev, next, afterComic;
        const { src, title } = root.querySelector('#cc-comic').attributes;
        const previousButton = root.querySelector('.cc-prev');
        const nextButton = root.querySelector('.cc-next');
        const afterComicImg = root.querySelector('#aftercomic img');

        if (previousButton) {
          ({ href: prev } = root.querySelector('.cc-prev').attributes);
        }
        if (nextButton) {
          ({ href: next } = root.querySelector('.cc-next').attributes);
        }
        if (afterComicImg) {
          ({ src: afterComic } = afterComicImg.attributes);
        }

        return {
          title,
          src,
          prev,
          next,
          afterComic,
        };

      })
      .catch((error) => {
        console.error(error);
      });
  }

  updateComponent = (props) => {
    const { data } = this.state;
    data.push(props);
    this.setState({
      isLoading: false,
      data,
      ...props,
    });
  }

  componentDidMount() {
    this.switchComics('https://www.smbc-comics.com');
  }

  prefetch = () => {
    const { prev, next } = this.state;
    if (prev) {
      this.getImageDetailsAtUrl(prev)
        .then(({ src }) => Image.prefetch(src));
    }
    if (next) {
      this.getImageDetailsAtUrl(next)
        .then(({ src }) => Image.prefetch(src));
    }
  }

  switchComics = (url) => {
    this.setState({
      isLoading: true,
    });

    this.getImageDetailsAtUrl(url)
      .then(this.updateComponent)
      .then(this.prefetch);
  }

  render() {
    const { isLoading, src, title, next, prev, afterComic } = this.state;

    return (
      <View style={styles.container}>
        {isLoading && <Text>Loading</Text>}
        {!isLoading &&
          <View style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
            <ComicView src={src} title={title} afterComic={afterComic} />
            <View style={styles.buttonContainer}>
              {prev && <View style={styles.button}>
                <Button
                  onPress={() => { this.switchComics(prev) }}
                  title="<"
                  color="orange"
                  accessibilityLabel="Back"
                />
              </View>
              }
              {next && <View style={styles.button}>
                <Button
                  onPress={() => { this.switchComics(next) }}
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
    
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0
  },
  button: {
    borderStyle: 'solid',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d6d7da',
    flex: 1,
  },
});
