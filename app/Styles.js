import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    //General
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        borderWidth: 1,
        width: 200,
        marginTop: 5,
        padding: 5
    },
    error: {
        color: 'red'
    },

    //Goal Item
    checkboxContainer: {
        flexDirection: 'row',
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 50,
        marginBottom: 20,
        width: '100%',
    },
    checkbox: {
          paddingHorizontal: 20,
    },

    //Goal View
    item: {
        padding: 10,
        justifyContent: "center",
        fontSize: 18,
        height: 44,
      },
    list: {
        flex: 1
    },
    pieContainer: {
        alignItems: 'center',
        justifyContent: 'center',
      },
  });