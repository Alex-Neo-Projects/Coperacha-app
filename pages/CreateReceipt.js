import React from 'react'
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

function CreateReceipt() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image style={styles.Image} source={require("../assets/nonprofit.png")}></Image>
      <Text style={styles.bigText}>Congratulations!</Text>

      <Text style={styles.title}>Your fundraiser is now live on Coperacha! ✨</Text>
      
      <Button title={"Done"} 
            buttonStyle={styles.createFundraiserButton} 
            titleStyle={styles.fundraiserTextStyle} 
            type="solid"  
            onPress={() => navigation.replace('Create')}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigText: { 
    marginTop: 30,
    fontSize: 30,
    color: '#2E3338',
    fontFamily: 'proximanova_bold',
    marginBottom: 40
  },
  title: {
    fontFamily: 'proxima',
    fontSize: 16, 
    color: '#2E3338',
  },
  Image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
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

export default CreateReceipt; 