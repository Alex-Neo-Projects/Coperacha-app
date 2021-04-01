import React from 'react'
import '../global'
import { StyleSheet, View, Button } from 'react-native';
import FundraiserListing from './FundraiserListing';
import ListingCard from './ListingCard';

function Home(props) {

  const projectData = props.projectData;

  return (
    <View style={styles.container}>
      {projectData.map((project) => {
        return <ListingCard projectData={project}/>
      })}
      {/* <Button
        title={`Go to fundraiser page`}
        onPress={() => navigation.navigate('Fundraiser')}
      /> */}
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
    marginVertical: 8, 
    fontSize: 20, 
    fontWeight: 'bold'
  }
});

export default Home; 
