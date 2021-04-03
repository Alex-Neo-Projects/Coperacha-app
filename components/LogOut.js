import React from 'react'
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

function LogOut(props) {
  const logOutAlert = () =>
    Alert.alert(
      "Log out?",
      " ",
      [
        {
          text: "Cancel",
          onPress: () => console.log("LogOut cancel pressed"),
          style: "cancel"
        },
        { text: "Log Out", onPress: () => logOut() }
      ]
    );
  // Passed from App.js since it needs to modify the loggedIn state in App.js 
  logOut = () => {
    props.handleLogOut()
  }

  return(
    <View>
      <Text style={styles.title}>Log out</Text>
      <Button title="Log Out" 
        onPress={()=> logOutAlert()} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginVertical: 8, 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center'
  }
});

export default LogOut;
