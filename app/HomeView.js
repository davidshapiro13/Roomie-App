import { StyleSheet, Text, View, Button } from 'react-native';
import { setLoginStatus } from './Database'

export default function HomeView( { setLoggedIn } ) {
    return (
        <View style={styles.container}>
            <Text>Home</Text>
            <Button title="Log Out" onPress={() => {
                setLoggedIn(false)
            }
                }></Button>
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