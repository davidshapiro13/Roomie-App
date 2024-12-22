import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View, Text } from 'react-native';
import React, { useState } from 'react';
import LoginView from './app/LoginView';
import MainView from './app/MainView';
import { getLoggedInStatus } from './app/Database';
import { NavigationContainer } from '@react-navigation/native';

function logout(loggedIn) {
  loggedIn = false
}

const Stack = createNativeStackNavigator()
const Navigator = Stack.Navigator;
const Screen = Stack.Screen;

export default function App() {

  const [loggedIn, setLoggedIn] = useState(getLoggedInStatus());

  return (
    <NavigationContainer>
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
    </NavigationContainer>
  )
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
  }
});
