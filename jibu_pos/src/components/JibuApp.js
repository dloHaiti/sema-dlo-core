import React, {Component} from "react";
import {
    StyleSheet,
    Text,
    View,
    ToolbarAndroid
} from 'react-native';

import Toolbar from './Toolbar';
import {Tab} from './Navigator'

export default class JibuApp extends Component {
    render() {
        return (

            <View style={{ flex: 1 }}>
                <Toolbar/>
				<Tab/>
             </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
