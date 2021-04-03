import React from 'react'
import '../global'
import { StyleSheet, View, Text } from 'react-native';
import ListingCard from './ListingCard';
import { ScrollView } from 'react-native-gesture-handler';

function Home(props) {

  // Current sort: Most recently created first
  const projectData = props.projectData;
  
  return (
    <ScrollView> 
      <Text style={styles.bigText}>Fundraisers</Text>
      <View style={styles.container}>
        {projectData.map((project, i) => {
          return <ListingCard key={i} loggedIn={props.loggedIn} address={props.address} projectData={project.result} projectInstanceContract={project.projectInstanceContract}/>
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8
  },
  title: {
    marginVertical: 8, 
    fontSize: 20, 
    fontWeight: 'bold'
  },
  bigText: { 
    paddingTop: 40,
    fontSize: 35, 
    paddingLeft: 14,
    textAlign: 'left', 
    fontWeight: 'bold'
  },
});

export default Home; 
