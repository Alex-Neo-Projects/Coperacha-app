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

  var currentState = '';
  
  if (data.currentState === '0') {
    currentState = "Fundraising"; 
  }
  else if (data.currentState === '1') {
    currentState = "Expired"; 
  }
  else {
    currentState = "Successful"; 
  }

  //Data 
  var currentAmount = data.currentAmount / 1E18; // Gotta convert from bigNumber to regular integer; 
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
  
  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('FundraiserListing', {projectId: props.projectId, loggedIn: props.loggedIn, address: props.address, projectData: data, projectAddy:projectCreator, nav: navigation})}
      activeOpacity={1}
      // Tweak so cards don't get opaque on scroll
      delayPressIn={50}>   

      <View style={styles.cardView}> 
        <CachedImage style={styles.cardImage} source={{uri: projectImageLink}} /> 
        <View style={styles.textView}>
          <Text style={styles.titleText}>{projectTitle} </Text>
          <Text style={styles.creatorInitialText}>Fundraiser created by <Text style={styles.creatorText}>{creatorName}</Text> </Text>
          <Text style={styles.creatorInitialText}>Status: <Text style={styles.creatorText}>{currentState}</Text> </Text>
          <Text style={styles.projectDescriptionText}>{projectDescription} </Text>
          <Text style={styles.currentRaisedText}>${totalRaised} raised of ${projectGoalAmount} goal. </Text>

          <ProgressBar progress={currentProgress} color='#35D07F' width={normalize(330)} height={normalize(8)} style={styles.progress}/>
          
          {currentState === "Fundraising" ? (
            <Text style={styles.dateText}>Fundraising ends on {dateOutput} </Text>
          ) : (
            <Text style={styles.dateText}>Fundraising ended</Text>
          )}
          
        </View>
      </View>      
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({ 
  cardView: {
    width : Dimensions.get('window').width - 25,
    height : normalize(440),
    marginBottom : normalize(30),
    borderRadius : normalize(15),
    borderWidth: 1,
    overflow : 'hidden',
    backgroundColor : '#FFFFFF',
    borderColor: '#EDEEEF',
  }, 
  cardImage : {
      width : '100%',
      height : '55%',
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
    fontSize: 15,
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
});

export default ListingCard;