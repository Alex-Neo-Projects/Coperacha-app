import React from 'react'
import { View, Text, Dimensions, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';

function LogOut(props) {
  const navigation = useNavigation();
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
    props.handleLogOut();
    navigation.navigate('Manage')
  }

  return(
    <View>
      <Button title={"Log Out"} 
      buttonStyle={styles.createFundraiserButton} 
      titleStyle={styles.fundraiserTextStyle} 
      type="solid"  
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
  },
  createFundraiserButton: {
    marginLeft: 10,
    marginTop: 20,
    height: 40,
    width: Dimensions.get('window').width - 20,
    backgroundColor: "#35D07F"
  }, 
  fundraiserTextStyle: {
    fontFamily: 'proximanova_bold',
    fontSize: 18, 
    color: '#FFFFFF'
  },
});

export default LogOut;
