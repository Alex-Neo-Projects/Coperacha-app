import React from 'react'
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function DonationReceipt() {
  const navigation = useNavigation();
  return (
    <View>
      <Text style={styles.bigText}>Thank you for donating! {"\n\n"}</Text>
      <Text style={styles.title}>100% of proceeds go directly to: {"\n\n"}</Text>
      <Text style={styles.title}>"Building a new road"</Text>
          
      <Image style={styles.Image} source={require("../assets/give.png")}></Image>

      <Button title={"Home"}
          onPress={() => navigation.navigate('Home')}></Button>
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
    resizeMode: 'contain'
  }
});

export default DonationReceipt; 