import React from 'react'
import { View, Text, StyleSheet } from 'react-native';
import LogOut from '../components/LogOut'; 
import LogIn from '../components/LogOut'; 

function Settings(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.bigText}>Settings{"\n"}</Text>
      {props.loggedIn ? ( 
        <View>
          <LogOut handleLogOut={props.handleLogOut}/>
        </View>
      ) : (
        <View>
          <LogIn reason={"to view your settings"} handleLogIn={props.handleLogIn}/>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginVertical: 30, 
    fontSize: 20, 
    fontWeight: 'bold'
  },
  bigText: { 
    paddingTop: 40,
    fontSize: 35, 
    fontWeight: 'bold'
  },
  Image: {
    flex: 1,
    width: 250,
    height: 250,
    marginLeft: 50,
    resizeMode: 'contain'
  },
});

export default Settings;