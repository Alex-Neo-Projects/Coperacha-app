import React, { useContext } from 'react'
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LogIn from '../components/LogIn';
import AppContext from '../components/AppContext';
import ListingCard from './ListingCard';
import { ScrollView } from 'react-native-gesture-handler';

function Manage() {
  // Set the defaults for the state
  const navigation = useNavigation();
  
  const context = useContext(AppContext);
  const projectData = context.projectData; 
  const address = context.address; 
  const loggedIn = context.loggedIn; 

  var count = 0; 
  projectData.map((project, index) => {
    if (project.result.projectCreator.toLowerCase() === address) {
      count++; 
    }
  })

  return (
    <View style={styles.container}>
      {loggedIn ? ( 
        <View>
          {count === 0 ? (
            <View>
              <Text style={styles.bigText}>My Fundraisers{"\n"}</Text>
    
              <Text style={styles.title}>You have no active fundraisers</Text>
              <Text>Create a fundraiser below or browse existing fundraisers</Text>
              
              <Image style={styles.Image} source={require("../assets/nurture.png")}></Image>
    
              <Button title="New Fundraiser" onPress={() => navigation.navigate('Create')}></Button>
              
              <Text>{"\n"}</Text>
              <Button title="Settings" onPress={() => navigation.navigate('Settings')}></Button>
            </View>
          ) : ( 
            <View>
              <ScrollView>
                <Text style={styles.headerInitial}> Your <Text style={styles.header}>Fundraisers </Text> </Text>
                <Button title="Settings" onPress={() => navigation.navigate('Settings')}></Button>

                {projectData.map((project, index) => {
                  if (project.result.projectCreator.toLowerCase() === address) {
                    return <ListingCard key={index} projectId={index} projectData={project.result}/>
                  }
                })}
              </ScrollView>
            </View>
          )}
      </View>
      ) : (
        <View>
          <LogIn reason={"to view your fundraisers"} handleLogIn={context.handleLogIn}/>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8
  },
  headerInitial: { 
    fontSize: 25,
    color: '#2E3338',
    fontFamily: 'proximanova_bold',

    marginTop: 60,
    marginLeft: 10,
    marginBottom: 30,
  },
  header: {
    fontSize: 25,
    color: '#35D07F',
    fontFamily: 'proximanova_bold',
  },
  title: {
    marginVertical: 30, 
    fontSize: 20, 
    fontWeight: 'bold'
  },
  bigText: { 
    paddingTop: 40,
    fontSize: 35, 
    fontWeight: 'bold'
  },
  Image: {
    flex: 1,
    width: 250,
    height: 250,
    marginLeft: 50,
    resizeMode: 'contain'
  },
});

export default Manage;