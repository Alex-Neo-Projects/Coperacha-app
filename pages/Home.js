import React, { useContext } from 'react'
import '../global'
import { StyleSheet, View, Text } from 'react-native';
import ListingCard from './ListingCard';
import AppLoading from 'expo-app-loading';
import { ScrollView } from 'react-native-gesture-handler';
import {
  useFonts,
  EBGaramond_400Regular,
  EBGaramond_500Medium,
  EBGaramond_700Bold, 
  Jost_400Regular, 
  Jost_500Medium, 
  Jost_600SemiBold, 
  Jost_700Bold 
} from '@expo-google-fonts/dev';
import AppContext from '../components/AppContext';


function Home() {
  // Current sort: Most recently created first
  const appContext = useContext(AppContext);
  const projectData = appContext.projectData; 

  let [fontsLoaded] = useFonts({
    EBGaramond_400Regular,
    EBGaramond_500Medium,
    EBGaramond_700Bold, 
    Jost_400Regular, 
    Jost_500Medium, 
    Jost_600SemiBold, 
    Jost_700Bold 
  });
  
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ScrollView> 
      <Text style={styles.header}> Ongoing Fundraisers </Text>
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
  header: { 
    fontSize: 25,
    color: '#2E3338',
    fontFamily: 'Jost_600SemiBold',

    marginTop: 60,
    marginLeft: 14,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8
  }
});

export default Home; 
