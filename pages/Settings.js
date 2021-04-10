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
      <Text style={styles.headerInitial}> Settings </Text>
      {loggedIn ? ( 
        <View>
          <Text style={styles.headerStart}> Logged into </Text>
          <Text style={styles.headerEnd}>{address}</Text> 

          <Text style={styles.headerStartBal}> cUSD balance: </Text>
          <Text style={styles.headerEndBal}>{balance}</Text> 

          <LogOut handleLogOut={props.handleLogOut}/>
        </View>
      ) : (
        <View>
          <LogIn reason={"to view your settings"} handleLogIn={context.handleLogIn}/>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerInitial: { 
    fontSize: 25,
    color: '#2E3338',
    fontFamily: 'proximanova_bold',

    marginTop: 60,
    marginLeft: 10,
    marginBottom: 30,
  },
  headerStart: {
    marginLeft: 10,
    fontSize: 20,
    color: '#2E3338',
    fontFamily: 'proximanova_bold',
    marginBottom: 5
  },
  headerEnd: {
    marginLeft: 15,
    fontSize: 15,
    color: '#2E3338',
    fontFamily: 'proxima'
  },
  headerStartBal:{
    marginLeft: 10,
    fontSize: 20,
    color: '#2E3338',
    fontFamily: 'proximanova_bold',
    marginTop: 20,
    marginBottom: 5
  },
  headerEndBal:{
    marginLeft: 15,
    marginBottom: 40,
    fontSize: 15,
    color: '#2E3338',
    fontFamily: 'proxima'
  }
});

export default Settings;