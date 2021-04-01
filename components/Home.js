import React from 'react'
import '../global'
import { StyleSheet, View, Button } from 'react-native';
import ListingCard from './ListingCard';
import { ScrollView, RefreshControl } from 'react-native-gesture-handler';

function Home(props) {

  const projectData = props.projectData;

  return (
    <ScrollView> 
      <View style={styles.container}>
        {projectData.map((project, i) => {
          return <ListingCard key={i} projectData={project}/>
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
  },
  title: {
    marginVertical: 8, 
    fontSize: 20, 
    fontWeight: 'bold'
  }
});

export default Home; 
