import { StyleSheet, Text, View, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import HomeView from './HomeView';
import GoalView from './GoalView';
import ChoreView from './ChoreView';
import WheelView from './WheelView';

export default function MainView( { setLoggedIn } ) {

    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator >
                <Tab.Screen name="Home">
                    {() => <HomeView setLoggedIn={setLoggedIn}/>}
                </Tab.Screen>
                <Tab.Screen name="Chores" component={ChoreView}/>
                <Tab.Screen name="Goals" component={GoalView}/>
                <Tab.Screen name="Wheel" component={WheelView}/>
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
  });