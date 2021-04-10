import React from 'react'
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';

function DonationReceipt(props) {
  const navigation = props.route.params.nav;
  
  // var title = props.route.params.title;
  var creatorAddy = props.route.params.creatorAddy;

  return (
    <View style={styles.container}>
      <Text style={styles.bigText}>Thank you for donating 🙌</Text>

      <Text style={styles.titleInitial}>All proceeds will go directly to </Text>
      <Text style={styles.titleFollow}>{creatorAddy}...</Text>

      <Image style={styles.Image} source={require("../assets/give.png")}></Image>

      <Button title={"Done"} 
            buttonStyle={styles.createFundraiserButton} 
            titleStyle={styles.fundraiserTextStyle} 
            type="solid"  
            onPress={() => navigation.pop()}/>
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
    marginTop: 90,
    fontSize: 28,
    color: '#2E3338',
    fontFamily: 'proximanova_bold',
    marginBottom: 40
  },
  titleInitial: {
    fontFamily: 'proxima',
    fontSize: 20, 
    color: '#2E3338',
    marginBottom: 15
  },
  titleFollow:{
    fontFamily: 'proximanova_bold',
    fontSize: 24, 
    color: '#35D07F',  
  },
  Image: {
    width: 250,
    height: 250,
    resizeMode: 'contain'
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

export default DonationReceipt; 