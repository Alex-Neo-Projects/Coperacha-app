import React from 'react'
import Home from './components/Home';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FundraiserListing from './components/FundraiserListing';
import CreateListing from './components/CreateListing'; 
import Manage from './components/Manage'; 

const Tab = createBottomTabNavigator();

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="Fundraiser" component={FundraiserListing} />
    </HomeStack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStackScreen}/>
        <Tab.Screen name="Create" component={CreateListing} />
        <Tab.Screen name="Manage" component={Manage} />
      </Tab.Navigator>
{/* 
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Fundraiser" component={FundraiserListing} />
      </Stack.Navigator> */}
    </NavigationContainer>
  );
}

export default App;