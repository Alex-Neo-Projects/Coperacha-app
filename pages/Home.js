import React, { useContext } from 'react'
import '../global'
import { StyleSheet, View, Text } from 'react-native';
import ListingCard from './ListingCard';
import { ScrollView } from 'react-native-gesture-handler';
import AppContext from '../components/AppContext';


function Home() {
  // Current sort: Most recently created first
  const appContext = useContext(AppContext);
  const projectData = appContext.projectData; 
  
  return (
    <ScrollView> 
      <Text style={styles.headerInitial}> Ongoing <Text style={styles.header}>Fundraisers </Text> </Text>
      <View style={styles.container}>
        {projectData.map((project, index) => {
          // Need to reverse order bc the shown list is backwards. -1 bc arrays start at 0 
          var projectId = projectData.length - index - 1; 

          return <ListingCard key={index} projectId={projectId} projectData={project.result}/>
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8
  }
});

export default Home; 
