import React from 'react'
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function DonationReceipt(props) {
  const navigation = props.route.params.nav;
  
  var title = props.route.params.title;

  return (
    <View>
      <Text style={styles.bigText}>Thank you for donating! {"\n\n"}</Text>
      <Text style={styles.title}>100% of proceeds go directly to: {"\n\n"}</Text>
      <Text style={styles.title}>"{title}"</Text>
          
      <Image style={styles.Image} source={require("../assets/give.png")}></Image>

      <Button title={"Done"}
          onPress={() => navigation.replace('Home')}></Button>
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