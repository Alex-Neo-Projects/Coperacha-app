import React, { useContext } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LogOut from '../components/LogOut'; 
import LogIn from '../components/LogOut'; 
import AppContext from '../components/AppContext';  
import normalize from 'react-native-normalize';

function Settings(props) {
  const context = useContext(AppContext);
  const loggedIn = context.loggedIn; 
  const address = context.address; 
  const balance = parseFloat(context.balance).toFixed(2); 
  
  console.log(balance);
  return (
    <View style={styles.container}>
      <Text style={styles.headerInitial}> Settings ⚙️</Text>
      {loggedIn ? ( 
        <View>
          <Text style={styles.headerStart}> Logged into </Text>
          <Text style={styles.headerEnd}>{address}</Text> 

          <Text style={styles.headerStartBal}> cUSD balance: </Text>
          <Text style={styles.headerEndBal}>${balance}</Text> 

          <LogOut handleLogOut={props.handleLogOut}/>
        </View>
      ) : (
        <View style={styles.centerLogin}>
          <LogIn reason={"View your settings!"} handleLogIn={context.handleLogIn}/>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: '#ffffff',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  headerInitial: { 
    fontSize: 25,
    color: '#2E3338',
    fontFamily: 'proximanova_bold',
    marginTop: Platform.OS === 'ios' ? normalize(60): normalize(20),
    marginLeft: normalize(10),
    marginRight: normalize(10),
    marginBottom: normalize(30),
  },
  headerStart: {
    fontSize: 20,
    color: '#2E3338',
    fontFamily: 'proximanova_bold',
    marginLeft: normalize(10),
    marginBottom: normalize(5)
  },
  headerEnd: {
    fontSize: 15,
    color: '#2E3338',
    fontFamily: 'proxima',
    marginLeft: normalize(15),
  },
  headerStartBal:{
    fontSize: 20,
    color: '#2E3338',
    fontFamily: 'proximanova_bold',
    marginLeft: normalize(10),
    marginTop: normalize(20),
    marginBottom: normalize(5)
  },
  headerEndBal:{
    fontSize: 15,
    color: '#2E3338',
    fontFamily: 'proxima',
    marginLeft: normalize(15),
    marginBottom: normalize(40),
  },
  centerLogin: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Settings;