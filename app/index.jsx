import './gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState } from 'react';
import LoginView from './LoginView';
import MainView from './MainView';
import { getLoggedInStatus } from './Database';

function logout(loggedIn) {
  loggedIn = false
}

const Stack = createNativeStackNavigator()
const Navigator = Stack.Navigator;
const Screen = Stack.Screen;

export default function Index() {

  const [loggedIn, setLoggedIn] = useState(getLoggedInStatus());

  return (
        <Navigator screenOptions={{ headerShown: false }}>
          {loggedIn ? (
            <Screen name = "Main">
              {() => <MainView setLoggedIn={setLoggedIn}/>}
            </Screen>
            ) : (
            <Screen name="Login">
              {() => <LoginView setLoggedIn={setLoggedIn}/>}
            </Screen>
            )}
        </Navigator>
  )
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
  }
});
