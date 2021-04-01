import React from 'react';
import { View, Button, Text, StyleSheet, Dimensions } from 'react-native';
import { Card } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { ListItem } from 'react-native-elements/dist/list/ListItem';
import ProgressBar from 'react-native-progress/Bar';

function ListingCard(props) {
  const navigation = useNavigation();

  // console.log('PROP Data: ');
  // console.log(props.projectData);

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

  var currentProgress = currentAmount/projectGoalAmount; 

  return (
      <Card containerStyle={styles.card}>
        <Card.Image source ={{uri: projectImageLink}} style={styles.cardImage}/> 

        <View style={styles.view}>
          <Card.Title style={styles.title}>{projectTitle}</Card.Title>
          <Text>Created by {projectCreator}</Text>
          <Text>{projectDescription}</Text>
          <Text>${currentAmount} raised of ${projectGoalAmount}</Text>
          <ProgressBar progress={currentProgress} color='#35D07F' style={styles.progress}/>
        </View>

        <View style={styles.button}> 
          {/* Push to new page with args */}
          <Button title={`Go to fundraiser`} onPress={() => navigation.navigate('Fundraiser')}/>
        </View> 
      </Card>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'column',
    alignItems:'flex-start'
  },  
  card: {
    height: 300,
    width: Dimensions.get('window').width - 20,
    borderWidth: 0,
    borderRadius: 20
  }, 
  cardImage: {
    width : '100%',
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20
  },
  title: {
    fontSize: 30, 
    marginBottom: 10
  }, 
  progress: {
    width: 300, 
  }
});

export default ListingCard;