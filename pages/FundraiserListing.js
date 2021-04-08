import React from 'react'
import { View, Text, ScrollView, Image, StyleSheet, Button, Icon } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { useNavigation } from '@react-navigation/native';
import CachedImage from 'react-native-expo-cached-image';

function FundraiserListing(props) {
  var navigation = props.route.params.nav;
  
  var projectId = props.route.params.projectId;
  var loggedIn = props.route.params.loggedIn; 
  var address = props.route.params.address; 
  
  var data = props.route.params.projectData;
  var title = data['projectTitle'];
  var image = data['projectImageLink'];
  var goal = data['projectGoalAmount'];
  var description = data['projectDescription'];
  var currentAmount = data['currentAmount'] / 1E18; // Gotta convert from bigNumber to regular integer
  var fundRaisingDeadline = data['fundRaisingDeadline'];
  
  var progress = currentAmount / goal;
  let imageURL ={ uri: image};
  
  return (
    <ScrollView>
      <CachedImage source={imageURL} style={{height: 250, resizeMode : 'cover', marginBottom:10}} />

      <Button title="Back" onPress={()=>{navigation.goBack()}} />

      <View style={{margin: 10}}>
        <Text style={styles.title}>{title}</Text>
        
        <Text style={styles.smallText, { fontWeight: 'bold'}}>${currentAmount.toString()} raised of ${goal} goal</Text>
        <ProgressBar progress={progress} width={400} color={'#35D07F'} style={{marginBottom:10}}/>
        
        <Text style={styles.regularText}>{description}{"\n"}</Text>
        
        <Button title={"Donate"}
          onPress={() => navigation.navigate('DonationForm', {projectId: projectId, loggedIn: loggedIn, address: address, title: title, nav: navigation})}></Button>
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