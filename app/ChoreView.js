import { StyleSheet, Text, View, Button, CheckBox } from 'react-native';
import React, {useState} from 'react';
import GoalItem from './GoalItem';

export default function GoalView() {
    const [isSelected, setSelected] = useState(true)

    return (
        <View style={styles.container}>
            <Text>Goal</Text>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
  });