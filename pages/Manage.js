import React, { useContext } from 'react'
import { View, Text, RefreshControl, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LogIn from '../components/LogIn';
import AppContext from '../components/AppContext';
import SingleListingCard from './SingleListingCard';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-elements';

function Manage(props) {
  const refresh = (timeout) => {
    let promise = new Promise(async function(resolve, reject) {
      var result = await props.getFeedData(); 

      if (result === "Success") {
        console.log("Resolved!");
        resolve("Promise resolved!");
      }
      else {
        console.log("Promise error"); 
        reject("Promise error");
      }
    })
    return promise; 
  }

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

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refresh(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      {loggedIn ? ( 
        <View>
          {count === 0  ? (
            <View style={styles.itemsContainer}>
              <View style={styles.headerInitial}>
                <View>
                  <Text style={styles.titleHeader}>Your <Text style={styles.header}>Fundraisers </Text> </Text>
                </View>

                <View style={styles.headerFollow}>
                  <Button title={"Settings"} 
                      buttonStyle={styles.createSettingsButton} 
                      titleStyle={styles.settingsTextStyle} 
                      type="clear"  
                      onPress={() => navigation.navigate('Settings')}/>
                </View>

              </View>

              <View style={styles.centerLoginTop}>
                <Image style={styles.Image} source={require("../assets/nurture.png")}></Image>
                <Text style={styles.titleHeader}>You have no active fundraisers!</Text>
                <Button title={"New Fundraiser"} 
                buttonStyle={styles.createFundraiserButton} 
                titleStyle={styles.fundraiserTextStyle} 
                type="solid"  
                onPress={() => navigation.navigate('Create')}/>
              </View>
            </View>
          ) : ( 
            <View style={styles.itemsContainer}>
              {/* User does have fundraisers they made */}
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
              
              <View style={styles.headerInitial}>
                <View>
                  <Text style={styles.titleHeader}>Your <Text style={styles.header}>Fundraisers </Text> </Text>
                </View>
                <View style={styles.headerFollow}>
                  <Button title={"Settings"} 
                      buttonStyle={styles.createSettingsButton} 
                      titleStyle={styles.settingsTextStyle} 
                      type="clear"  
                      onPress={() => navigation.navigate('Settings')}/>
                </View>
              </View>
     
              {projectData.map((project, index) => {
                if (project.result.projectCreator.toLowerCase() === address) {
                  return <SingleListingCard key={index} projectId={index} projectData={project.result}/>
                }
              })}
              </ScrollView>
            </View>
          )}
      </View>
      ) : (
        <View style={styles.centerLogin}>
          <Image style={styles.Image} source={require("../assets/login2.png")}></Image>
          <LogIn reason={"View your fundraisers!"} handleLogIn={context.handleLogIn}/>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff'
  },
  itemsContainer:{
    marginLeft: 10
  },
  headerInitial:{
    flexDirection: "row",
    fontSize: 25,
    color: '#2E3338',
    fontFamily: 'proximanova_bold',
    marginTop: 60,
    marginLeft: 10,
  },
  titleHeader: { 
    fontSize: 25,
    color: '#2E3338',
    fontFamily: 'proximanova_bold',
  },
  headerFollow:{
    marginLeft: 20,
    bottom: 40
  },
  header: {
    fontSize: 25,
    color: '#35D07F',
    fontFamily: 'proximanova_bold',
  },
  title: {
    fontSize: 20, 
    fontWeight: 'bold'
  },
  centerLogin: {
    marginTop: 118,
    marginBottom: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLoginTop: {
    marginBottom: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Image: {
    width: 300,
    height: 300,
    resizeMode: 'contain'
  },
  createSettingsButton: {
    marginLeft: 28,
    marginTop: 34,
    height: 40,
    width: 100,
  }, 
  settingsTextStyle: {
    fontFamily: 'proximanova_bold',
    fontSize: 18, 
    color: '#2E3338'
  },
  createFundraiserButton: {
    marginTop: 40,
    height: 40,
    marginRight: 10,
    width: Dimensions.get('window').width - 20,
    backgroundColor: "#35D07F"
  }, 
  fundraiserTextStyle: {
    fontFamily: 'proximanova_bold',
    fontSize: 18, 
    color: '#FFFFFF'
  }
});

export default Manage;