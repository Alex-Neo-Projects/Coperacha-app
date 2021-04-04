import React from 'react';
import { View, Button, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Card } from 'react-native-elements';
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
  var projectCreator = data.projectCreator.toString().substring(0, 8);
  var projectDescription = data.projectDescription;
  var projectGoalAmount = data.projectGoalAmount;
  var projectImageLink = data.projectImageLink;
  var projectTitle = data.projectTitle; 

  var currentProgress = currentAmount / projectGoalAmount; 

  return (

    <TouchableOpacity 
      onPress={() => navigation.navigate('FundraiserListing', {projectId: props.projectId, loggedIn: props.loggedIn, address: props.address, projectData: data})}
      activeOpacity={0.8}
      // Tweak so cards don't get opaque on scroll
      delayPressIn={50}>         
      <Card containerStyle={styles.card}>
        <Card.Image source ={{uri: projectImageLink}} style={styles.cardImage}/> 

        <View style={styles.view}>
          <Card.Title style={styles.title}>{projectTitle}</Card.Title>
          
          <Text>By: {projectCreator} {"\n"}</Text>
          <Text>{projectDescription} {"\n"}</Text>

          <Text style={styles.boldText}>${currentAmount} raised of ${projectGoalAmount}</Text>
          <ProgressBar progress={currentProgress} color='#35D07F' style={styles.progress}/>
        </View>
      </Card>
    </TouchableOpacity>

  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'column',
    alignItems:'flex-start'
  },  
  card: {
    height: 350,
    width: Dimensions.get('window').width - 20,
    borderWidth: 0,
    borderRadius: 10,
  }, 
  cardImage: {
    width : '100%',
    borderTopLeftRadius: 10, 
    borderTopRightRadius: 10
  },
  title: {
    fontSize: 30, 
    fontWeight: 'bold',
    color: "black"
  }, 
  progress: {
    width: '100%', 
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
    paddingBottom: 5,
    color: "black"
  }
});

export default ListingCard;