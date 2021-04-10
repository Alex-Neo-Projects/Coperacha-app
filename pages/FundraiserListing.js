import React from 'react'
import { View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import CachedImage from 'react-native-expo-cached-image';
import { Button } from 'react-native-elements';

function FundraiserListing(props) {
  var navigation = props.route.params.nav;
  
  var projectId = props.route.params.projectId;
  var loggedIn = props.route.params.loggedIn; 
  var address = props.route.params.address; 
  
  var data = props.route.params.projectData;
  var title = data['projectTitle'];
  var creatorAddy = data['projectCreator'];
  creatorAddy = creatorAddy.toString().substring(0,20);
  var image = data['projectImageLink'];
  var goal = data['projectGoalAmount'];
  var description = data['projectDescription'];
  var currentAmount = data['currentAmount'] / 1E18; // Gotta convert from bigNumber to regular integer
  var fundRaisingDeadline = data['fundRaisingDeadline'];
  
  var progress = currentAmount / goal;
  let imageURL ={ uri: image};
  
  return (
    <ScrollView style={styles.sview}>
      <View style={styles.fill}>
        <CachedImage source={imageURL} style={styles.image} />
      </View>

      <View style={styles.viewStyle}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.creatorInitialText}>⭐️ Created by <Text style={styles.creatorText}>{creatorAddy}...</Text> </Text>


        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.description}>{description}</Text>


        <Text style={styles.amountRaisedText}>${currentAmount.toString()} raised of ${goal} goal.</Text>
        <ProgressBar progress={progress} color='#35D07F' width={350} height={8} style={styles.progress}/>
        
        
        <Button title={"Donate Now"} 
          buttonStyle={styles.createFundraiserButton} 
          titleStyle={styles.fundraiserTextStyle} 
          type="solid"  
          onPress={() => navigation.navigate('DonationForm', {projectId: projectId, loggedIn: loggedIn, address: address, title: title, creatorAddress: creatorAddy, nav: navigation})}/>
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sview:{
    backgroundColor: '#FFFFFF',
  },
  image:{
    height: 250, 
    // borderRadius : 15,
    borderColor: '#DDDDDD',
    resizeMode : 'cover', 
    marginBottom: 5
  },
  divider:{
    borderBottomColor: '#ABADAF',
    borderBottomWidth: 1,
  },
  creatorInitialText: {
    fontFamily: 'proxima',
    fontSize: 16, 
    color: '#2E3338',
    marginTop: 5
  }, 
  creatorText: {
    fontFamily: 'proximanova_bold',
    fontSize: 16,
    color: '#2E3338',
  },
  viewStyle: {
    marginLeft: 10,
    marginTop: 5,
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
    marginTop: 30
  },
  amountRaisedText:{
    fontFamily: 'proximanova_bold',
    fontSize: 18,
    color: '#2E3338',
    marginBottom: 5
  },
  description: {
    fontFamily: 'proxima',
    fontSize: 19,
    color: '#2E3338',
    marginTop: 5,
    marginRight: 10,
    marginBottom: 30
  },
  createFundraiserButton: {
    marginTop: 40,
    height: 40,
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