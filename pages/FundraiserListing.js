import React from 'react'
import { View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import CachedImage from 'react-native-expo-cached-image';
import { Button } from 'react-native-elements';
import normalize from 'react-native-normalize';

function FundraiserListing(props) {
  var navigation = props.route.params.nav;
  
  var projectId = props.route.params.projectId;
  var loggedIn = props.route.params.loggedIn; 
  var address = props.route.params.address; 
  
  var data = props.route.params.projectData;
  var title = data['projectTitle'];
  var creatorName = data['projectCreatorName'];
  var image = data['projectImageLink'];
  var goal = data['projectGoalAmount'];
  var description = data['projectDescription'];
  var currentAmount = data['currentAmount'] / 1E18; // Gotta convert from bigNumber to regular integer
  var fundRaisingDeadline = data['fundRaisingDeadline'];
  
  var progress = currentAmount / goal;
  let imageURL = {uri: image};
  
  return (
    <ScrollView style={styles.scrollViewContainer}>
      <CachedImage source={imageURL} style={styles.image} />

      <View style={styles.viewStyle}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.creatorInitialText}>⭐️ Created by <Text style={styles.creatorText}>{creatorName}</Text> </Text>


        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{description}</Text>


        <Text style={styles.amountRaisedText}>${currentAmount.toString()} raised of ${goal} goal.</Text>
        <ProgressBar progress={progress} color='#35D07F' width={350} height={8} style={styles.progress}/>        
        
        <Button title={"Donate Now"} 
          buttonStyle={styles.createFundraiserButton} 
          titleStyle={styles.fundraiserTextStyle} 
          type="solid"  
          onPress={() => navigation.navigate('DonationForm', {projectId: projectId, loggedIn: loggedIn, address: address, creatorName: creatorName, title: title, nav: navigation})}/>
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer:{
    backgroundColor: '#FFFFFF',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  viewStyle: {
    marginLeft: normalize(10),
    marginTop: normalize(5),
  },
  image:{
    height: normalize(250), 
    width: '100%',
    borderColor: '#DDDDDD',
    resizeMode : 'cover', 
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: normalize(5)
  },
  divider:{
    borderBottomColor: '#ABADAF',
    borderBottomWidth: 1,
  },
  creatorInitialText: {
    fontFamily: 'proxima',
    fontSize: 16, 
    color: '#2E3338',
    marginTop: normalize(5)
  }, 
  creatorText: {
    fontFamily: 'proximanova_bold',
    fontSize: 16,
    color: '#2E3338',
  },
  title: {
    fontFamily: 'proximanova_bold',
    fontSize: 30, 
    color: '#2E3338', 
    marginTop: 5
  },
  descriptionTitle:{
    fontFamily: 'proximanova_bold',
    fontSize: 19,
    color: '#2E3338',
    marginTop: normalize(30)
  },
  amountRaisedText:{
    fontFamily: 'proximanova_bold',
    fontSize: 18,
    color: '#2E3338',
    marginBottom: normalize(5)
  },
  description: {
    fontFamily: 'proxima',
    fontSize: 19,
    color: '#2E3338',
    marginTop: normalize(5),
    marginRight: normalize(10),
    marginBottom: normalize(30)
  },
  createFundraiserButton: {
    marginTop: normalize(40),
    height: normalize(40),
    width: Dimensions.get('window').width - 20,
    backgroundColor: "#35D07F"
  }, 
  fundraiserTextStyle: {
    fontFamily: 'proximanova_bold',
    fontSize: 18, 
    color: '#FFFFFF'
  }
});

export default FundraiserListing;