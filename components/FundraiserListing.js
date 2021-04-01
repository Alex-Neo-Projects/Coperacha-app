import React from 'react'
import { View, Text, ScrollView, Image, StyleSheet, Button } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

function FundraiserListing(props) {
  
  var title = props.projectData[0]['projectTitle'];
  var image = props.projectData[0]['projectImageLink'];
  var goal = props.projectData[0]['projectGoalAmount'];
  var description = props.projectData[0]['projectDescription'];
  var currentAmount = props.projectData[0]['currentAmount'];
  var fundRaisingDeadline = props.projectData[0]['fundRaisingDeadline'];
  
  var progress = currentAmount / goal;
  let imageURL ={ uri: image};
  
  return (
    <ScrollView>
      
      <Image source={imageURL} style={{height: 200, resizeMode : 'stretch', marginBottom:10}} />
      <View style={{margin: 10 }}>
        <Text style={styles.title}>{title}</Text>
        
        <Text style={styles.smallText, { fontWeight: 'bold'}}>${currentAmount} raised of ${goal} goal</Text>
        <ProgressBar progress={progress} width={400} color={'#35D07F'} style={{marginBottom:10}}/>
        
        <Text style={styles.regularText}>{description}{"\n"}</Text>

        <Text style={styles.title}>Donations</Text>
        <Text style={styles.regularText}>TODO{"\n"}</Text>
        
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