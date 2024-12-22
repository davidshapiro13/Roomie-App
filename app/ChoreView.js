import { StyleSheet, Text, View, Button } from 'react-native';

export default function GoalView() {
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