import React from 'react'
import { View, Text, ScrollView, Image, StyleSheet, Button } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

function FundraiserListing() {
  let imageURL ={ uri: "https://i.imgur.com/elTnbFf.png"};
  return (
    <ScrollView>
      
      <Image source={imageURL} style={{height: 200, resizeMode : 'stretch', marginBottom:10}} />
      <View style={{margin: 10 }}>
        <Text style={styles.title}>Building a new road</Text>
        
        <Text style={styles.smallText, { fontWeight: 'bold'}}>$450 raised of $900 goal</Text>
        <ProgressBar progress={0.5} width={400} color={'#35D07F'} style={{marginBottom:10}}/>
        
        <Text style={styles.regularText}>We need a new road to connect the two sides of 
        town. We are asking for $900 cUSD in order to build this road. {"\n"}</Text>

        <Text style={styles.title}>Donations</Text>
        <Text style={styles.regularText}>0x0000 donated $10{"\n"}</Text>
        <Text style={styles.regularText}>0x0000 donated $20{"\n"}</Text>
        <Text style={styles.regularText}>0x0000 donated $30{"\n"}</Text>
        <Text style={styles.regularText}>0x0000 donated $40{"\n"}</Text>

        
        <Button title={"Donate"}></Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginVertical: 8, 
    fontSize: 30, 
    fontWeight: 'bold'
  },
  regularText: {
    fontSize: 18, 
  },
  smallText: {
    fontSize: 15, 
  },
});

export default FundraiserListing;