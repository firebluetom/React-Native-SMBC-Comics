import React, { Component } from 'react';
import { Button, StyleSheet, Text, View, Image, ScrollView, WebView, Dimensions } from 'react-native';

export class ComicView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comicToShow: 0,
        }

        this.toggleComic.bind(this);
    }

    toggleComic = () => {
        this.setState({
            comicToShow: (this.state.comicToShow + 1) % 2,
        });
    }

    render() {
        const { src, title, afterComic } = this.props;
        const { comicToShow } = this.state;

        const contents = `
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <body>
                    <h5>${title}</h5>
                    <img src="${comicToShow ? afterComic : src}" style="width: 100%;" />
                </body>
            </html>
        `;

        return (
            <View style={styles.webViewContainer}>
                <WebView
                    source={{ html: contents }}
                    scalesPageToFit={true}
                />
                <Button
                    onPress={this.toggleComic}
                    title="Toggle"
                    style={styles.button}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    webViewContainer: {
        flexGrow: 1,
        width: '90%',
        flex: 1,
        marginLeft: '5%',
        marginRight: '5%'
    },
    button: {
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#fff',
    }
});
