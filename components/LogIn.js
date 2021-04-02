import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native';

function LogIn(props) {
  
  console.log(props);
  // Passed from App.js since it needs to modify the loggedIn state in App.js    
  logInToCelo = () => {
    console.log("clicked")
    props.handleLogIn()
  }


  return(
    <View>
      <Text style={styles.title}>Login {props.reason}</Text>

      <Button title="Login"
       onPress={()=> logInToCelo()} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginVertical: 8, 
    fontSize: 20, 
    fontWeight: 'bold'
  }
});

export default LogIn;
