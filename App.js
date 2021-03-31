import React from 'react'
import Home from './components/Home';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FundraiserListing from './components/FundraiserListing';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Fundraiser" component={FundraiserListing} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;