import React, { useContext } from 'react'
import '../global'
import { StyleSheet, RefreshControl, ScrollView, View, Text, Dimensions } from 'react-native';
import ListingCard from './ListingCard';
import AppContext from '../components/AppContext';
import normalize from 'react-native-normalize';

function Home(props) {
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

  // Current sort: Most recently created first
  const appContext = useContext(AppContext);
  const projectData = appContext.projectData; 
  
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refresh(2000).then(() => setRefreshing(false));
  }, []);


  return (
    <View style={styles.bodyContainer}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      > 
        <Text style={styles.headerInitial}> Ongoing <Text style={styles.header}>Fundraisers </Text> </Text>
        <View style={styles.container}>
          {projectData.map((project, index) => {
            return <ListingCard key={index} projectId={index} projectData={project.result}/>
          })}
        </View>
      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
  bodyContainer:{
    backgroundColor: '#ffffff',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  headerInitial: { 
    fontSize: 25,
    color: '#2E3338',
    fontFamily: 'proximanova_bold',

    marginTop: normalize(60),
    marginLeft: normalize(10),
    marginBottom: normalize(30),
  },
  header: {
    fontSize: 25,
    color: '#35D07F',
    fontFamily: 'proximanova_bold'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  }
});

export default Home; 
