import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native';

function LogOut(props) {
  
  // Passed from App.js since it needs to modify the loggedIn state in App.js 
  logOut = () => {
    props.handleLogOut()
  }

  return(
    <View>
      <Text style={styles.title}>Log out</Text>
      <Button title="Log Out" 
        onPress={()=> logOut()} />
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
