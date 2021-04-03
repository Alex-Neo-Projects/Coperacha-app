import React from 'react'
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LogIn from '../components/LogIn';

function Manage(props) {
  // Set the defaults for the state
  const navigation = useNavigation();
  console.log('Manage', props);

  return (
    <View style={styles.container}>
      {props.loggedIn ? ( 
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
          <LogIn reason={"to view your fundraisers"} handleLogIn={props.handleLogIn}/>
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