import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import React from 'react';
import HomeView from './HomeView';
import GoalView from './GoalView';
import ChoreView from './ChoreView';
import WheelView from './WheelView';
import { styles } from './Styles';

export default function MainView( { roomID, setRoomID } ) {

    const Tab = createBottomTabNavigator();

    return (
        <Tab.Navigator >
                <Tab.Screen name="Home">
                    {() => <HomeView roomID={roomID} setRoomID={setRoomID}/>}
                </Tab.Screen>
                <Tab.Screen name="Chores" component={ChoreView}/>
                <Tab.Screen name="Goals">
                    { () => <GoalView roomID={roomID}/>}
                </Tab.Screen>
                <Tab.Screen name="Wheel" component={WheelView}/>
        </Tab.Navigator>
    )
}