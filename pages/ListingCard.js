import React from 'react';
import { View, Text, StyleSheet, Dimensions} from 'react-native';
import CachedImage from 'react-native-expo-cached-image';
import { useNavigation } from '@react-navigation/native';
import ProgressBar from 'react-native-progress/Bar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import normalize from 'react-native-normalize';

function ListingCard(props) {
  const navigation = useNavigation();
  
  var data = props.projectData; 

  //Data 
  var currentAmount = data.currentAmount / 1E18; // Gotta convert from bigNumber to regular integer; 
  var currentState = data.currentState;
  var totalRaised = data.projectTotalRaised / 1E18;
  var creatorName = data.projectCreatorName; 
  var fundraisingDeadline = data.fundRaisingDeadline; 
  var projectCreator = data.projectCreator.toString().substring(0, 16);
  var projectDescription = data.projectDescription.length > 115 ? data.projectDescription.substring(0, 115) + '...' : data.projectDescription;
  var projectGoalAmount = data.projectGoalAmount;
  var projectImageLink = data.projectImageLink;
  var projectTitle = data.projectTitle; 
  var currentProgress = totalRaised / projectGoalAmount; 

  const milliseconds = fundraisingDeadline * 1000; 
  const dateObject = new Date(milliseconds)

  var dateOutput = new Date(dateObject).toLocaleDateString();


  var status = '';
  
  if (currentState === '0') {
    status = "Fundraising"; 
  }
  else if (currentState === '1') {
    status = "Expired"; 
  }
  else {
    status = "Successful"; 
  }

  
  return (
    <View>
      {
        (currentState === '2' || currentState === '1') ? (
          <View style={styles.cardView}> 
            <CachedImage style={styles.cardImage} source={{uri: projectImageLink}} /> 
            <View style={styles.textView}>
              <Text style={styles.titleText}>{projectTitle} </Text>
              <Text style={styles.creatorInitialText}>Fundraiser created by <Text style={styles.creatorText}>{creatorName}</Text> </Text>
              <Text style={styles.projectDescriptionText}>{projectDescription} </Text>

              <Text style={styles.footerText}>Fundraising has been completed. </Text>
              <Text style={styles.footerTextFollow}>Thank you for your kind donations!</Text>
              <Text style={styles.footer}>⭐️⭐</Text>
            </View>
          </View> 
      ) : ( 
      <TouchableOpacity 
      onPress={() => navigation.navigate('FundraiserListing', {projectId: props.projectId, loggedIn: props.loggedIn, address: props.address, projectData: data, projectAddy:projectCreator, nav: navigation})}
      activeOpacity={0.9}
      // Tweak so cards don't get opaque on scroll
      delayPressIn={50}>   

      <View style={styles.cardView}> 
        <CachedImage style={styles.cardImage} source={{uri: projectImageLink}} /> 
        <View style={styles.textView}>
          <Text style={styles.titleText}>{projectTitle} </Text>
          <Text style={styles.creatorInitialText}>Fundraiser created by <Text style={styles.creatorText}>{creatorName}</Text> </Text>
          <Text style={styles.creatorInitialText}>Status: <Text style={styles.creatorText}>{status}</Text> </Text>
          <Text style={styles.projectDescriptionText}>{projectDescription} </Text>
          <Text style={styles.currentRaisedText}>${totalRaised} raised of ${projectGoalAmount} goal. </Text>

          <ProgressBar progress={currentProgress} color='#35D07F' width={normalize(330)} height={normalize(8)} style={styles.progress}/>
          
          {status === "Fundraising" ? (
            <Text style={styles.dateText}>Fundraising ends on {dateOutput} </Text>
          ) : (
            <Text style={styles.dateText}>Fundraising ended</Text>
          )}
          
        </View>
      </View>      
    </TouchableOpacity>)
      }
    </View>
   
  );
}

const styles = StyleSheet.create({ 
  cardView: {
    width : Dimensions.get('window').width - normalize(25),
    height : normalize(500),
    marginBottom : normalize(30),
    borderRadius : normalize(15),
    borderWidth: 1,
    overflow : 'hidden',
    backgroundColor : '#FFFFFF',
    borderColor: '#EDEEEF',
  }, 
  cardImage : {
      width : '100%',
      height : '50%',
  },
  textView : {
    flex : 1,
    alignItems : 'flex-start',
    justifyContent : 'flex-start',
    marginTop: normalize(6),
    marginLeft: normalize(7),
    marginRight: normalize(5)  
}, 
  titleText: {
    fontFamily: 'proximanova_bold',
    fontSize: 23, 
    color: '#2E3338',    
  },
  creatorInitialText: {
    fontFamily: 'proxima',
    fontSize: 15, 
    color: '#2E3338',
    marginTop: normalize(5),
    marginRight: normalize(5)  
  }, 
  creatorText: {
    fontFamily: 'proximanova_bold',
    fontSize: 14,
    color: '#2E3338',
  },
  projectDescriptionText: {
    fontFamily: 'proxima',
    fontSize: 16,
    color: '#2E3338',
    marginTop: normalize(15), 
    marginRight: normalize(6)
  },
  currentRaisedText: {
    fontFamily: 'proximanova_bold',
    fontSize: 16,
    color: '#2E3338',
    marginTop: normalize(20),
  },
  progress: {
    marginTop: normalize(7)
  },
  dateText: {
    fontFamily: 'proximanova_bold',
    fontSize: 15,
    color: '#2E3338',
    position: 'absolute', 
    bottom: normalize(10), 
    right: normalize(4)
  },
  footerText:{
    marginTop: normalize(25),
    fontFamily: 'proximanova_bold',
    fontSize: 20,
    color: '#2E3338',
  },
  footerTextFollow:{
    marginTop: normalize(5),
    fontFamily: 'proximanova_bold',
    fontSize: 18,
    color: '#2E3338'
  },
  footer:{
    marginTop: normalize(10)
  }
});

export default ListingCard;