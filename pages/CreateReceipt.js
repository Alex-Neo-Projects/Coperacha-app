import React from 'react'
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function CreateReceipt() {
  const navigation = useNavigation();
  return (
    <View>
      <Text style={styles.bigText}>Congratulations! {"\n\n"}</Text>
          
      <Image style={styles.Image} source={require("../assets/nonprofit.png")}></Image>
      <Text style={styles.title}>Your fundraiser is now live on Coperacha {"\n\n"}</Text>

      <Button title={"Home"}
          onPress={() => navigation.navigate('Create')} />
    </View>
  );
}

const styles = StyleSheet.create({
  bigText: { 
    paddingTop: 80,
    fontSize: 35, 
    textAlign: 'center', 
    fontWeight: 'bold'
  },
  title: {
    fontSize: 20, 
    textAlign: 'center', 
  },
  Image: {
    // flex: 1,
    width: 250,
    height: 250,
    marginLeft: 50,
    resizeMode: 'contain',
    marginBottom: 40
  }
});

export default CreateReceipt; 