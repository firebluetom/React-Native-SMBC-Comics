import React, { PureComponent } from 'react';
import { StyleSheet, View, WebView } from 'react-native';
import { Button } from 'react-native-elements';

export class ComicView extends PureComponent {
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
        const { src, title, afterComic, hoverText } = this.props;
        const { comicToShow } = this.state;

        const contents = `
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                </head>
                <body>
                    <h5>${title}</h5>
                    <img src="${comicToShow ? afterComic : src}" style="width: 100%;" />
                    <h6>${hoverText}</h6>
                </body>
            </html>
        `;

        return (
            <View style={styles.webViewContainer}>
                <WebView
                    style={styles.webview}
                    source={{ html: contents }}
                    scalesPageToFit={true}
                />
                <Button
                    onPress={this.toggleComic}
                    title="Toggle"
                    buttonStyle={styles.button}

                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    webViewContainer: {
        flexGrow: 1,
        flex: 1,
    },
    webview: {
        
    },
    button: {
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'red',
        backgroundColor: 'red',
        width: '100%',
        height: 50,
    }
});
