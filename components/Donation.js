import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native';

function Donation() {
  return (
    <View>
      <Text style={styles.bigText}>Thank you for donating! {"\n\n"}</Text>
      <Text style={styles.title}>100% of proceeds go directly to: {"\n\n"}</Text>
      <Text style={styles.title}>"Building a new road"</Text>
          
      <Image style={styles.Image} source={require("../assets/give.png")}></Image>
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
  }
});

export default Donation; 