import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState } from 'react';
import LoginView from './LoginView';
import MainView from './MainView';

import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLoggedInStatus } from './Database';

function logout(loggedIn) {
  loggedIn = false
}

export default function Index() {
  const [loggedIn, setLoggedIn] = useState(getLoggedInStatus());
 
  if (loggedIn) {
    return (
        <MainView></MainView>
    );
  }
  else {
    return (
      <LoginView></LoginView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
  }
});
