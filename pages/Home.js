import React, { useContext, useEffect } from 'react'
import '../global'
import { StyleSheet, RefreshControl, ActivityIndicator, ScrollView, View, Text, Dimensions, Platform } from 'react-native';
import ListingCard from './ListingCard';
import AppContext from '../components/AppContext';
import normalize from 'react-native-normalize';

function Home(props) {

  useEffect(() => {
    onLoad();
  }, []);

  const refresh = () => {
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
  const [loading, setLoading] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refresh().then(() => setRefreshing(false));
  }, []);

  const onLoad = React.useCallback(() => {
    setLoading(true);
    refresh().then(() => setLoading(false));
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
          <View >
            <Text style={styles.headerInitial}> Ongoing <Text style={styles.header}>Fundraisers </Text> </Text>
            
            {loading ? (
              <ActivityIndicator style={styles.container} color="#999999" size="large" />
            ) : (
              <View style={styles.container}>
                {projectData.map((project, index) => {
                  return <ListingCard key={index} projectId={index} projectData={project.result}/>
                })}
              </View>
            )}
        </View>
      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
  bodyContainer:{
    backgroundColor: '#ffffff',
    width: Dimensions.get('window').width,
    height: '100%'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },
  headerInitial: { 
    fontSize: 25,
    color: '#2E3338',
    fontFamily: 'proximanova_bold',
    marginTop: Platform.OS === 'ios' ? normalize(60): normalize(20),
    marginLeft: normalize(10),
    marginBottom: normalize(30),
  },
  header: {
    fontSize: 25,
    color: '#35D07F',
    fontFamily: 'proximanova_bold'
  }, 
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
  }
});

export default Home; 
