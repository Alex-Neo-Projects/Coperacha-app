import React, {useContext} from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import AppContext from './AppContext';

function LogIn(props) {
  const appContext = useContext(AppContext);

  // Passed from App.js since it needs to modify the loggedIn state in App.js    
  logInToCelo = () => {
    console.log("Log in clicked")
  
    appContext.handleLogIn()
  }

  return(
    <View style={styles.container}>
      <Text style={styles.title}>{props.reason}</Text>

      <Button title={"Login"} 
            buttonStyle={styles.createFundraiserButton} 
            titleStyle={styles.fundraiserTextStyle} 
            type="solid"  
            onPress={()=> logInToCelo()}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    color: '#2E3338',
    fontFamily: 'proximanova_bold',
  },
  createFundraiserButton: {
    marginTop: 40,
    height: 40,
    width: Dimensions.get('window').width - 100,
    backgroundColor: "#35D07F"
  }, 
  fundraiserTextStyle: {
    fontFamily: 'proximanova_bold',
    fontSize: 18, 
    color: '#FFFFFF'
  }
});

export default LogIn;
