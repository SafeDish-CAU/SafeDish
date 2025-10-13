/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';


import {
  NativeModules,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  Button,
  View,
  Alert,
} from 'react-native';

const{AppUtil} = NativeModules;

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


const App: () => Node = () => {
  const toBackground = () => {
    AppUtil.toBack();
  };
  return (
    <View style = {styles.container}>
        <Text style = {styles.title}>
        Hello World!
        </Text>
        <Button
            style={styles.mainButton}
            title = "to Background"
            onPress ={toBackground} />

    </View>
  );
};


const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center"
  },
  title:{
    fontSize: 30,
    color:"white"
  },
  mainButton:{
    textAlign: "center",
    fontSize: 30,
    color: "white"
  },
});

export default App;