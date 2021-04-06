import React from 'react';
import { View, Button, Text, StyleSheet, Dimensions, Pressablem} from 'react-native';
import CachedImage from 'react-native-expo-cached-image';
import { useNavigation } from '@react-navigation/native';
import ProgressBar from 'react-native-progress/Bar';
import { TouchableOpacity } from 'react-native-gesture-handler';

function ListingCard(props) {
  const navigation = useNavigation();
  
  var data = props.projectData; 

  //Data 
  var currentAmount = data.currentAmount; 
  var currentState = data.currentState;
  var fundraisingDeadline = data.fundRaisingDeadline; 
  var projectCreator = data.projectCreator.toString().substring(0, 16);
  var projectDescription = data.projectDescription.length > 115 ? data.projectDescription.substring(0, 115) : data.projectDescription;
  var projectGoalAmount = data.projectGoalAmount;
  var projectImageLink = data.projectImageLink;
  var projectTitle = data.projectTitle; 
  var currentProgress = currentAmount / projectGoalAmount; 
  
  const milliseconds = fundraisingDeadline * 1000; 
  const dateObject = new Date(milliseconds)

  var dateOutput = new Date(dateObject).toLocaleDateString();
  
  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('FundraiserListing', {projectId: props.projectId, loggedIn: props.loggedIn, address: props.address, projectData: data})}
      activeOpacity={0.8}
      // Tweak so cards don't get opaque on scroll
      delayPressIn={50}>   

      <View style={styles.cardView}> 
        <CachedImage style={styles.cardImage} source={{uri: projectImageLink}} /> 

        <View style={styles.textView}>
          <Text style={styles.titleText}>{projectTitle} </Text>
          <Text style={styles.creatorInitialText}>Fundraiser created by <Text style={styles.creatorText}> {projectCreator}... </Text> </Text>
          <Text style={styles.projectDescriptionText}>{projectDescription} </Text>
          <Text style={styles.currentRaisedText}>${currentAmount} raised of ${projectGoalAmount} </Text>

          <ProgressBar progress={currentProgress} color='#35D07F' style={styles.progress}/>
          <Text style={styles.dateText}> Fundraising ends on  {dateOutput} </Text>
        </View>
      </View>      
 
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({ 
  cardView: {
    width : Dimensions.get('window').width - 25,
    height : 470,
    marginBottom : 30,
    borderRadius : 15,
    elevation: 1,
    backgroundColor : '#FFFFFF',
    overflow : 'hidden',
  }, 
  cardImage : {
      width : '100%',
      height : '55%'
  },
  textView : {
    flex : 1,
    alignItems : 'flex-start',
    justifyContent : 'flex-start',
    marginTop: 5,
    marginLeft: 7,
    marginRight: 5  
}, 
  titleText: {
    fontSize: 24, 
    color: '#2E3338',    
  },
  creatorInitialText: {
    fontSize: 18, 
    color: '#2E3338',
    marginTop: 1, 
    marginRight: 3, 
    marginLeft: 3
  }, 
  creatorText: {
    fontSize: 15,
    color: '#767676',
  },
  projectDescriptionText: {
    fontSize: 19,
    color: '#2E3338',
    marginTop: 8, 
    marginLeft: 3,
    marginRight: 6
  },
  currentRaisedText: {
    fontSize: 18,
    color: '#2E3338',
    marginTop: 20,
    marginLeft: 3
  },
  progress: {
    height: 15,
    width: 330, 
    marginTop: 3,
    marginLeft: 3,
  },
  dateText: {
    fontSize: 15,
    color: '#2E3338',
    position: 'absolute', 
    bottom: 4, 
    right: 2
  },
});

export default ListingCard;