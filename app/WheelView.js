import { StyleSheet, Text, View, Button } from 'react-native';

export default function WheelView() {
    return (
        <View style={styles.container}>
            <Text>Wheel</Text>
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