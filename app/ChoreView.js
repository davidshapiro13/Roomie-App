import { StyleSheet, Text, View } from 'react-native';
import React, {useState} from 'react';


export default function GoalView() {
    const [isSelected, setSelected] = useState(true)

    return (
        <View style={styles.container}>
            <Text>Chore</Text>
            
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