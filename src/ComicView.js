import React from 'react';
import { Button, StyleSheet, Text, View, Image, ScrollView, WebView, Dimensions } from 'react-native';

export const ComicView = ({src, title, afterComic}) => {
    const contents = `
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>
                <h5>${title}</h5>
                <img src="${src}" style="width: 100%;" />
            </body>
        </html>
    `;
    
    return (
        <View style={styles.webViewContainer}>
            <WebView
                source={{ html: contents }}
                scalesPageToFit={true}
            />
        </View>
    )

}

const styles = StyleSheet.create({
    webViewContainer: {
        flexGrow: 1,
        width: '90%',
        flex: 1,
        marginLeft: '5%',
        marginRight: '5%'
    }
});
