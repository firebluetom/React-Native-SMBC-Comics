import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import FullWidthImage from 'react-native-fullwidth-image'

var DomParser = require('react-native-html-parser').DOMParser
var HTMLParser = require('fast-html-parser');

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      title: null,
      src: null,
      prev: null,
    };
    this.prefetch.bind(this);
  }

  getImageDetailsAtUrl(url) {
    return fetch(url, { cache: "force-cache" })
      .then((response) => response.text())
      .then((response) => {
        var root = HTMLParser.parse(response);

        let prev, next;
        const { src, title } = root.querySelector('#cc-comic').attributes;
        const previousButton = root.querySelector('.cc-prev');
        const nextButton = root.querySelector('.cc-next');

        if (previousButton) {
          ({ href: prev } = root.querySelector('.cc-prev').attributes);
        }
        if (nextButton) {
          ({ href: next } = root.querySelector('.cc-next').attributes);
        }

        return {
          title,
          src,
          prev,
          next,
        };

      })
      .catch((error) => {
        console.error(error);
      });
  }

  updateComponent = ({ title, src, prev, next }) => {
    this.setState({
      isLoading: false,
      title,
      src,
      prev,
      next,
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
    const { isLoading, src, title, next, prev } = this.state;
    return (
      <View style={styles.container}>
        {isLoading && <Text>Loading</Text>}
        {!isLoading &&
          <ScrollView
            bouncesZoom={true}
            maximumZoomScale={2.0}
            pinchGestureEnabled={true}
          >
            <Text style={{ fontSize: 16 }}>{title}</Text>
            <FullWidthImage
              source={{ uri: src }}
            />
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
          </ScrollView>
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
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    borderStyle: 'solid',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d6d7da',
    flex: 1,
  }
});
