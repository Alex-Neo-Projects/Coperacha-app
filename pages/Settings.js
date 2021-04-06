import React, { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native';
import LogOut from '../components/LogOut'; 
import LogIn from '../components/LogOut'; 
import AppContext from '../components/AppContext';  

function Settings(props) {
  const context = useContext(AppContext);
  const loggedIn = context.loggedIn; 
  const address = context.address; 
  const balance = context.balance; 
  
  console.log(balance);
  return (
    <View style={styles.container}>
      <Text style={styles.bigText}>Settings{"\n"}</Text>
      {loggedIn ? ( 
        <View>
          <Text style={styles.title}>Logged into: {address} {"\n\n"}</Text>
          <Text style={styles.title}>cUSD balance: {balance} {"\n\n"}</Text>

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
    fontSize: 14, 
    // fontWeight: 'bold'
  },
  bigText: { 
    paddingTop: 40,
    fontSize: 35, 
    fontWeight: 'bold'
  },
});

export default Settings;